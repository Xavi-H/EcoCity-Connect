import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser"; //Ho afegim per entendre que estem rebent un json des de la petició post.

const PORT = 3000;      // El port que escoltara el servidor
const app = express();  // Aquest es el servidor web

app.use(bodyParser.json()); // Entendre que rebem json
app.use(express.json()); // Para que el servidor pueda leer datos JSON

const readData=()=>{
    try{
        const data=fs.readFileSync("./objects.json");
        return JSON.parse(data)
    }catch(error){
        console.log(error);
    }
};

// Ruta per obtenir tots els objectes (GET)
app.get('/objects', (req, res) => {
    const DATA = readData();
    res.json(DATA);
});

// El servidor escolta el port que rep com a parametre
app.listen(PORT, () => {
    console.log(`Servidor de EcoCity Connect funcionant en http://localhost:${PORT}`);
});