let divMessage = document.getElementById("message")

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const message = urlParams.get('message');

if(message!==null){
    divMessage.innerHTML=message+"<br><br>"
    divMessage.style.color="green"
    divMessage.style.fontFamily="Arial"
    divMessage.style.fontWeight="bold"
}