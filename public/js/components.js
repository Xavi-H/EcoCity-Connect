// components.js — Carrega header/footer i inicialitza la UI d'autenticació

async function loadComponents() {
  const esVistaInterior = window.location.pathname.includes('/view/');
  const base = esVistaInterior ? '../' : './';

  try {
    const headerHtml = await fetch(base + 'includes/header.html').then(r => r.text());
    document.body.insertAdjacentHTML('afterbegin', headerHtml);

    const footerHtml = await fetch(base + 'includes/footer.html').then(r => r.text());
    document.body.insertAdjacentHTML('beforeend', footerHtml);

    // Marca l'enllaç actiu
    document.querySelectorAll('nav a').forEach(a => {
      if (a.href === window.location.href) a.classList.add('actiu');
    });

    initAuthUI();

  } catch (err) {
    console.error('Error carregant components:', err);
  }
}

function initAuthUI() {
  const modal = document.getElementById('modal-auth');
  const btnObrir = document.getElementById('btn-obrir-auth');
  const btnTancar = document.getElementById('btn-tancar-auth');
  const btnLogout = document.getElementById('btn-logout');
  const navInfo = document.getElementById('nav-user-info');
  const formLogin = document.getElementById('form-login');
  const formRegistre = document.getElementById('form-registre');
  const tabs = document.querySelectorAll('.auth-tab');

  // Comprovar sessió actual
  fetch('/api/me').then(r => r.json()).then(data => {
    if (data.loggedIn) {
      mostrarLogout(data.username, data.isAdmin);
    }
  });

  function mostrarLogin() {
    btnObrir.style.display = 'inline-block';
    btnLogout.style.display = 'none';
    navInfo.innerHTML = '';
    ocultarEnllacAdmin();
  }

  function mostrarLogout(username, isAdmin) {
    btnObrir.style.display = 'none';
    btnLogout.style.display = 'inline-block';

    if (isAdmin) {
      // Nom d'usuari
      navInfo.innerHTML = username;
      mostrarEnllacAdmin();
    } else {
      navInfo.textContent = username;
      ocultarEnllacAdmin();
    }
  }

  // Afegir/treure l'enllaç al panell admin al nav
  function mostrarEnllacAdmin() {
    if (document.getElementById('nav-link-admin')) return; // ja existeix
    const nav = document.querySelector('nav');
    if (!nav) return;
    const a = document.createElement('a');
    a.id = 'nav-link-admin';
    a.href = '/view/admin.html';
    a.textContent = 'Panell Admin';
    // Insertar després del darrer a, abans del botó mode fosc
    const boto = document.getElementById('boto-mode-fosc');
    nav.insertBefore(a, boto);
    // Marcar actiu si estem a la pàgina admin
    if (window.location.href === a.href) a.classList.add('actiu');
  }

  function ocultarEnllacAdmin() {
    const a = document.getElementById('nav-link-admin');
    if (a) a.remove();
  }

  // Pàgines que requereixen recarregar en canviar la sessió
  function recarregarSiCal() {
    const path = window.location.pathname;
    if (path.includes('panellUsuari') ||
        path.includes('createObject') ||
        path.includes('solicituds') ||
        path.includes('catalegGeneral') ||
        path.includes('detallsProducte') ||
        path.includes('admin')) {
      window.location.reload();
    }
  }

  btnObrir.addEventListener('click', () => {
    modal.style.display = 'flex';
    document.getElementById('login-error').textContent = '';
    document.getElementById('reg-error').textContent = '';
  });

  btnTancar.addEventListener('click', () => modal.style.display = 'none');
  modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  // Pestanyes login / registre
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('activa'));
      tab.classList.add('activa');
      document.getElementById('form-login').style.display = tab.dataset.tab === 'login'   ? 'flex' : 'none';
      document.getElementById('form-registre').style.display = tab.dataset.tab === 'registre' ? 'flex' : 'none';
    });
  });

  // Login
  formLogin.addEventListener('submit', async e => {
    e.preventDefault();
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('login-username').value.trim(),
        password: document.getElementById('login-password').value
      })
    });
    const data = await res.json();
    if (!res.ok) { errorEl.textContent = data.error; return; }
    modal.style.display = 'none';
    mostrarLogout(data.username, data.isAdmin);
    recarregarSiCal();
  });

  // Registre
  formRegistre.addEventListener('submit', async e => {
    e.preventDefault();
    const errorEl = document.getElementById('reg-error');
    errorEl.textContent = '';
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('reg-username').value.trim(),
        password: document.getElementById('reg-password').value
      })
    });
    const data = await res.json();
    if (!res.ok) { errorEl.textContent = data.error; return; }
    modal.style.display = 'none';
    mostrarLogout(data.username, data.isAdmin);
    recarregarSiCal();
  });

  // Logout
  btnLogout.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    mostrarLogin();
    const path = window.location.pathname;
    if (path.includes('panellUsuari') || path.includes('createObject') || path.includes('admin')) {
      window.location.href = '/index.html';
    } else {
      window.location.reload();
    }
  });
}

loadComponents();