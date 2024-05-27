import {ProductsDAO} from "../dao/factory.js"

class ProductsService {
    constructor(dao) {
        this.ProductsDAO = new dao()
    }

    async getAllProductsPaginate(limit = 5, page = 1, sort = 'desc', status = 'true', category) {
        let productsPaginate
        if (!category) {
            productsPaginate = this.ProductsDAO.getAllPaginate({status:status}, { limit, page, sort: {price: sort}, lean: true })
        } else {
            productsPaginate = this.ProductsDAO.getAllPaginate({ status:status, category:category }, { limit, page, sort: {price: sort}, lean: true })
        }
        return productsPaginate
    }

    async getAllProducts() {
        return await this.ProductsDAO.getAll()
    }

    async getProductById(id) {
        return await this.ProductsDAO.getOneBy({ _id: id })
    }

    async getProductByCode(code) {
        return await this.ProductsDAO.getOneBy({ code })
    }

    async createProduct(product) {
        return await this.ProductsDAO.create(product)
    }

    async update(id, modificacion = {}) {
        return await this.ProductsDAO.update(id, modificacion);
    }

    async delete(id) {
        return await this.ProductsDAO.delete(id);
    }
}

export const productsService = new ProductsService(ProductsDAO)