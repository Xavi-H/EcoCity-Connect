// Optimització, sostenibilitat i mantenibilitat del codi
async function loadComponents() {
    // Carrega el Header
    const headerResponse = await fetch('./includes/header.html');
    const headerHtml = await headerResponse.text();
    document.body.insertAdjacentHTML('afterbegin', headerHtml); // Insereix el codi del header despres del tag body

    // Carrega el Footer
    const footerResponse = await fetch('./includes/footer.html');
    const footerHtml = await footerResponse.text();
    document.body.insertAdjacentHTML('beforeend', footerHtml); // Insereix el codi del footer abans del tancament del tag body
}

loadComponents();