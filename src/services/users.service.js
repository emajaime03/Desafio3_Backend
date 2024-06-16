import {UsersRepository} from "../dao/repository/factory.js"

class UsersService{
    constructor(repository){
        this.UsersRepository= new repository()
    }

    async getAllUsers(){
        return this.UsersRepository.getAll()
    }
        
    async getUserById(id){
        return await this.UsersRepository.getOneBy({_id:id})
    }
    
    async getUserByEmail(email){
        return await this.UsersRepository.getOneBy({email})
    }

    async createUser(user){
        return await this.UsersRepository.create(user)
    }

    async update(id, modification = {}) {
        return await this.UsersRepository.update(id, modification);
    }

    async delete(id) {
        return await this.UsersRepository.delete(id);
    }
}

export const usersService=new UsersService(UsersRepository)