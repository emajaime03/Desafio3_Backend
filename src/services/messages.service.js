import {MessagesRepository} from "../dao/repository/factory.js"

class MessagesService {
    constructor(repository) {
        this.MessagesRepository = new repository()
    }

    async getAllMessages() {
        return await this.MessagesRepository.getAll()
    }

    async createMessage(user, message) {
        return await this.MessagesRepository.create(user, message)
    }
}

export const messagesService = new MessagesService(MessagesRepository)