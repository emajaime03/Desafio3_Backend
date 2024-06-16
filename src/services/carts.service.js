import {CartsRepository} from "../dao/repository/factory.js"

class CartsService{
    constructor(repository){
        this.CartsRepository= new repository()
    }

    async getAllCarts(){
        return this.CartsRepository.getAll()
    }
        
    async getCartById(id){
        return await this.CartsRepository.getOneByPopulate({_id:id})
    }

    async createCart(){
        return await this.CartsRepository.create()
    }

    async updateCart(id, cart) {
        return await this.CartsRepository.update(id, cart); 
    }

    async deleteAllProducts(id) {
        return await this.CartsRepository.delete(id);
    }
}

export const cartsService=new CartsService(CartsRepository)