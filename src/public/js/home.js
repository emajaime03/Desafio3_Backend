const urlProducts = 'http://localhost:8080/api/products';

fetch(urlProducts)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const productList = document.getElementById('productList');
        const array = Object.values(data);

        array.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = product.title + ' - ' + "$" + product.price;
            productList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error(error);
    });        