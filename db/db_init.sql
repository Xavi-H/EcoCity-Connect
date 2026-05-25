DROP TABLE IF EXISTS objects;

CREATE TABLE objects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    descripcio TEXT,
    categoria TEXT NOT NULL,
    cp TEXT NOT NULL,
    estat TEXT DEFAULT 'disponible',
    imatge TEXT
);

-- 3. Hacemos los INSERTS de tus productos del JSON
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) 
VALUES (
    'Taladro', 
    'Taladro potent.', 
    'Eines', 
    '08001', 
    'disponible', 
    'https://url-de-tu-imagen.webp'
);

INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) 
VALUES (
    'Bicicleta', 
    'Ideal per a fer una volta pel port.', 
    'Transport', 
    '08003', 
    'prestado', 
    'https://url-de-tu-imagen2.webp'
);