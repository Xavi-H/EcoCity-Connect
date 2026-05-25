// db/database.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Donde se guarda el archivo de la BD
const dbPath = path.join(__dirname, 'ecocity.db');
const dbInitPath = path.join(__dirname, 'db_init.sql');

// Conecta a la base de datos (si no existe, SQLite la crea automáticamente)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a SQLite:', err.message);
    } else {
        console.log('Conectado con éxito a la base de datos SQLite.');
        
        // Inicialización automática: si está vacía, cargamos el db_init.sql
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='objects'", (err, table) => {
            if (!table) {
                console.log("Base de datos vacía. Ahora se crean las tablas");
                const sqlInit = fs.readFileSync(dbInitPath, 'utf8');
                
                // db.exec ejecuta las sentencias SQL
                db.exec(sqlInit, (err) => {
                    if (err) {
                        console.error("Error al ejecutar el archivo db_init.sql:", err.message);
                    } else {
                        console.log("Tablas creadas e inserts iniciales completados con éxito.");
                    }
                });
            }
        });
    }
});

module.exports = db;