const paginationContainer = document.getElementById('pagination');
const socket = io();

const urlProducts = 'http://localhost:8080/api/products';

refrescarProductos();

document.getElementById('listContainer').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const btnAgregar = event.target;
        const textoOriginal = btnAgregar.textContent;
        const productId = btnAgregar.getAttribute('data-id');
        const url = `http://localhost:8080/api/carts/${cartId}/product/` + productId;
        fetch(url, {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ocurrió un error al agregar el producto al carrito');
                }
                return response.json();
            })
            .then(data => {
                btnAgregar.textContent = 'Agregado!';

                setTimeout(function() {
                    btnAgregar.textContent = textoOriginal;
                }, 700);
            })
            .catch(error => {
                console.error(error);
            });            
    }
});

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

    fetch(urlProducts + '?limit=99999')
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
            const listContainer = document.getElementById('listContainer');
    
            const productList = document.createElement('ul');
            productList.id = 'productList';
            productList.className = 'list-container';
            listContainer.appendChild(productList);
    
            data.products.forEach(product => {
                const listItem = document.createElement('li');
                const title = document.createElement('h3');
                const price = document.createElement('p');
                const descrption = document.createElement('p');
                const category = document.createElement('p');
                const stock = document.createElement('p');
                const button = document.createElement('button');
                const props = document.createElement('div');
                
                listItem.className = 'product-item';
                props.className = 'product-props';
                title.textContent = product.title;
                price.textContent = 'Precio: $' + product.price;
                descrption.textContent = 'Descripción: ' + product.description;
                category.textContent = 'Categoría: ' + product.category;
                stock.textContent = 'Stock: ' + product.stock;
                button.textContent = 'Agregar al carrito';
                button.setAttribute('data-id', product.id);
                
                props.appendChild(price);
                props.appendChild(descrption);
                props.appendChild(category);
                props.appendChild(stock);
                
                listItem.appendChild(title);
                listItem.appendChild(props);
                listItem.appendChild(button);
                productList.appendChild(listItem);
            });            

        })
        .catch(error => {
            console.error(error);
        });
        
    }