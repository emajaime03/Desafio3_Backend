import { CartsModel } from '../models/carts.model.js';

export class CartsMongoDAO {

    async getAll() {
        return await CartsModel.find().lean();
    }

    async getOneBy(filtro = {}) {
        return await CartsModel.findById(filtro).lean();
    }

    async getOneByPopulate(filtro = {}) {
        return await CartsModel.findById(filtro).populate('products.product').lean();
    }

    async create() {
        return await CartsModel.create({ products: [] });
    }

    async update(id, cart) {
        return await CartsModel.findByIdAndUpdate(id, cart).lean()
    }
}