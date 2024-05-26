import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import {config} from './config/config.js';
import { router as productsRouter } from './routes/products.router.js';
import { router as cartsRouter } from './routes/carts.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as viewsRouter } from './routes/views.router.js';
import { router as messagesRouter } from './routes/messages.router.js';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import session from 'express-session';
import { inicializarPassport } from './config/passport.config.js';
import passport from 'passport';
import MongoStore from "connect-mongo"

const PORT = config.general.PORT;

const app = express()

const server = app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto", PORT)
})

let io
io = new Server(server)
io.on("connection", async socket=>{
    console.log(`Se conecto un cliente con id ${socket.id}`)

    io.emit("reload")
    socket.on("reload", ()=>{
        io.emit("reload")
    })
})

const connectDB = async () => {
    try {        
        await mongoose.connect(`${config.db.MONGO_URL}&dbname=${config.db.DB_NAME}`);
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
}
connectDB();

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname,'/public')));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session(
    {
        secret: config.general.SECRET,
        resave: true, saveUninitialized: true,
        store: MongoStore.create({mongoUrl: `${config.db.MONGO_URL}&dbname=${config.db.DB_NAME}`, ttl:60})       
    }
))
inicializarPassport()
app.use(passport.initialize())
app.use(passport.session()) // solo si estamos usando sesiones


app.use("/", viewsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/messages", messagesRouter)
app.use("/api/products", (req, res, next)=>{
    req.io=io
    next()
},productsRouter)
app.use("/api/carts", cartsRouter)

app.get("*", (req, res) => {
    res.send("Error 404 - Not Found")
})