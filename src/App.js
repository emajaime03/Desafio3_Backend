import express from 'express';
import { router as productsRouter } from './routes/products.router.js';
import { router as cartsRouter } from './routes/carts.router.js';

const port = 8080

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Bienvenido a la tienda de productos")
})

app.use("/api/products", productsRouter)

app.use("/api/carts", cartsRouter)

app.get("*", (req, res) => {
    res.send("Error 404 - Not Found")
})

const server = app.listen(port, () => {
    console.log("Servidor corriendo en el puerto", port)
})