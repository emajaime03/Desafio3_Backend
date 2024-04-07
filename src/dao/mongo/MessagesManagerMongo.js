import {MessagesModel} from '../models/messages.modelo.js';

export class MessagesManager {

    async getAllMessages() {
        try {
            return await MessagesModel.find().lean();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addMessage(user, message) {
        try {
            if (!user || !message) {
                throw new Error("Faltan datos del mensaje");
            }

            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(user)) {
                throw new Error("El usuario no tiene un formato de email válido");
            }

            return await MessagesModel.create({message: message, user: user});
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default MessagesManager;