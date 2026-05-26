import db from '../db/database.js';
import bcrypt from 'bcryptjs';

// DAO (Data Access Object): aquí van solo las consultas a la base de datos.
export const ObjectModel = {

    // GET tots els objectes
    async getAll() {
        return await db.all("SELECT * FROM objects");
    },

    // GET objectes filtrats per categoria
    async getByCategoria(categoria) {
        return await db.all("SELECT * FROM objects WHERE categoria = ?", [categoria]);
    },

    // GET un objecte per ID
    async getById(id) {
        return await db.get("SELECT * FROM objects WHERE id = ?", [id]);
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
        // result.changes indica quantes files es van modificar
        if (result.changes === 0) return null; // No existia aquest ID
        return { id: parseInt(id), nom, descripcio, categoria, cp, estat, imatge };
    },

    // DELETE - Eliminar un objecte
    async delete(id) {
        const result = await db.run("DELETE FROM objects WHERE id = ?", [id]);
        return result.changes > 0; // true si es va borrar, false si no existia
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
    async verifyPassword(username, password) {
        const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.password);
        return valid ? { id: user.id, username: user.username } : null;
    }
};