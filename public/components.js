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
    initModeFosc(); // definida a modeFosc.js

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
      mostrarLogout(data.username);
    }
  });

  function mostrarLogin() {
    btnObrir.style.display = 'inline-block';
    btnLogout.style.display = 'none';
    navInfo.textContent = '';
  }

  function mostrarLogout(username) {
    btnObrir.style.display = 'none';
    btnLogout.style.display = 'inline-block';
    navInfo.textContent = '👤 ' + username;
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
      document.getElementById('form-login').style.display    = tab.dataset.tab === 'login'   ? 'flex' : 'none';
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
    mostrarLogout(data.username);
    // Recarregar panell si hi estem
    if (window.location.pathname.includes('panellUsuari')) window.location.reload();
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
    mostrarLogout(data.username);
    if (window.location.pathname.includes('panellUsuari')) window.location.reload();
  });

  // Logout
  btnLogout.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    mostrarLogin();
    if (window.location.pathname.includes('panellUsuari') ||
        window.location.pathname.includes('createObject')) {
      window.location.href = '/index.html';
    } else {
      window.location.reload();
    }
  });
}

loadComponents();
