const paginationContainer = document.getElementById('pagination');
const urlProducts = '/api/products' + window.location.search;

listProducts(urlProducts);

document.getElementById('productList').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const btnAgregar = event.target;
        const textoOriginal = btnAgregar.textContent;
        const productId = btnAgregar.getAttribute('data-id');
        if (!cartId) {
            window.location.href = '/login';
        } else {            
            const url = `/api/carts/${cartId}/product/${productId}`;
            fetch(url, {
                method: 'POST'
            })
                .then(response => {
                    if (!response.ok) {
                        alert('Ocurrió un error al agregar el producto al carrito');
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
    }
});

//Métodos internos
function listProducts(url){
    fetch(url)
        .then(response => {
            if (!response.ok) {
                alert('Ocurrió un error al obtener los productos');
            }
            return response.json();
        })
        .then(data => {
            const productList = document.getElementById('productList');
            const products = Object.values(data.products);
            
            products.forEach(product => {
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
            
            if (data.totalPages > 1) {
                const btnFirst = document.createElement('button');
                btnFirst.textContent = '1';
                btnFirst.addEventListener('click', () => {
                    window.location.href = '/products?page=1'
                });
                paginationContainer.appendChild(btnFirst);
                
                if (data.hasPrevPage) {
                    const btnPrev = document.createElement('button');
                    btnPrev.textContent = '<';
                    btnPrev.addEventListener('click', () => {
                        window.location.href = '/products?page=' + data.prevPage
                    });
                    paginationContainer.appendChild(btnPrev);
                }
                if (data.hasNextPage) {
                    const btnNext = document.createElement('button');
                    btnNext.textContent = '>';
                    btnNext.addEventListener('click', () => {
                        window.location.href = '/products?page=' + data.nextPage
                    });
                    paginationContainer.appendChild(btnNext);
                }
                
                
                const btnLast = document.createElement('button');
                btnLast.textContent = data.totalPages;
                btnLast.addEventListener('click', () => {
                    window.location.href = '/products?page=' + data.totalPages
                });
                paginationContainer.appendChild(btnLast);
            } 

        })
        .catch(error => {
            console.error(error);
        });
}