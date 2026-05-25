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