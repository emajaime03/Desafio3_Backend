import { isValidObjectId } from "mongoose"
import { messagesService } from "../services/messages.service.js"

export default class MessagesController {

    static getAllMessages = async (req, res) => {

        try {
            let messages = await messagesService.getAllMessages()

            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(messages)
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )
        }

    }

    static createMessage = async (req, res) => {

        try {
            let { user, message } = req.body

            if (!user || !message) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Faltan datos` })
            }

            let userMessage = await messagesService.createMessage(user, message)
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json(userMessage)
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )
        }
    }
}