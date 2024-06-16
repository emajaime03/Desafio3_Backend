import { messagesService } from "../services/messages.service.js"
import { ERRORS } from "../utils/EErrors.js"
import CustomError from "../utils/CustomError.js"

export default class MessagesController {

    static getAllMessages = async (req, res) => {

        try {
            let messages = await messagesService.getAllMessages()

            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(messages)
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }

    }

    static createMessage = async (req, res) => {

        try {
            let { user, message } = req.body

            if (!user || !message) {
                CustomError.createError({ name: 'Error', cause: 'Faltan datos', message: `Faltan datos`, code: ERRORS.BAD_REQUEST })
            }

            let userMessage = await messagesService.createMessage(user, message)
            res.setHeader('Content-Type', 'application/json')
            return res.status(201).json(userMessage)
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })         
        }
    }
}