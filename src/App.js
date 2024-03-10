import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import { router as productsRouter } from './routes/products.router.js';
import { router as cartsRouter } from './routes/carts.router.js';
import { router as viewsRouter } from './routes/views.router.js';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io'; 

const port = 8080
let io

const app = express()

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname,'/public')));

app.use("/api/products", (req, res, next)=>{
    req.io=io
    next()
},productsRouter)
app.use("/api/carts", cartsRouter)

app.use("/", viewsRouter)

app.get("*", (req, res) => {
    res.send("Error 404 - Not Found")
})

const serverHttp = app.listen(port, () => {
    console.log("Servidor corriendo en el puerto", port)
})
io = new Server(serverHttp)

io.on('connection', (socket) => {
    io.emit("saludo", "Hola desde el servidor")
});