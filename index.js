import express from "express";
import fs from "fs"; // Treballar amb arxius
import bodyParser from "body-parser"; //Ho afegim per entendre que estem rebent un json des de la petició post.
import path from "path"; // Manejar rutas de carpetas

const APP = express();  // Aquest es el servidor web
const PORT = 3000;      // El port que escoltara el servidor

// ==== CONFIGURACIÓ ====
APP.use(bodyParser.json()); // Entendre que rebem json
APP.use(express.json()); // Para que el servidor pueda leer datos JSON
APP.use(express.static('public')); // fa que la carpeta public sigui visible al servidor


const readData=()=>{
    try{
        const DATA=fs.readFileSync("./objects.json"); // llegueix el contingut
        return JSON.parse(DATA) // tradueix el contingut de l'arxiu
    }catch(error){
        console.log(error);
        return []; // En cas de que falli, retorna un array buit
    }
};


// ==== RUTAS (Endpoints) ====

// Mostrara l'index.html quan es consulti l'arrel
APP.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

// Ruta per obtenir els objectes
APP.get('/api/objects', (req, res) => {
    const DATA = readData();
    res.json(DATA);
});



// El servidor escolta el port que rep com a parametre
APP.listen(PORT, () => {
    console.log(`Servidor de EcoCity Connect funcionant en http://localhost:${PORT}`);
});