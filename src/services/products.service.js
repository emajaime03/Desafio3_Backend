import {ProductsRepository} from "../dao/repository/factory.js"

class ProductsService {
    constructor(repository) {
        this.ProductsRepository = new repository()
    }

    async getAllProductsPaginate(limit = 5, page = 1, sort = 'desc', status = 'true', category) {
        let productsPaginate
        if (!category) {
            productsPaginate = this.ProductsRepository.getAllPaginate({status:status}, { limit, page, sort: {price: sort}, lean: true })
        } else {
            productsPaginate = this.ProductsRepository.getAllPaginate({ status:status, category:category }, { limit, page, sort: {price: sort}, lean: true })
        }
        return productsPaginate
    }

    async getAllProducts() {
        return await this.ProductsRepository.getAll()
    }

    async getProductById(id) {
        return await this.ProductsRepository.getOneBy({ _id: id })
    }

    async getProductByCode(code) {
        return await this.ProductsRepository.getOneBy({ code })
    }

    async createProduct(product) {
        return await this.ProductsRepository.create(product)
    }

    async update(id, modificacion = {}) {
        return await this.ProductsRepository.update(id, modificacion);
    }

    async delete(id) {
        return await this.ProductsRepository.delete(id);
    }
}

export const productsService = new ProductsService(ProductsRepository)