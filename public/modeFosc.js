// darkmode.js — Gestió del mode fosc
// El mode fosc redueix el consum energètic fins un 60% en pantalles OLED/AMOLED

function initModeFosc() {
  // Comprova si l'usuari havia activat el mode fosc anteriorment
  const modeFoscActiu = localStorage.getItem('modeFosc') === 'true';

  if (modeFoscActiu) {
    document.body.classList.add('mode-fosc');
  }

  // Quan el DOM estigui a punt, connecta el botó
  document.addEventListener('DOMContentLoaded', function () {
    const boto = document.getElementById('boto-mode-fosc');
    if (!boto) return;

    // Actualitza l'icona del botó segons l'estat
    function actualitzarBoto() {
      const actiu = document.body.classList.contains('mode-fosc');
      boto.textContent = actiu ? '☀️' : '🌙';
      boto.title = actiu
        ? 'Desactivar mode fosc'
        : 'Activar mode fosc (estalvi energètic)';
    }

    actualitzarBoto();

    boto.addEventListener('click', function () {
      document.body.classList.toggle('mode-fosc');
      const actiu = document.body.classList.contains('mode-fosc');
      localStorage.setItem('modeFosc', actiu);
      actualitzarBoto();
    });
  });
}

initModeFosc();
