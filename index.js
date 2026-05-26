import express from "express";
import path from "path"; // Manejar rutas de carpetas
import { fileURLToPath } from 'url';
import { ObjectModel } from "./dao/dao.js";
import session from 'express-session';

// Necesario para usar __dirname con ES Modules
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

// ==== Endpoints (API REST) ====

// Autenticació
// POST /api/register
APP.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Usuari i contrasenya obligatoris' });
    if (password.length < 4) return res.status(400).json({ error: 'La contrasenya ha de tenir mínim 4 caràcters' });

    try {
        const existent = await UserModel.getByUsername(username);
        if (existent) return res.status(409).json({ error: 'Aquest nom d\'usuari ja existeix' });

        const user = await UserModel.create(username, password);
        req.session.userId = user.id;
        req.session.username = user.username;
        res.status(201).json({ id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// POST /api/login
APP.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Usuari i contrasenya obligatoris' });

    try {
        const user = await UserModel.verifyPassword(username, password);
        if (!user) return res.status(401).json({ error: 'Credencials incorrectes' });

        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// POST /api/logout
APP.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ missatge: 'Sessió tancada' });
    });
});

// GET /api/me — retorna l'usuari de la sessió actual
APP.get('/api/me', (req, res) => {
    if (!req.session.userId) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, id: req.session.userId, username: req.session.username });
});

// Mostrara l'index.html quan es consulti l'arrel
APP.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /api/objects → Obtener todos los objetos
// Es pot filtrar per categoria: GET /api/objects?categoria=Eines
APP.get('/api/objects', async (req, res) => {
    try {
        const { categoria } = req.query;
        let data;
        if (categoria) {
            data = await ObjectModel.getByCategoria(categoria);
        } else {
            data = await ObjectModel.getAll();
        }
        res.json(data);
    } catch (error) {
        console.error(error);
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
        const id = parseInt(req.params.id);
        const objeto = await ObjectModel.getById(id);
        if (!objeto) {
            return res.status(404).json({ error: 'Objecte no trobat' });
        }
        res.json(objeto);
    } catch (error) {
        console.error(error);
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

// PUT /api/objects/:id → Actualizar un objeto existente
// Body (JSON): { nom, descripcio, categoria, cp, estat, imatge }
APP.put('/api/objects/:id', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Cal iniciar sessió' });
    const id = parseInt(req.params.id);
    const { nom, descripcio, categoria, cp, estat, imatge } = req.body;
    if (!nom || !categoria || !cp) return res.status(400).json({ error: 'nom, categoria i cp són obligatoris' });

    try {
        const existent = await ObjectModel.getById(id);
        if (!existent) return res.status(404).json({ error: 'Objecte no trobat' });
        if (existent.user_id !== req.session.userId) return res.status(403).json({ error: 'No tens permís per editar aquest objecte' });

        const actualitzat = await ObjectModel.update(id, { nom, descripcio, categoria, cp, estat, imatge });
        res.json(actualitzat);
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// DELETE /api/objects/:id → Eliminar un objeto
APP.delete('/api/objects/:id', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Cal iniciar sessió' });
    const id = parseInt(req.params.id);

    try {
        const existent = await ObjectModel.getById(id);
        if (!existent) return res.status(404).json({ error: 'Objecte no trobat' });
        if (existent.user_id !== req.session.userId) return res.status(403).json({ error: 'No tens permís per eliminar aquest objecte' });

        await ObjectModel.delete(id);
        res.json({ missatge: 'Objecte eliminat', id });
    } catch (err) {
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// El servidor escolta el port que rep com a parametre
APP.listen(PORT, () => {
    console.log(`Servidor de EcoCity Connect funcionant en http://localhost:${PORT}`);
});






// VERSION ANTIGUA PARA EL PC DE CLASE Usamos 'require' en lugar de 'import' (CommonJS es más compatible)
/*
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express(); // Cambiado a minúsculas por convención
const PORT = 3000;

// Configuración básica compatible
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Función para leer el JSON
function readData() {
    try {
        const data = fs.readFileSync("./objects.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo JSON:", error.message);
        return [];
    }
}

// RUTA RAIZ: Envía el index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// RUTA API: Devuelve los objetos
app.get('/api/objects', function(req, res) {
    const data = readData();
    res.json(data);
});

// GET objecte per id
app.get('/api/objects/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id); // Objecte req té l'arguments params que permet accedir als parametres de la url
  const item = data.objectes.find(i => i.id == id);
  if (!item) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  res.json(item); // Retorna un objecte
});

// GET objecte per categoria
app.get('/api/objects/:categoria', (req, res) => {
  const data = readData();
  const categoria = req.params.categoria; // Valor rebut per url
  const items = data.objectes.filter(i => i.categoria == categoria);
  if (items.length === 0) {
    return res.status(404).json({ error: 'No hi ha cap objecte' });
  }
  res.json(items);
});

// POST per afegir un objecte nou
app.post('/api/objects', function(req, res) {
    const data = readData();
    const nouObjecte = req.body; // Rep l'enviat pel formulari
    
    // S'assigna un ID nou automàtic
    nouObjecte.id = data.objectes.length + 1;
    data.objectes.push(nouObjecte);
    
    // Guarda al fitxer JSON
    fs.writeFileSync('./objects.json', JSON.stringify(data, null, 2)); // 
    
    res.status(201).json(nouObjecte);
});


app.listen(PORT, function() {
    console.log("Servidor EcoCity Connect viu en: http://localhost:" + PORT);
});
*/