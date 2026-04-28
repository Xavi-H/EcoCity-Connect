## Pasos iniciales en VS Code
Sigue este orden exacto:

Crea una carpeta para tu proyecto (ej: ecocity-connect) y ábrela en VS Code.

Abre la Terminal

Inicializa el proyecto: Escribe `npm init -y`.

Esto creará un archivo package.json, que es como el "DNI" de tu proyecto.

Instala Express: Escribe `npm install express`.

Verás que aparece una carpeta node_modules. No la toques, ahí vive Express.

--

// COMANDAS INICIAR PROJECTE NODE.js

// > npm init -y (crear package.json)
// Crear arxiu main (index.js)

// > npm install express (instal·lar dependències - node_modules) per reinstalar: npm install
// "type": "module" en el package.json
// Arrencar projecte: > node index.js
// > npm install -D nodemon (instal·lar nodemon per reiniciar el servidor automàticament quan es fan canvis al codi)
// "dev": "nodemon index.js" en el package.json (Scripts)

// > npm run dev (arrencar el servidor amb nodemon)
// Començar a programar endpoints
// > npm install body-parser (instal·lar body-parser per entendre que estem rebent un json des de la petició post)



// TEORIA

// NODE.js es un framework que permet montar servidors web en JS
// En el servidor creas endpoints que són les rutes que el client pot demanar al servidor
// El servidor rep la petició, processa la informació i retorna una resposta al client
// El servidor pot retornar diferents tipus de respostes: HTML, JSON, XML, etc. a rutes URL diferents
