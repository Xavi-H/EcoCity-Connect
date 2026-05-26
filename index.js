import express from "express";
import path from "path"; // Manejar rutas de carpetas
import { fileURLToPath } from 'url';
import { ObjectModel } from "./dao/dao.js";

// Necesario para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP = express(); // Aquest es el servidor web
const PORT = 3000; // El port que escoltara el servidor


// ==== CONFIGURACIÓ ====
APP.use(express.json()); // Para que el servidor pueda leer datos JSON para las peticions
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


// ==== Endpoints (API REST) ====

// Mostrara l'index.html quan es consulti l'arrel
APP.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

// GET /api/objects → Obtener todos los objetos
// Es pot filtrar per categoria: GET /api/objects?categoria=Eines
APP.get('/api/objects', async (req, res) => {
    try {
        const { categoria } = req.query;
        let data;
        if (categoria) {
            data = await ObjectModel.getByCategoria(categoria);
        } else {
            data = await ObjectModel.getAll();
        }
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// GET /api/objects/:id → Obtener un objeto por ID
APP.get('/api/objects/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const objeto = await ObjectModel.getById(id);
        if (!objeto) {
            return res.status(404).json({ error: 'Objecte no trobat' });
        }
        res.json(objeto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// POST /api/objects → Crear un objeto nuevo
// Body (JSON): { nom, descripcio, categoria, cp, estat, imatge }
APP.post('/api/objects', async (req, res) => {
    try {
        const { nom, descripcio, categoria, cp, estat, imatge } = req.body;

        // Validación básica de campos obligatorios
        if (!nom || !categoria || !cp) {
            return res.status(400).json({ error: 'Els camps nom, categoria i cp són obligatoris' });
        }

        const nouObjecte = await ObjectModel.create({ nom, descripcio, categoria, cp, estat, imatge });
        res.status(201).json(nouObjecte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// PUT /api/objects/:id → Actualizar un objeto existente
// Body (JSON): { nom, descripcio, categoria, cp, estat, imatge }
APP.put('/api/objects/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nom, descripcio, categoria, cp, estat, imatge } = req.body;

        if (!nom || !categoria || !cp) {
            return res.status(400).json({ error: 'Els camps nom, categoria i cp són obligatoris' });
        }

        const objecteActualitzat = await ObjectModel.update(id, { nom, descripcio, categoria, cp, estat, imatge });
        if (!objecteActualitzat) {
            return res.status(404).json({ error: 'Objecte no trobat' });
        }
        res.json(objecteActualitzat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// DELETE /api/objects/:id → Eliminar un objeto
APP.delete('/api/objects/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const eliminat = await ObjectModel.delete(id);
        if (!eliminat) {
            return res.status(404).json({ error: 'Objecte no trobat' });
        }
        res.json({ missatge: 'Objecte eliminat correctament', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
});

// El servidor escolta el port que rep com a parametre
APP.listen(PORT, () => {
    console.log(`Servidor de EcoCity Connect funcionant en http://localhost:${PORT}`);
});






// VERSION ANTIGUA PARA EL PC DE CLASE Usamos 'require' en lugar de 'import' (CommonJS es más compatible)
/*
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express(); // Cambiado a minúsculas por convención
const PORT = 3000;

// Configuración básica compatible
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Función para leer el JSON
function readData() {
    try {
        const data = fs.readFileSync("./objects.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo JSON:", error.message);
        return [];
    }
}

// RUTA RAIZ: Envía el index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// RUTA API: Devuelve los objetos
app.get('/api/objects', function(req, res) {
    const data = readData();
    res.json(data);
});

// GET objecte per id
app.get('/api/objects/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id); // Objecte req té l'arguments params que permet accedir als parametres de la url
  const item = data.objectes.find(i => i.id == id);
  if (!item) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  res.json(item); // Retorna un objecte
});

// GET objecte per categoria
app.get('/api/objects/:categoria', (req, res) => {
  const data = readData();
  const categoria = req.params.categoria; // Valor rebut per url
  const items = data.objectes.filter(i => i.categoria == categoria);
  if (items.length === 0) {
    return res.status(404).json({ error: 'No hi ha cap objecte' });
  }
  res.json(items);
});

// POST per afegir un objecte nou
app.post('/api/objects', function(req, res) {
    const data = readData();
    const nouObjecte = req.body; // Rep l'enviat pel formulari
    
    // S'assigna un ID nou automàtic
    nouObjecte.id = data.objectes.length + 1;
    data.objectes.push(nouObjecte);
    
    // Guarda al fitxer JSON
    fs.writeFileSync('./objects.json', JSON.stringify(data, null, 2)); // 
    
    res.status(201).json(nouObjecte);
});


app.listen(PORT, function() {
    console.log("Servidor EcoCity Connect viu en: http://localhost:" + PORT);
});
*/