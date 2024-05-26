import { MessagesMongoDAO as MessagesDAO } from "../dao/mongo/MessagesMongoDAO.js"

class MessagesService {
    constructor(dao) {
        this.MessagesDAO = dao
    }

    async getAllMessages() {
        return await this.MessagesDAO.getAll()
    }

    async createMessage(user, message) {
        return await this.MessagesDAO.create(user, message)
    }
}

export const messagesService = new MessagesService(new MessagesDAO())