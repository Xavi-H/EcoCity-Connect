import db from '../db/database.js';

export const ObjectModel = {
    // Obtener todos los objetos
    async getAll() {
        return await db.all("SELECT * FROM objects");
    },

    // Obtener un objeto por ID
    async getById(id) {
        return await db.get("SELECT * FROM objects WHERE id = ?", [id]);
    },

    // Crear un nuevo objeto (POST)
    async create(objeto) {
        const { nom, descripcio, categoria, cp, estat, imatge } = objeto;
        const result = await db.run(
            "INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES (?, ?, ?, ?, ?, ?)",
            [nom, descripcio, categoria, cp, estat || 'disponible', imatge]
        );
        return { id: result.lastID, ...objeto };
    }
};