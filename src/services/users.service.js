import {UsersDAO} from "../dao/factory.js"

class UsersService{
    constructor(dao){
        this.UsersDAO= new dao()
    }

    async getAllUsers(){
        return this.UsersDAO.getAll()
    }
        
    async getUserById(id){
        return await this.UsersDAO.getOneBy({_id:id})
    }
    
    async getUserByEmail(email){
        return await this.UsersDAO.getOneBy({email})
    }

    async createUser(usuario){
        return await this.UsersDAO.create(usuario)
    }

    async update(id, modificacion = {}) {
        return await this.UsersDAO.update(id, modificacion);
    }

    async delete(id) {
        return await this.UsersDAO.delete(id);
    }
}

export const usersService=new UsersService(UsersDAO)