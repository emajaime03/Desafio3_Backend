import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import { router as productsRouter } from './routes/products.router.js';
import { router as cartsRouter } from './routes/carts.router.js';
import { router as viewsRouter } from './routes/views.router.js';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import { MessagesManager } from './dao/mongo/MessagesManagerMongo.js';
import session from 'express-session';
let messagesManager = new MessagesManager();

const port = 8080
let io

const app = express()

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session(
    {
        secret: "backend53110",
        resave: true,
        saveUninitialized: true
    }
))

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
const connectEcommerceDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ejaime03:backend53110@cluster0.x84rmxw.mongodb.net/?retryWrites=true&w=majority', {dbname: 'ecommerce'});
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
}
connectEcommerceDB();

const serverHttp = app.listen(port, () => {
    console.log("Servidor corriendo en el puerto", port)
})
io = new Server(serverHttp)

io.on("connection", async socket=>{
    console.log(`Se conecto un cliente con id ${socket.id}`)
    
    try {
        let userMessages = await messagesManager.getAllMessages();            

        io.emit("historial", userMessages)
    } catch (error) {
        console.error("Error al obtener el historial de mensajes", error)
    }

    socket.on("mensaje", async (nombre, mensaje)=>{
        try {
            await messagesManager.addMessage(nombre, mensaje)
            io.emit("mensaje", nombre, mensaje)
        } catch (error) {
            console.error("Error al guardar el mensaje", error)
        }
    })
})
