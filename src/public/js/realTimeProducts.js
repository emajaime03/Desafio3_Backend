const socket = io();

const urlProducts = 'http://localhost:8080/api/products';

refrescarProductos();

socket.on('addProduct', (data) => {
    try {
        if (data) {
            refrescarProductos();
        } else {
            throw new Error('No se pudo agregar el producto');
        }
    } catch (error) {
        console.error(error);
    }
});

socket.on('deleteProduct', (data) => {
    try {
        if (data) {
            refrescarProductos();
        } else {
            throw new Error('No se pudo eliminar el producto');
        }
    } catch (error) {
        console.error(error);
    }
});

//Funciones internas
function refrescarProductos() {

    fetch(urlProducts)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
            return response.json();
        })
        .then(data => {
            try {
                const productList = document.getElementById('productList');
                productList.remove();
            } catch (error) { 
                console.error("No hay productos para eliminar.");
            }
            const array = Object.values(data);
            const listContainer = document.getElementById('listContainer');
    
            const productList = document.createElement('ul');
            productList.id = 'productList';
            listContainer.appendChild(productList);
    
            array.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = product.title + ' - ' + "$" + product.price;
                productList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error(error);
        });
        
    }