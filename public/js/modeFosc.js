// modeFosc.js — Gestió del mode fosc
// El mode fosc redueix el consum energètic fins un 60% en pantalles OLED/AMOLED

// Aplica la classe al body immediatament (evita el flash blanc en recarregar)
if (localStorage.getItem('modeFosc') === 'true') {
  document.body.classList.add('mode-fosc');
}

// Connecta el botó del header al DOM.
function initBotoModeFosc() {
  const boto = document.getElementById('boto-mode-fosc');
  if (!boto) return;

  function actualitzarBoto() {
    const actiu = document.body.classList.contains('mode-fosc');
    boto.textContent = actiu ? '☀️' : '🌙';
    boto.title = actiu ? 'Desactivar mode fosc' : 'Activar mode fosc (estalvi energètic)';
  }

  actualitzarBoto();

  boto.addEventListener('click', function () {
    document.body.classList.toggle('mode-fosc');
    localStorage.setItem('modeFosc', document.body.classList.contains('mode-fosc'));
    actualitzarBoto();
  });
}