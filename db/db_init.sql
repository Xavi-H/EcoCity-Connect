DROP TABLE IF EXISTS solicituds;
DROP TABLE IF EXISTS objects;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0  -- 0 = usuari normal, 1 = administrador
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
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Taladro', 'Taladro potent.', 'Eines', '08001', 'disponible', 'https://correos-market.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/255303-ynqu5t1b-edh-taladro-percutor-electrico-710w-230v-ajuste-de-velocidad-1.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Bicicleta', 'Ideal per a fer una volta pel port.', 'Transport', '08003', 'prestat', 'https://contents.mediadecathlon.com/p3111368/k$ce9079f4dbe3a58fc87b1e6912e1a3eb/picture.jpg?format=auto&f=3000x0', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Escala plegable', 'Escala d''alumini de 5 esglaons, lleugera i facil de guardar.', 'Eines', '08012', 'disponible', 'https://ferreterialepanto.com/25481-large_default/escalera-plegable-4-peldanos-de-aluminio-escalera-de-tijera-resistente-y-ligera-antideslizante-uso-domestico-soporta-150-kg.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Projector', 'Projector HD ideal per a cinema a casa o presentacions.', 'Electronica', '08005', 'disponible', 'https://images-cdn.ubuy.co.in/664b0dcbd6b4f33ed442e2c1-xuanpad-projector-2024-upgraded-mini.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Carret de la compra', 'Carret amb rodes per transportar compres pesades.', 'Llar', '08024', 'prestat', 'https://bosses.cat/10665-large_default/carret-de-compra.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Tenda de campanya', 'Tenda per a 3 persones, facil de muntar.', 'Outdoor', '08016', 'disponible', 'https://cdn.juguetilandia.com/images/articulos/1999958617g00.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Tallagespa electric', 'Tallagespa per jardins petits i mitjans.', 'Jardineria', '08017', 'disponible', 'https://www.fesmes.com/114929/tallagespa-electric-powerplus-poweg62203.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Cadira plegable', 'Cadira comoda per a convidats.', 'Mobles', '08009', 'disponible', 'https://www.fesmes.com/21761-large_default/silla-plegable-acolchada-basic-azul.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Maleta gran', 'Maleta rigida ideal per a viatges llargs.', 'Viatge', '08021', 'prestat', 'https://www.maletia.com/25498-large_default/maleta-grande-gladiator-metro-negra.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Cadires de camping', 'Pack de 2 cadires plegables per exterior.', 'Outdoor', '08022', 'disponible', 'https://contents.mediadecathlon.com/p2598175/k$ef0cd18cf948c705e900c9cf2e92dc64/picture.jpg?format=auto&f=3000x0', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Barbacoa portatil', 'Barbacoa compacta per a terrassa o excursions.', 'Cuina', '08019', 'disponible', 'https://www.thebarbecuestore.es/WebRoot/StoreES2/Shops/62082927/594D/00B6/32EE/E9C7/70AF/C0A8/2BBA/E8D9/Barbacoa_Portatil_Billy_1.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Maquina de cosir', 'Maquina electrica per a reparacions i projectes textils.', 'Llar', '08010', 'disponible', 'https://m.media-amazon.com/images/I/51Fyggw4lSS._AC_UF894,1000_QL80_.jpg', NULL);
INSERT INTO objects (nom, descripcio, categoria, cp, estat, imatge, user_id) VALUES ('Nevera portatil', 'Nevera per mantenir begudes i menjar fresc.', 'Outdoor', '08026', 'prestat', 'https://www.tiendasmgi.es/40127/nevera-portatil-atlantic-30l.jpg', NULL);