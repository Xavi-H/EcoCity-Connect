import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Necesario para emular __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'ecocity.db');
const dbInitPath = path.join(__dirname, 'db_init.sql');

// Abrir la conexión con soporte para Promesas (async/await)
const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
});

// Iniciar las tablas automaticamente si no existen
try {
    const taulaExisteix = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    if (!taulaExisteix) {
        console.log("Configurant taules inicials des de db_init.sql...");
        const sqlInit = fs.readFileSync(dbInitPath, 'utf8');
        await db.exec(sqlInit);
        console.log("Base de dades inicialitzada amb èxit.");
    }
} catch (error) {
    console.error("Error inicialitzant la base de dades:", error.message);
}

export default db;