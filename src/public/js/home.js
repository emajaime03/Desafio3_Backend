let msgText = document.getElementById('mensaje');
const mensaje = getQueryParam('mensaje');

if (mensaje) {
    const status = getQueryParam('status');
    if (status === 'error') {
        msgText.style.color = 'red';
    } else {
        msgText.style.color = 'green';
    }
    msgText.innerHTML = mensaje;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}