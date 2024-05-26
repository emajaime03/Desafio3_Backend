import {MessagesDAO} from "../dao/factory.js"

class MessagesService {
    constructor(dao) {
        this.MessagesDAO = new dao()
    }

    async getAllMessages() {
        return await this.MessagesDAO.getAll()
    }

    async createMessage(user, message) {
        return await this.MessagesDAO.create(user, message)
    }
}

export const messagesService = new MessagesService(MessagesDAO)