// components.js — Carrega el header i footer de forma reutilitzable
// Optimització: evita repetir codi HTML a cada pàgina

async function loadComponents() {
  // Detecta si s'esta a /view/ o a l'arrel per ajustar les rutes
  const esVistaInterior = window.location.pathname.includes('/view/');
  const base = esVistaInterior ? '../' : './';

  try {
    // Carrega el Header
    const headerResponse = await fetch(base + 'includes/header.html');
    const headerHtml = await headerResponse.text();
    document.body.insertAdjacentHTML('afterbegin', headerHtml);

    // Carrega el Footer
    const footerResponse = await fetch(base + 'includes/footer.html');
    const footerHtml = await footerResponse.text();
    document.body.insertAdjacentHTML('beforeend', footerHtml);

    // Marca l'enllaç actiu al nav
    const rutes = document.querySelectorAll('nav a');
    rutes.forEach(function (a) {
      if (a.href === window.location.href) {
        a.classList.add('actiu');
      }
    });

  } catch (error) {
    console.error('Error carregant components:', error);
  }
}

loadComponents();