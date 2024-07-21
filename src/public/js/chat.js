let inputMessage = document.getElementById("mensaje")
let btnObtenerHistorial = document.getElementById("btnObtenerHistorial")
let divMensajes = document.getElementById("mensajes")
inputMessage.focus()

const socket = io()

inputMessage.addEventListener("keyup", e => {
    e.preventDefault()
    if (e.code === "Enter" && e.target.value.trim().length > 0) {
        fetch("/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: user,
                message: e.target.value.trim()
            })
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response data if needed
                e.target.value = ""
                inputMessage.focus()
                socket.emit("reload")
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch request
                console.error('Error:', error);
            });

    }
})

async function reload() {
    let response = await fetch("/api/messages")
    let userMessages = await response.json()
    console.log(userMessages)
    divMensajes.innerHTML = "";
    userMessages.forEach(message => {
        divMensajes.innerHTML += `<div class="mensaje"><strong>${message.user}</strong> dice: <i>${message.message}</i></div><br>`
    })
}

socket.on("reload", () => {
    reload();
});