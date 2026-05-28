# EcoCity Connect

**Projecte Final de Curs — Desenvolupament d'Aplicacions Web (DAW)**

---

## Descripció del projecte

EcoCity Connect és una plataforma de préstec d'objectes entre veïns. La idea és senzilla: en lloc de comprar eines, estris o equipament d'ús esporàdic, els veïns d'un mateix barri poden publicar-los i deixar-los als altres a través d'un sistema de sol·licituds.

El projecte s'emmarca en l'**economia circular** i s'alinea amb l'**ODS 12** (Producció i Consum Responsables) de l'Agenda 2030 de l'ONU: cada préstec evita una compra nova, i per tant una fabricació, un consum de matèries primeres i una generació de residus.

---

## Tecnologies utilitzades

| Capa | Tecnologia |
|---|---|
| Servidor | Node.js + Express |
| Base de dades | SQLite (via `sqlite` + `sqlite3`) |
| Autenticació | `express-session` + `bcryptjs` |
| Frontend | HTML5, CSS3, JavaScript |
| Eines de dev | nodemon |


---

## Estructura del projecte

```
EcoCity-Connect/
├── index.js                  # Servidor Express: totes les rutes API
├── package.json
├── dao/
│   └── dao.js                # Capa d'accés a dades (UserModel, ObjectModel, SolicitudModel)
├── db/
│   ├── database.js           # Connexió i inicialització de SQLite
│   ├── db_init.sql           # Esquema de la BD i dades inicials
│   └── ecocity.db            # Fitxer de la base de dades (generat en arrencar)
└── public/
    ├── index.html            # Pàgina d'inici
    ├── style/
    │   └── style.css
    ├── js/
    │   ├── components.js     # Carrega header/footer i inicialitza la UI d'autenticació
    │   ├── modeFosc.js      
    │   └── objectes-editor.js # Mòdul compartit: modal d'edició + selector de categories
    ├── includes/
    │   ├── header.html       # Capçalera i modal login/registre
    │   └── footer.html
    └── view/
        ├── catalegGeneral.html
        ├── panellUsuari.html
        ├── createObject.html
        ├── detallsProducte.html
        ├── solicituds.html
        ├── admin.html
        ├── guiaEconomiaCircular.html
        ├── analisiEmpresa.html
        ├── preguntesFrequents.html
        └── sobreMi.html
```

---

## Instal·lació i execució

**Requisits:** Node.js 18 o superior.

```bash
# 1. Clonar o descomprimir el projecte
cd EcoCity-Connect

# 2. Instal·lar dependències
npm install

# 3. Arrencar el servidor en mode desenvolupament
npm run dev
```

El servidor escolta a **http://localhost:3000**

La base de dades (`ecocity.db`) es crea automàticament en el primer arrencament amb l'esquema i les dades de mostra del fitxer `db_init.sql`.

**Credencials de l'administrador per defecte:**

| Camp | Valor |
|---|---|
| Usuari | `admin` |
| Contrasenya | `admin123` |

---

## Base de dades

El projecte utilitza **SQLite**, una base de dades relacional lleugera que es guarda en un únic fitxer. Tres taules:

```sql
users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin      INTEGER DEFAULT 0   -- 0 = usuari normal, 1 = admin
)

objects (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nom       TEXT NOT NULL,
    descripcio TEXT,
    categoria TEXT NOT NULL,
    cp        TEXT NOT NULL,
    estat     TEXT DEFAULT 'disponible',  -- disponible | prestat
    imatge    TEXT,
    user_id   INTEGER REFERENCES users(id)
)

solicituds (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id     INTEGER NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
    solicitant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    missatge      TEXT,
    estat         TEXT DEFAULT 'pendent',  -- pendent | acceptada | rebutjada
    created_at    TEXT DEFAULT (datetime('now'))
)
```

---

## API REST — Endpoints

### Autenticació

| Mètode | Ruta | Descripció | Autenticació |
|---|---|---|---|
| `POST` | `/api/register` | Registra un usuari nou i obre sessió | — |
| `POST` | `/api/login` | Inicia sessió amb usuari i contrasenya | — |
| `POST` | `/api/logout` | Tanca la sessió actual | — |
| `GET` | `/api/me` | Retorna l'estat de la sessió actual | — |

**`POST /api/register`** — Body: `{ username, password }`
Retorna `201` amb `{ id, username, isAdmin }` i obre la sessió automàticament.
Retorna `409` si l'usuari ja existeix.

**`POST /api/login`** — Body: `{ username, password }`
Retorna `200` amb `{ id, username, isAdmin }`.
Retorna `401` si les credencials són incorrectes.

**`GET /api/me`**
Retorna `{ loggedIn: false }` si no hi ha sessió, o `{ loggedIn: true, id, username, isAdmin }` si n'hi ha.

---

### Objectes

| Mètode | Ruta | Descripció | Autenticació |
|---|---|---|---|
| `GET` | `/api/objects` | Llista tots els objectes. Paràmetre opcional: `?categoria=Eines` | — |
| `GET` | `/api/objects/meus` | Objectes publicats per l'usuari en sessió | ✅ Sessió |
| `GET` | `/api/objects/:id` | Detall d'un objecte per ID | — |
| `POST` | `/api/objects` | Crea un objecte nou | ✅ Sessió |
| `PUT` | `/api/objects/:id` | Actualitza un objecte (propietari o admin) | ✅ Sessió |
| `DELETE` | `/api/objects/:id` | Elimina un objecte (propietari o admin) | ✅ Sessió |
| `GET` | `/api/categories` | Llista de categories úniques existents | — |

**`POST /api/objects`** — Body: `{ nom*, categoria*, cp*, descripcio, estat, imatge }`
Els camps marcats amb `*` són obligatoris. Retorna `201` amb l'objecte creat.

**`PUT` i `DELETE /api/objects/:id`**
L'usuari normal només pot modificar objectes dels quals és propietari (`user_id === session.userId`). L'administrador pot modificar qualsevol. Retorna `403` si no té permisos.

---

### Sol·licituds

| Mètode | Ruta | Descripció | Autenticació |
|---|---|---|---|
| `POST` | `/api/solicituds` | Envia una sol·licitud per a un objecte | ✅ Sessió |
| `GET` | `/api/solicituds/enviades` | Sol·licituds enviades per l'usuari en sessió | ✅ Sessió |
| `GET` | `/api/solicituds/rebudes` | Sol·licituds rebudes sobre els teus objectes | ✅ Sessió |
| `PATCH` | `/api/solicituds/:id/estat` | Accepta o rebutja una sol·licitud rebuda | ✅ Sessió |
| `DELETE` | `/api/solicituds/:id` | Cancel·la una sol·licitud enviada | ✅ Sessió |

**`POST /api/solicituds`** — Body: `{ object_id*, missatge }`
Validacions del servidor: no es pot sol·licitar el teu propi objecte, no es pot sol·licitar un objecte en estat `prestat`, no es pot duplicar una sol·licitud ja existent.

**`PATCH /api/solicituds/:id/estat`** — Body: `{ estat }` on estat és `acceptada` o `rebutjada`.
Només el propietari de l'objecte pot canviar l'estat d'una sol·licitud rebuda.

---

### Admin (exclusiu per a administradors)

| Mètode | Ruta | Descripció | Autenticació |
|---|---|---|---|
| `GET` | `/api/admin/users` | Llista tots els usuaris registrats | ✅ Admin |
| `GET` | `/api/admin/stats` | Estadístiques globals (objectes, usuaris, categories) | ✅ Admin |

Aquests endpoints retornen `401` si no hi ha sessió i `403` si l'usuari no és administrador.

---

## Sistema d'autenticació

El sistema utilitza **sessions al servidor** gestionades amb `express-session`. Quan un usuari inicia sessió, el servidor crea un objecte de sessió en memòria i envia un ID de sessió al navegador com a cookie (`connect.sid`). En cada petició, el navegador envia la cookie automàticament i el servidor la valida.

Les contrasenyes es guarden a la base de dades com a **hash bcrypt** (cost 10), mai en text pla. Fins i tot si la base de dades és compromesa, les contrasenyes originals no es poden recuperar directament.

El servidor defineix dos nivells de permisos a través de middlewares:

```js
// Qualsevol usuari registrat
function requereixSessio(req, res, next) { ... }

// Exclusiu per a administradors
function requereixAdmin(req, res, next) { ... }
```

---

## Pàgines del frontend

| Pàgina | Descripció |
|---|---|
| `index.html` | Portada: explicació del projecte i ODS |
| `catalegGeneral.html` | Catàleg amb filtres per categoria, CP i estat. Els propietaris veuen els seus botons d'editar/eliminar; la resta veu el botó de sol·licitar |
| `panellUsuari.html` | Gestió dels objectes propis i de les sol·licituds rebudes |
| `createObject.html` | Formulari per publicar un objecte nou (requereix sessió) |
| `detallsProducte.html` | Vista individual d'un objecte amb formulari de sol·licitud inline |
| `solicituds.html` | Gestió de sol·licituds enviades i rebudes amb pestanyes |
| `admin.html` | Panell d'administrador: estadístiques, gestió de tots els objectes i usuaris |
| `guiaEconomiaCircular.html` | Guia del projecte: economia circular, ODS, impacte ASG |
| `analisiEmpresa.html` | Anàlisi de sostenibilitat de Fairphone com a cas d'estudi |
| `preguntesFrequents.html` | FAQ del projecte |
| `sobreMi.html` | Informació de EcoCity Connect |

---

## Connexió amb els ODS

### ODS 12 — Producció i Consum Responsables *(eix principal)*

La plataforma combate directament l'hiperconsumisme de proximitat. Objectes d'ús esporàdic com taladres, tendes de campanya o màquines de cosir s'utilitzen una mitjana de poques hores a l'any però cada veí en compra un de propi. EcoCity Connect converteix aquests objectes en un recurs compartit del barri: cada préstec evita una compra nova i per tant una fabricació, un consum de matèries primeres i una generació de residus.

### ODS 11 — Ciutats i Comunitats Sostenibles

El filtre per codi postal limita els préstecs a l'entorn proper. Això elimina enviaments de paqueteria i desplaçaments en vehicle, reduint emissions de GEH. Alhora, les interaccions entre veïns construeixen cohesió comunitària i capital social de proximitat.

### ODS 9 — Indústria, Innovació i Infraestructura

El projecte demostra que la tecnologia (API REST, base de dades relacional, arquitectura DAO) pot ser una eina d'optimització de recursos físics existents, no només un fi en si mateixa. Infraestructura digital al servei de la sostenibilitat material.

---

## Decisions tècniques destacades

**Arquitectura DAO** — La lògica de base de dades està completament separada del servidor en fitxers `dao/dao.js`. El servidor (`index.js`) només gestiona peticions HTTP i delega les consultes SQL als models (`UserModel`, `ObjectModel`, `SolicitudModel`). Això fa el codi més mantenible i testejable.

**ES Modules** — Tot el projecte (`"type": "module"` al `package.json`) utilitza la sintaxis moderna d'importació (`import`/`export`) tant al servidor com al frontend.

**Codi compartit al frontend** — La lògica del modal d'edició i el selector de categories dinàmic estava duplicada a `catalegGeneral.html` i `panellUsuari.html`. Es va extreure a `public/js/objectes-editor.js`, un mòdul ES que les dues pàgines importen, eliminant la duplicació.

**Mode fosc** — Implementat amb una classe CSS (`body.mode-fosc`) que sobreescriu les variables CSS, sense cap llibreria externa.

---

## Autor

Xavi Hurtado Picón — Curs 2025–2026