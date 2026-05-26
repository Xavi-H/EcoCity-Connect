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

-- Inserir objectes basics de prova
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Taladro', 'Taladro potent.', 'Eines', '08001', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Bicicleta', 'Ideal per a fer una volta pel port.', 'Transport', '08003', 'prestat', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Escala plegable', 'Escala d''alumini de 5 esglaons, lleugera i fàcil de guardar.', 'Eines', '08012', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Projector', 'Projector HD ideal per a cinema a casa o presentacions.', 'Electrònica', '08005', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Carret de la compra', 'Carret amb rodes per transportar compres pesades.', 'Llar', '08024', 'prestat', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Tenda de campanya', 'Tenda per a 3 persones, fàcil de muntar.', 'Outdoor', '08016', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Tallagespa elèctric', 'Tallagespa per jardins petits i mitjans.', 'Jardineria', '08017', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Cadira plegable', 'Cadira còmoda per a convidats.', 'Mobles', '08009', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Maleta gran', 'Maleta rígida ideal per a viatges llargs.', 'Viatge', '08021', 'prestat', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Cadires de càmping', 'Pack de 2 cadires plegables per exterior.', 'Outdoor', '08022', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Barbacoa portàtil', 'Barbacoa compacta per a terrassa o excursions.', 'Cuina', '08019', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Màquina de cosir', 'Màquina elèctrica per a reparacions i projectes tèxtils.', 'Llar', '08010', 'disponible', '');
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge) VALUES ('Nevera portàtil', 'Nevera per mantenir begudes i menjar fresc.', 'Outdoor', '08026', 'prestat', '');