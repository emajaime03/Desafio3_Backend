const paginationContainer = document.getElementById('pagination');
const socket = io();

const urlProducts = '/api/products';

refrescarProductos();

function refrescarProductos() {

    fetch(urlProducts + '?limit=99999')
        .then(response => {
        if (!response.ok) {
            alert('Network response was not ok');
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
                const props = document.createElement('div');
                
                listItem.className = 'product-item';
                props.className = 'product-props';
                title.textContent = product.title;
                price.textContent = 'Precio: $' + product.price;
                descrption.textContent = 'Descripción: ' + product.description;
                category.textContent = 'Categoría: ' + product.category;
                stock.textContent = 'Stock: ' + product.stock;
                
                props.appendChild(price);
                props.appendChild(descrption);
                props.appendChild(category);
                props.appendChild(stock);
                
                listItem.appendChild(title);
                listItem.appendChild(props);
                productList.appendChild(listItem);
            });            

        })
        .catch(error => {
            console.error(error);
        });
        
    }