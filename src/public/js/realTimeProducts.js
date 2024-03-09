const socket = io();

socket.on("saludo", (data) => {
    console.log(data)
});

socket.on('productAdded', (product) => {
    console.log("salchichaconhuevos");
    const productList = document.getElementById('productList');
    const listItem = document.createElement('li');
    listItem.textContent = `${product.title} : $${product.price}`;
    productList.appendChild(listItem);
});

socket.on('productDeleted', (productId) => {
    const productList = document.getElementById('productList');
    const items = productList.getElementsByTagName('li');
    Array.from(items).forEach((item) => {
        const itemId = item.textContent.split('ID: ')[1];
        if (itemId === productId) {
            productList.removeChild(item);
        }
    });
});

document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const product = []
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let code = document.getElementById('code').value;
    let price = document.getElementById('price').value;
    let stock = document.getElementById('stock').value;
    let thumbnail = document.getElementById('thumbnail').value;
    let category = document.getElementById('category').value;
    let status = document.getElementById('status').value;
    product.push("title", title, "description", description, "code", code, "price", price, "stock", stock, "thumbnail", thumbnail, "category", category, "status", status);
    socket.emit('addProduct', {product});
});

document.getElementById('deleteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    socket.emit('deleteProduct', productId);
    document.getElementById('productId').value = '';
});


