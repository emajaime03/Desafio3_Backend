const form = document.getElementById('recoveryForm');
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

const btnAceptar = document.getElementById('btnAceptar');
const inputPassword = document.getElementById('password');
const inputPasswordRepeat = document.getElementById('passwordRepeat');

btnAceptar.addEventListener('click', async (e) => {
    e.preventDefault();
    if (inputPassword.value === inputPasswordRepeat.value) {
        const response = await fetch(`/api/sessions/recoveryReset?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                password: inputPassword.value
            })
        });
        const data = await response.json();
        if (data.success) {
            console.log(data.message);
            window.location.href = '/login';
        } else {
            console.log(data.error);
        }
    } else {
        console.log("Las contraseñas no coinciden")
    }
});