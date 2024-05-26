import { UsersModel } from "../models/users.model.js";

export class UsersMongoDAO{

    constructor(){}
    
    async getAll(){
        return await UsersModel.find().lean()
    }

    async getOneBy(filtro={}){ 
        return await UsersModel.findOne(filtro).lean()
    }

    async create(user){
        return await UsersModel.create(user)
    }

    async update(id, modificacion = {}) {
        return await UsersModel.findByIdAndUpdate(id, modificacion)
    }

    async delete(id) {
        return await UsersModel.findByIdAndDelete(id)
    }
}