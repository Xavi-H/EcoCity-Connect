DROP TABLE IF EXISTS objects;
DROP TABLE IF EXISTS admins;

-- user_id: ID anónimo generado en el navegador del usuario para identificar los productos creados
CREATE TABLE objects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    descripcio TEXT,
    categoria TEXT NOT NULL,
    cp TEXT NOT NULL,
    estat TEXT DEFAULT 'disponible',
    imatge TEXT,
    user_id TEXT NOT NULL DEFAULT 'anonymous'
);

-- Tabla de admins (login con JWT)
CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

-- Admin per defecte: usuari "admin", contrasenya "admin123"
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2b$10$Jei4lQxTRe6eoRSVcBUjZuu5df5Qqgp2XLLE4zMup/UbtbC3iG2Mm');

-- Dades inicials (user_id 'seed' = objectes de mostra que ja existien)
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Taladro', 'Taladro potent.', 'Eines', '08001', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Bicicleta', 'Ideal per a fer una volta pel port.', 'Transport', '08003', 'prestat', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Escala plegable', 'Escala d''alumini de 5 esglaons, lleugera i facil de guardar.', 'Eines', '08012', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Projector', 'Projector HD ideal per a cinema a casa o presentacions.', 'Electronica', '08005', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Carret de la compra', 'Carret amb rodes per transportar compres pesades.', 'Llar', '08024', 'prestat', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Tenda de campanya', 'Tenda per a 3 persones, facil de muntar.', 'Outdoor', '08016', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Tallagespa electric', 'Tallagespa per jardins petits i mitjans.', 'Jardineria', '08017', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Cadira plegable', 'Cadira comoda per a convidats.', 'Mobles', '08009', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Maleta gran', 'Maleta rigida ideal per a viatges llargs.', 'Viatge', '08021', 'prestat', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Cadires de camping', 'Pack de 2 cadires plegables per exterior.', 'Outdoor', '08022', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Barbacoa portatil', 'Barbacoa compacta per a terrassa o excursions.', 'Cuina', '08019', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Maquina de cosir', 'Maquina electrica per a reparacions i projectes textils.', 'Llar', '08010', 'disponible', '', 'seed');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Nevera portatil', 'Nevera per mantenir begudes i menjar fresc.', 'Outdoor', '08026', 'prestat', '', 'seed');