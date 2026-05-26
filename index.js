import express from "express";
import path from "path"; // Manejar rutas de carpetas
import { fileURLToPath } from 'url';
import { ObjectModel, UserModel, SolicitudModel } from "./dao/dao.js";
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // __dirname es la carpeta actual

const APP = express(); // Aquest es el servidor web
const PORT = 3000; // El port que escoltara el servidor


// ==== CONFIGURACIÓ ====
APP.use(express.json()); // Para que el servidor pueda leer datos JSON para las peticions
APP.use(express.static('public')); // fa que la carpeta public sigui visible al servidor
APP.use(session({
    secret: 'ecocity_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hores
}));

// Helpers de permisos
function requereixSessio(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ error: 'Cal iniciar sessió' });
    next();
}

function requereixAdmin(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ error: 'Cal iniciar sessió' });
    if (!req.session.isAdmin) return res.status(403).json({ error: 'Accés restringit a administradors' });
    next();
}

// Autenticació
APP.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Usuari i contrasenya obligatoris' });
    if (password.length < 4)    return res.status(400).json({ error: 'La contrasenya ha de tenir mínim 4 caràcters' });
    try {
        const existent = await UserModel.getByUsername(username);
        if (existent) return res.status(409).json({ error: 'Aquest nom d\'usuari ja existeix' });
        const user = await UserModel.create(username, password);
        req.session.userId   = user.id;
        req.session.username = user.username;
        req.session.isAdmin  = false;
        res.status(201).json({ id: user.id, username: user.username, isAdmin: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

APP.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Usuari i contrasenya obligatoris' });
    try {
        const user = await UserModel.verifyPassword(username, password);
        if (!user) return res.status(401).json({ error: 'Credencials incorrectes' });
        req.session.userId   = user.id;
        req.session.username = user.username;
        req.session.isAdmin  = !!user.is_admin;
        res.json({ id: user.id, username: user.username, isAdmin: !!user.is_admin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

APP.post('/api/logout', (req, res) => {
    req.session.destroy(() => res.json({ missatge: 'Sessió tancada' }));
});

// Retorna l'estat de la sessió actual (usada per totes les pàgines)
APP.get('/api/me', (req, res) => {
    if (!req.session.userId) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, id: req.session.userId, username: req.session.username, isAdmin: !!req.session.isAdmin });
});


// OBJECTES


// GET /api/categories — llista de categories úniques existents a la BD
APP.get('/api/categories', async (req, res) => {
    try {
        const rows = await ObjectModel.getAll();
        const cats = [...new Set(rows.map(o => o.categoria))].filter(Boolean).sort();
        res.json(cats);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// GET /api/objects → Obtener todos los objetos
// Es pot filtrar per categoria: GET /api/objects?categoria=Eines
APP.get('/api/objects', async (req, res) => {
    try {
        const { categoria } = req.query;
        const data = categoria
            ? await ObjectModel.getByCategoria(categoria)
            : await ObjectModel.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// GET /api/objects/meus — objectes de l'usuari en sessió
APP.get('/api/objects/meus', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Cal iniciar sessió' });
    try {
        const data = await ObjectModel.getByUserId(req.session.userId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// GET /api/objects/:id → Obtener un objeto por ID
APP.get('/api/objects/:id', async (req, res) => {
    try {
        const obj = await ObjectModel.getById(parseInt(req.params.id));
        if (!obj) return res.status(404).json({ error: 'Objecte no trobat' });
        res.json(obj);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// POST /api/objects → Crear un objeto nuevo
// Body (JSON): { nom, descripcio, categoria, cp, estat, imatge }
APP.post('/api/objects', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Cal iniciar sessió per crear objectes' });
    const { nom, descripcio, categoria, cp, estat, imatge } = req.body;
    if (!nom || !categoria || !cp) return res.status(400).json({ error: 'nom, categoria i cp són obligatoris' });
    try {
        const nou = await ObjectModel.create({ nom, descripcio, categoria, cp, estat, imatge, user_id: req.session.userId });
        res.status(201).json(nou);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// PUT /api/objects/:id
// Permès si: ets el propietari O ets admin
APP.put('/api/objects/:id', requereixSessio, async (req, res) => {
    const id = parseInt(req.params.id);
    const { nom, descripcio, categoria, cp, estat, imatge } = req.body;
    if (!nom || !categoria || !cp) return res.status(400).json({ error: 'nom, categoria i cp són obligatoris' });
    try {
        const existent = await ObjectModel.getById(id);
        if (!existent) return res.status(404).json({ error: 'Objecte no trobat' });

        // Admin pot editar qualsevol; usuari normal només el seu
        if (!req.session.isAdmin && existent.user_id !== req.session.userId) {
            return res.status(403).json({ error: 'No tens permís per editar aquest objecte' });
        }
        const actualitzat = await ObjectModel.update(id, { nom, descripcio, categoria, cp, estat, imatge });
        res.json(actualitzat);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// DELETE /api/objects/:id
// Permès si: ets el propietari O ets admin
APP.delete('/api/objects/:id', requereixSessio, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const existent = await ObjectModel.getById(id);
        if (!existent) return res.status(404).json({ error: 'Objecte no trobat' });

        if (!req.session.isAdmin && existent.user_id !== req.session.userId) {
            return res.status(403).json({ error: 'No tens permís per eliminar aquest objecte' });
        }
        await ObjectModel.delete(id);
        res.json({ missatge: 'Objecte eliminat', id });
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});


// ADMIN — endpoints exclusius


// GET /api/admin/users — llista tots els usuaris (només admin)
APP.get('/api/admin/users', requereixAdmin, async (req, res) => {
    try {
        const users = await UserModel.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// GET /api/admin/stats — estadístiques generals (només admin)
APP.get('/api/admin/stats', requereixAdmin, async (req, res) => {
    try {
        const objects  = await ObjectModel.getAll();
        const users    = await UserModel.getAll();
        res.json({
            totalObjects:      objects.length,
            disponibles:       objects.filter(o => o.estat === 'disponible').length,
            prestats:          objects.filter(o => o.estat === 'prestat').length,
            totalUsers:        users.length,
            categories:        [...new Set(objects.map(o => o.categoria))].length
        });
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});


// SOL·LICITUDS


APP.post('/api/solicituds', requereixSessio, async (req, res) => {
    const { object_id, missatge } = req.body;
    if (!object_id) return res.status(400).json({ error: 'object_id és obligatori' });
    try {
        const obj = await ObjectModel.getById(object_id);
        if (!obj) return res.status(404).json({ error: 'Objecte no trobat' });
        if (obj.user_id === req.session.userId) return res.status(400).json({ error: 'No pots sol·licitar el teu propi objecte' });
        if (obj.estat !== 'disponible') return res.status(400).json({ error: 'Aquest objecte no està disponible' });
        const jaExisteix = await SolicitudModel.existeix(object_id, req.session.userId);
        if (jaExisteix) return res.status(409).json({ error: 'Ja has sol·licitat aquest objecte' });
        const nova = await SolicitudModel.create(object_id, req.session.userId, missatge);
        res.status(201).json(nova);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

APP.get('/api/solicituds/enviades', requereixSessio, async (req, res) => {
    try {
        res.json(await SolicitudModel.getBySolicitant(req.session.userId));
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

APP.get('/api/solicituds/rebudes', requereixSessio, async (req, res) => {
    try {
        res.json(await SolicitudModel.getByPropietari(req.session.userId));
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

APP.patch('/api/solicituds/:id/estat', requereixSessio, async (req, res) => {
    const id = parseInt(req.params.id);
    const { estat } = req.body;
    if (!['acceptada', 'rebutjada'].includes(estat)) return res.status(400).json({ error: 'estat ha de ser acceptada o rebutjada' });
    try {
        const result = await SolicitudModel.updateEstat(id, estat, req.session.userId);
        if (!result) return res.status(403).json({ error: 'No tens permís o la sol·licitud no existeix' });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

APP.delete('/api/solicituds/:id', requereixSessio, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const ok = await SolicitudModel.delete(id, req.session.userId);
        if (!ok) return res.status(403).json({ error: 'No pots cancel·lar aquesta sol·licitud' });
        res.json({ missatge: 'Sol·licitud cancel·lada', id });
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// Arrel (Mostra l'index)
APP.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

APP.listen(PORT, () => {
    console.log(`Servidor EcoCity Connect funcionant en http://localhost:${PORT}`);
});