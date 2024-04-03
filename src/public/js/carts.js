const url = 'http://localhost:8080/api/carts/' + cartId;
listProducts(url);

//Métodos internos
function listProducts(url){
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al obtener los productos');
            }
            return response.json();
        })
        .then(data => {
            const productList = document.getElementById('productList');
            const array = Object.values(data);
            
            array.forEach(product => {
                const cantidadEliminar = document.createElement('div');
                const listItem = document.createElement('li');
                const title = document.createElement('h3');
                const price = document.createElement('p');
                const descrption = document.createElement('p');
                const category = document.createElement('p');
                const stock = document.createElement('p');
                const quantity = document.createElement('strong');
                const props = document.createElement('div');
                const btnEliminar = document.createElement('button');
                
                cantidadEliminar.className = 'cantidad-eliminar';

                listItem.className = 'product-item';
                props.className = 'product-props';
                title.textContent = product.product.title;
                price.textContent = 'Precio: $' + product.product.price;
                descrption.textContent = 'Descripción: ' + product.product.description;
                category.textContent = 'Categoría: ' + product.product.category;
                stock.textContent = 'Stock: ' + product.product.stock;
                quantity.textContent = 'Cantidad: ' + product.quantity;

                btnEliminar.textContent = 'Eliminar';
                btnEliminar.className = 'btn-eliminar';

                btnEliminar.addEventListener('click', () => {
                    fetch(url + '/product/' + product.product._id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ocurrió un error al eliminar el producto');
                        }
                        return response.json();
                    })
                    .then(data => {
                        window.location.reload();
                    })
                    .catch(error => {
                        console.error(error);
                    });
                });

                
                props.appendChild(price);
                props.appendChild(descrption);
                props.appendChild(category);
                props.appendChild(stock);
                
                cantidadEliminar.appendChild(quantity);
                cantidadEliminar.appendChild(btnEliminar);
                                
                listItem.appendChild(title);
                listItem.appendChild(props);
                listItem.appendChild(cantidadEliminar);
                productList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error(error);
        });
}