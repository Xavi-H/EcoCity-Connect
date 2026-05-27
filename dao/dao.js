import db from '../db/database.js';
import bcrypt from 'bcryptjs';

// DAO (Data Access Object): aquí van solo las consultas a la base de datos.
export const ObjectModel = {
    
    async getAll() {
        return await db.all(`
            SELECT o.*, u.username
            FROM objects o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.id DESC
        `);
    },

    async getByCategoria(categoria) {
        return await db.all(`
            SELECT o.*, u.username
            FROM objects o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.categoria = ?
            ORDER BY o.id DESC
        `, [categoria]);
    },

    async getById(id) {
        return await db.get(`
            SELECT o.*, u.username
            FROM objects o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `, [id]);
    },

    async getDistinctCategories() {
        return await db.all("SELECT DISTINCT categoria FROM objects WHERE categoria IS NOT NULL ORDER BY categoria");
    },

    async getByUserId(userId) {
        return await db.all("SELECT * FROM objects WHERE user_id = ? ORDER BY id DESC", [userId]);
    },

    async create(objecte) {
        const { nom, descripcio, categoria, cp, estat, imatge, user_id } = objecte;
        const result = await db.run(
            "INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nom, descripcio, categoria, cp, estat || 'disponible', imatge || '', user_id || null]
        );
        return { id: result.lastID, nom, descripcio, categoria, cp, estat: estat || 'disponible', imatge: imatge || '', user_id: user_id || null };
    },

    async update(id, objecte) {
        const { nom, descripcio, categoria, cp, estat, imatge } = objecte;
        const result = await db.run(
            "UPDATE objects SET nom=?, descripcio=?, categoria=?, cp=?, estat=?, imatge=? WHERE id=?",
            [nom, descripcio, categoria, cp, estat, imatge, id]
        );
        if (result.changes === 0) return null;
        return { id: parseInt(id), nom, descripcio, categoria, cp, estat, imatge };
    },

    async delete(id) {
        const result = await db.run("DELETE FROM objects WHERE id = ?", [id]);
        return result.changes > 0;
    }
};

export const UserModel = {

    async create(username, password) {
        const hash   = await bcrypt.hash(password, 10);
        const result = await db.run(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            [username, hash]
        );
        return { id: result.lastID, username };
    },

    async getByUsername(username) {
        return await db.get("SELECT * FROM users WHERE username = ?", [username]);
    },

    // Retorna l'usuari complet (inclòs is_admin) si la contrasenya és correcta
    async verifyPassword(username, password) {
        const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.password_hash);
        return valid ? { id: user.id, username: user.username, is_admin: user.is_admin } : null;
    },

    // Llista tots els usuaris sense exposar el hash de la contrasenya
    async getAll() {
        return await db.all("SELECT id, username, is_admin FROM users ORDER BY id");
    }
};

export const SolicitudModel = {

    async create(object_id, solicitant_id, missatge) {
        const result = await db.run(
            "INSERT INTO solicituds (object_id, solicitant_id, missatge) VALUES (?, ?, ?)",
            [object_id, solicitant_id, missatge || '']
        );
        return { id: result.lastID, object_id, solicitant_id, missatge, estat: 'pendent' };
    },

    async existeix(object_id, solicitant_id) {
        const row = await db.get(
            "SELECT id FROM solicituds WHERE object_id = ? AND solicitant_id = ?",
            [object_id, solicitant_id]
        );
        return !!row;
    },

    async getBySolicitant(solicitant_id) {
        return await db.all(`
            SELECT s.id, s.estat, s.missatge, s.created_at,
                   o.id AS object_id, o.nom, o.descripcio, o.categoria, o.cp, o.imatge, o.estat AS object_estat,
                   u.username AS propietari
            FROM solicituds s
            JOIN objects o   ON s.object_id     = o.id
            LEFT JOIN users u ON o.user_id       = u.id
            WHERE s.solicitant_id = ?
            ORDER BY s.created_at DESC
        `, [solicitant_id]);
    },

    async getByPropietari(propietari_id) {
        return await db.all(`
            SELECT s.id, s.estat, s.missatge, s.created_at,
                   o.id AS object_id, o.nom, o.categoria, o.cp,
                   u.username AS solicitant
            FROM solicituds s
            JOIN objects o ON s.object_id     = o.id
            JOIN users   u ON s.solicitant_id = u.id
            WHERE o.user_id = ?
            ORDER BY s.created_at DESC
        `, [propietari_id]);
    },

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

    async delete(id, solicitant_id) {
        const result = await db.run(
            "DELETE FROM solicituds WHERE id = ? AND solicitant_id = ? AND estat = 'pendent'",
            [id, solicitant_id]
        );
        return result.changes > 0;
    }
};