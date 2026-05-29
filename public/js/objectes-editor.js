// objectes-editor.js
// Lògica compartida per editar objectes: modal d'edició + selector de categories dinàmic.
// Inclòs a: catalegGeneral.html i panellUsuari.html

// Categoria dinàmica

let categoriesCache = [];

export async function carregarCategories() {
    try {
        categoriesCache = await fetch('/api/categories').then(r => r.json());
    } catch {
        categoriesCache = [];
    }
}

/**
 * Omple el <select id="edit-categoria"> amb les categories disponibles.
 * Afegeix l'opció "+ Altra categoria..." al final.
 * Si valorActual no és a la llista, l'afegeix i la selecciona.
 */
export function omplirSelectCategoriaEdit(valorActual) {
    const sel  = document.getElementById('edit-categoria');
    const nova = document.getElementById('edit-categoria-nova');
    sel.innerHTML = '';

    categoriesCache.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat; opt.textContent = cat;
        sel.appendChild(opt);
    });

    const optAltra = document.createElement('option');
    optAltra.value = '__altra__'; optAltra.textContent = '+ Altra categoria...';
    sel.appendChild(optAltra);

    if (valorActual && !categoriesCache.includes(valorActual)) {
        const optExtra = document.createElement('option');
        optExtra.value = valorActual; optExtra.textContent = valorActual;
        sel.insertBefore(optExtra, optAltra);
        sel.value = valorActual;
    } else {
        sel.value = valorActual || (categoriesCache[0] || '');
    }

    nova.style.display = 'none';
    nova.value = '';
}

/** Llegeix el valor del selector (o el camp de text si s'ha triat "+ Altra"). */
export function obtenirCategoriaEdit() {
    const sel = document.getElementById('edit-categoria');
    if (sel.value === '__altra__') {
        return document.getElementById('edit-categoria-nova').value.trim();
    }
    return sel.value.trim();
}

// Mostrar/ocultar camp de text quan es tria "+ Altra categoria..."
document.addEventListener('change', e => {
    if (e.target.id === 'edit-categoria') {
        const nova = document.getElementById('edit-categoria-nova');
        const isAltra = e.target.value === '__altra__';
        nova.style.display = isAltra ? 'block' : 'none';
        if (isAltra) nova.focus();
    }
});


// Modal editar

/**
 * Omple i obre el modal d'edició per a l'objecte donat.
 * @param {object} obj - Objecte amb { id, nom, descripcio, categoria, cp, estat, imatge }
 * @param {string} errorFieldId - ID del <p> d'errors del formulari (diferent a cada pàgina)
 */
export function obrirModalEditar(obj, errorFieldId = 'edit-errors') {
    document.getElementById('edit-id').value = obj.id;
    document.getElementById('edit-nom').value = obj.nom;
    document.getElementById('edit-descripcio').value = obj.descripcio || '';
    omplirSelectCategoriaEdit(obj.categoria);
    document.getElementById('edit-cp').value = obj.cp;
    document.getElementById('edit-estat').value = obj.estat;
    document.getElementById('edit-imatge').value = obj.imatge || '';
    document.getElementById(errorFieldId).textContent = '';
    document.getElementById('modal-editar').style.display = 'flex';
}

export function tancarModalEditar() {
    document.getElementById('modal-editar').style.display = 'none';
}