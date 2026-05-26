import db from '../db/database.js';
import bcrypt from 'bcryptjs';

// DAO (Data Access Object): aquí van solo las consultas a la base de datos.
export const ObjectModel = {

    // GET tots els objectes (inclou el username del propietari)
    async getAll() {
        return await db.all(`
            SELECT o.*, u.username
            FROM objects o
            LEFT JOIN users u ON o.user_id = u.id
        `);
    },

    // GET objectes filtrats per categoria
    async getByCategoria(categoria) {
        return await db.all(`
            SELECT o.*, u.username
            FROM objects o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.categoria = ?
        `, [categoria]);
    },

    // GET un objecte per ID (inclou el username del propietari)
    async getById(id) {
        return await db.get(`
            SELECT o.*, u.username
            FROM objects o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `, [id]);
    },

    // GET objectes d'un usuari concret
    async getByUserId(userId) {
        return await db.all("SELECT * FROM objects WHERE user_id = ?", [userId]);
    },

    // POST - Crear un objecte nou
    async create(objecte) {
        const { nom, descripcio, categoria, cp, estat, imatge, user_id } = objecte;
        const result = await db.run(
            "INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nom, descripcio, categoria, cp, estat || 'disponible', imatge || '', user_id || null]
        );
        return { id: result.lastID, nom, descripcio, categoria, cp, estat: estat || 'disponible', imatge: imatge || '', user_id: user_id || null };
    },

    // PUT - Modificar un objecte existent
    async update(id, objecte) {
        const { nom, descripcio, categoria, cp, estat, imatge } = objecte;
        const result = await db.run(
            "UPDATE objects SET nom = ?, descripcio = ?, categoria = ?, cp = ?, estat = ?, imatge = ? WHERE id = ?",
            [nom, descripcio, categoria, cp, estat, imatge, id]
        );
        if (result.changes === 0) return null;
        return { id: parseInt(id), nom, descripcio, categoria, cp, estat, imatge };
    },

    // DELETE - Eliminar un objecte
    async delete(id) {
        const result = await db.run("DELETE FROM objects WHERE id = ?", [id]);
        return result.changes > 0;
    }
};

export const UserModel = {

    // Crear un nou usuari (amb contrasenya hashejada)
    async create(username, password) {
        const hash = await bcrypt.hash(password, 10);
        const result = await db.run(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            [username, hash]
        );
        return { id: result.lastID, username };
    },

    // Obtenir usuari per nom d'usuari
    async getByUsername(username) {
        return await db.get("SELECT * FROM users WHERE username = ?", [username]);
    },

    // Verificar contrasenya: retorna l'usuari si és correcta, null si no
    // FIX: la columna a la BD es diu password_hash, no password
    async verifyPassword(username, password) {
        const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.password_hash);
        return valid ? { id: user.id, username: user.username } : null;
    }
};

export const SolicitudModel = {

    // Crear una nova sol·licitud
    async create(object_id, solicitant_id, missatge) {
        const result = await db.run(
            "INSERT INTO solicituds (object_id, solicitant_id, missatge) VALUES (?, ?, ?)",
            [object_id, solicitant_id, missatge || '']
        );
        return { id: result.lastID, object_id, solicitant_id, missatge, estat: 'pendent' };
    },

    // Comprovar si ja existeix una sol·licitud pendent/acceptada per evitar duplicats
    async existeix(object_id, solicitant_id) {
        const row = await db.get(
            "SELECT id FROM solicituds WHERE object_id = ? AND solicitant_id = ?",
            [object_id, solicitant_id]
        );
        return !!row;
    },

    // Sol·licituds enviades per un usuari (les que ell ha fet)
    async getBySolicitant(solicitant_id) {
        return await db.all(`
            SELECT s.id, s.estat, s.missatge, s.created_at,
                   o.id AS object_id, o.nom, o.descripcio, o.categoria, o.cp, o.imatge, o.estat AS object_estat,
                   u.username AS propietari
            FROM solicituds s
            JOIN objects o ON s.object_id = o.id
            LEFT JOIN users u ON o.user_id = u.id
            WHERE s.solicitant_id = ?
            ORDER BY s.created_at DESC
        `, [solicitant_id]);
    },

    // Sol·licituds rebudes: les dels objectes que pertanyen a l'usuari
    async getByPropietari(propietari_id) {
        return await db.all(`
            SELECT s.id, s.estat, s.missatge, s.created_at,
                   o.id AS object_id, o.nom, o.categoria, o.cp,
                   u.username AS solicitant
            FROM solicituds s
            JOIN objects o ON s.object_id = o.id
            JOIN users u ON s.solicitant_id = u.id
            WHERE o.user_id = ?
            ORDER BY s.created_at DESC
        `, [propietari_id]);
    },

    // Canviar estat (acceptada / rebutjada) — només el propietari
    async updateEstat(id, estat, propietari_id) {
        const sol = await db.get(`
            SELECT s.id FROM solicituds s
            JOIN objects o ON s.object_id = o.id
            WHERE s.id = ? AND o.user_id = ?
        `, [id, propietari_id]);
        if (!sol) return null;
        await db.run("UPDATE solicituds SET estat = ? WHERE id = ?", [estat, id]);
        return { id, estat };
    },

    // Cancel·lar — només el sol·licitant i si és pendent
    async delete(id, solicitant_id) {
        const result = await db.run(
            "DELETE FROM solicituds WHERE id = ? AND solicitant_id = ? AND estat = 'pendent'",
            [id, solicitant_id]
        );
        return result.changes > 0;
    }
};