import db from '../db/database.js';

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

    // POST - Crear un objecte nou
    async create(objecte) {
        const { nom, descripcio, categoria, cp, estat, imatge } = objecte;
        const result = await db.run(
            "INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES (?, ?, ?, ?, ?, ?)",
            [nom, descripcio, categoria, cp, estat || 'disponible', imatge || '']
        );
        return { id: result.lastID, nom, descripcio, categoria, cp, estat: estat || 'disponible', imatge: imatge || '' };
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