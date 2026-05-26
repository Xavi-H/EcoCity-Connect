DROP TABLE IF EXISTS solicituds;
DROP TABLE IF EXISTS objects;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin      INTEGER DEFAULT 0  -- 0 = usuari normal, 1 = administrador
);

CREATE TABLE objects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    descripcio TEXT,
    categoria TEXT NOT NULL,
    cp TEXT NOT NULL,
    estat TEXT DEFAULT 'disponible',
    imatge TEXT,
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE solicituds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id INTEGER NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
    solicitant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    missatge TEXT,
    estat TEXT DEFAULT 'pendent', -- pendent | acceptada | rebutjada
    created_at TEXT DEFAULT (datetime('now'))
);

-- Admin per defecte: usuari "admin", contrasenya "admin1234"
-- Hash generat amb bcryptjs (cost 10)
INSERT INTO users (username, password_hash, is_admin)
VALUES ('admin', '$2b$10$Jei4lQxTRe6eoRSVcBUjZuu5df5Qqgp2XLLE4zMup/UbtbC3iG2Mm', 1);

-- Dades inicials (user_id NULL = objectes de mostra sense propietari real)
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Taladro', 'Taladro potent.', 'Eines', '08001', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Bicicleta', 'Ideal per a fer una volta pel port.', 'Transport', '08003', 'prestat', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Escala plegable', 'Escala d''alumini de 5 esglaons, lleugera i facil de guardar.', 'Eines', '08012', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Projector', 'Projector HD ideal per a cinema a casa o presentacions.', 'Electronica', '08005', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Carret de la compra', 'Carret amb rodes per transportar compres pesades.', 'Llar', '08024', 'prestat', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Tenda de campanya', 'Tenda per a 3 persones, facil de muntar.', 'Outdoor', '08016', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Tallagespa electric', 'Tallagespa per jardins petits i mitjans.', 'Jardineria', '08017', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Cadira plegable', 'Cadira comoda per a convidats.', 'Mobles', '08009', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Maleta gran', 'Maleta rigida ideal per a viatges llargs.', 'Viatge', '08021', 'prestat', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Cadires de camping', 'Pack de 2 cadires plegables per exterior.', 'Outdoor', '08022', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Barbacoa portatil', 'Barbacoa compacta per a terrassa o excursions.', 'Cuina', '08019', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Maquina de cosir', 'Maquina electrica per a reparacions i projectes textils.', 'Llar', '08010', 'disponible', '', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Nevera portatil', 'Nevera per mantenir begudes i menjar fresc.', 'Outdoor', '08026', 'prestat', '', NULL);