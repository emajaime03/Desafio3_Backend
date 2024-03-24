let inputUser=document.getElementById("user")
let inputMensaje=document.getElementById("mensaje")
let btnObtenerHistorial = document.getElementById("btnObtenerHistorial")
let divMensajes=document.getElementById("mensajes")
inputUser.focus()

const socket=io()

socket.on("historial", userMessages=>{
    divMensajes.innerHTML = "";
    userMessages.forEach(mensaje=>{
        divMensajes.innerHTML+=`<div class="mensaje"><strong>${mensaje.user}</strong> dice: <i>${mensaje.message}</i></div><br>`
    })
})

socket.on("mensaje", (nombre, mensaje)=>{
    divMensajes.innerHTML+=`<div class="mensaje"><strong>${nombre}</strong> dice: <i>${mensaje}</i></div><br>`
})

inputMensaje.addEventListener("keyup", e=>{
    e.preventDefault()
    if(e.code==="Enter" && e.target.value.trim().length>0){        
        socket.emit("mensaje", inputUser.value, e.target.value.trim())
        e.target.value=""
        inputUser.value=""
        inputUser.focus()
    }
})   

btnObtenerHistorial.addEventListener("click", e=>{
    e.preventDefault()
    socket.emit("obtenerHistorial")
})