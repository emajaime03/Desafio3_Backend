import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { config } from './config/config.js';
import { router as productsRouter } from './routes/products.router.js';
import { router as cartsRouter } from './routes/carts.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as viewsRouter } from './routes/views.router.js';
import { router as messagesRouter } from './routes/messages.router.js';
import { router as mockingRouter } from './routes/mocking.router.js';
import { router as usersRouter } from './routes/users.router.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from 'express-session';
import { initializePassport } from './config/passport.config.js';
import passport from 'passport';
import MongoStore from "connect-mongo"
import CustomError from './utils/CustomError.js';
import errorHandler from './middlewares/errorHandler.js';
import { ERRORS } from './utils/EErrors.js';
import { logger, middLogg } from './utils/Logger.js';
import "express-async-errors"
const PORT = config.general.PORT;

const app = express()

const server = app.listen(PORT, () => {
    logger.http(`Servidor escuchando en el puerto ${PORT}`)
})

let io
io = new Server(server)
io.on("connection", async socket => {
    logger.info(`Nuevo cliente conectado con id ${socket.id}`)

    io.emit("reload")
    socket.on("reload", () => {
        io.emit("reload")
    })
})

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce',
            version: '1.0.0',
            description: 'Documentación del proyecto Ecommerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const spec = swaggerJSDoc(swaggerOptions)

app.use(middLogg)

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session(
    {
        secret: config.general.SECRET,
        resave: true, saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: `${config.db.MONGO_URL}&dbname=${config.db.DB_NAME}`, ttl: 24 * 60 * 60 })
    }
))
initializePassport()
app.use(passport.initialize())
app.use(passport.session()) // solo si estamos usando sesiones

app.use("/", viewsRouter)
app.use("/api/users", usersRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/messages", messagesRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec))

app.use("/", mockingRouter)

app.get('/loggerTest', (req, res) => {
    logger.debug('Debug message');
    logger.http('HTTP message');
    logger.info('Info message');
    logger.warning('Warning message');
    logger.error('Error message');
    logger.fatal('Fatal message');
    return res.send('Logging test completed');
});

app.use((req, res, next) => {
    CustomError.createError({ name: 'Error', cause: 'Ruta incorrecta', message: `Página no encontrada`, code: ERRORS.NOT_FOUND })
});

app.use(errorHandler);