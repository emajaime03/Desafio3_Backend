const express = require("express");
const ProductManager = require("./ProductManager.js")

const port = 8080

const app = express()

app.get("/", (req, res) => {
    res.send("Bienvenido a la tienda de productos")
})

app.get("/products", async (req, res) => {
    try {
        const productManager = new ProductManager(__dirname + "/products.json");
        let products = await productManager.getProducts()

        let {limit} = req.query

        if (limit && limit > 0) {
            products = products.slice(0, limit)            
        }

        res.send(products);
    } catch (error) {
        res.send(error.message);
    }
})

app.get("/products/:pid", async (req, res) => {
    try {
        const productManager = new ProductManager(__dirname + "/products.json");

        let {pid: pid} = req.params
        pid = Number(pid)

        if (isNaN(pid)) {
            return res.send("Error: el ID del producto debe ser un número")        
        }

        const product = await productManager.getProductById(pid)

        if (product === -1) {
            res.send(`Error: no se encontró ningún producto con el ID ${pid}` )
        } else {
            res.send(product);
        }
    } catch (error) {
        res.send(error.message);
    }
})

app.get("*", (req, res) => {
    res.send("Error 404 - Not Found")
})

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto", port)
})