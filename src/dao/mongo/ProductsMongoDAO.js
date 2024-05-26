import {ProductsModel} from '../models/products.model.js';

export class ProductsMongoDAO {
    
    async getAllPaginate(query, options) {
        let {
            docs: products,
            totalPages,
            prevPage, nextPage,
            hasPrevPage, hasNextPage
        } = await ProductsModel.paginate(query, options);

        return {
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            products
        }      
    }

    async getAll() {
        return await ProductsModel.find().lean();
    }

    async getOneBy(filter) {
        return await ProductsModel.findOne(filter).lean();   
    }

    async create(product) {
        return await ProductsModel.create(product);       
    }

    async update(id, modificacion = {}) {
        return await ProductsModel.findByIdAndUpdate(id, modificacion); 
    }

    async delete(id) {
        return await ProductsModel.findByIdAndDelete(id);
    }
}