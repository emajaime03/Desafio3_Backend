import {MessagesModel} from '../models/messages.model.js';

export class MessagesMongoDAO {

    constructor(){}

    async getAll() {
        return await MessagesModel.find().lean();
    }

    async create(user, message) {
        return await MessagesModel.create({ user: user, message: message});
    }
}