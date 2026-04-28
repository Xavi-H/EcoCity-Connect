// Función principal asíncrona
async function cargarCatalogo() {
    const contenedor = document.getElementById('contenedor-objetos');
    const mensajeCarga = document.getElementById('mensaje-carga');

    try {
        // 1. Llamada a tu API (el endpoint que creamos antes)
        const respuesta = await fetch('/api/objects');
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }
        // 2. Convertimos la respuesta a JSON
        const datos = await respuesta.json();
        
        // 3. Limpiamos el mensaje de "cargando"
        mensajeCarga.style.display = 'none';

        // 4. Accedemos al array (recuerda que tu JSON tiene la clave "objectes")
        const lista = datos.objectes;

        if (lista.length === 0) {
            contenedor.innerHTML = "<p>No hi ha objectes disponibles en aquest moment.</p>";
            return;
        }

        // 5. Recorremos el array y creamos el HTML para cada uno
        lista.forEach(objeto => {
            const card = document.createElement('div');
            card.className = 'card-objeto'; // Luego le das estilo en CSS
            
            card.innerHTML = `
                <img src="${objeto.imatge}" alt="${objeto.nom}" style="width:100%">
                <div class="container">
                    <h3><b>${objeto.nom}</b></h3>
                    <p>${objeto.descripcio}</p>
                    <span class="tag">${objeto.categoria}</span>
                    <p><b>CP:</b> ${objeto.cp}</p>
                    <p class="estado ${objeto.estat}">${objeto.estat.toUpperCase()}</p>
                    <a href="detalle.html?id=${objeto.id}" class="btn-detalles">Veure detalls</a>
                </div>
            `;
            
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error cargando la API:", error);
        mensajeCarga.innerText = "Error al carregar les dades. Reintenta-ho més tard.";
    }
}

// Ejecutamos la función al cargar la página
window.onload = cargarCatalogo;