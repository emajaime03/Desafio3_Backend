import {ProductsModel} from './models/products.modelo.js';

export class ProductsManager {
    
    async getProducts(limit = 5, page = 1, sort = 'desc', query = 'true') {
        try{
            sort = sort.toString().toLowerCase()
            if (!limit || limit < 1, !page || page < 1) {
                throw new Error("Limit y Page deben ser números mayores a 0");
            }

            if (query.includes('true') || query.includes('false')) {
                let {
                    status = "error",
                    docs: products,
                    totalPages,
                    prevPage, nextPage,
                    hasPrevPage, hasNextPage
                } = await ProductsModel.paginate({status: query}, {limit, page, sort: {price: sort}, lean:true});

                status = "success";
                return {
                    status,
                    totalPages,
                    prevPage,
                    nextPage,
                    hasPrevPage,
                    hasNextPage,
                    products
                }             
            } else {
                let {
                    status = "error",
                    docs: products,
                    totalPages,
                    prevPage, nextPage,
                    hasPrevPage, hasNextPage
                } = await ProductsModel.paginate({category: query}, {limit, page, sort: {price: sort}, lean:true});

                status = "success";
                return {
                    status,
                    totalPages,
                    prevPage,
                    nextPage,
                    hasPrevPage,
                    hasNextPage,
                    products
                }
            }            

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductById(id) {
        try {
            let product = await ProductsModel.findById(id).lean();

            if (product) {
            return product;
            } else {
                throw new Error("No se encontró ningún producto con ese ID");
            }
        } catch (error) {
            throw new Error(error.message);
        }        
    }

    async addProduct(product) {
        try {
            if(!product.title || !product.price || !product.description || !product.category || !product.stock || !product.code) {
                throw new Error("Faltan datos del producto");
            }

            const products = await this.getProducts();

            if (products.some(p => p.code === product.code)) {
                throw new Error("Ya existe un producto con ese código");
            }

            return await ProductsModel.create(product);
        } catch (error) {
            throw new Error(error.message);
        }        
    }

    async updateProduct(id, modificacion = {}) {
        try {

            let propiedadesValidasProduct = ["title", "description", "price", "thumbnail", "stock", "code", "status"]

            let propiedadesQueQuieroModificar = Object.keys(modificacion)

            let ok = propiedadesQueQuieroModificar.every(prop => propiedadesValidasProduct.includes(prop))

            if (!ok) {
                throw new Error("Está intentando ingresar un dato erroneo!")
            }

            const products = await this.getProducts();

            if (modificacion.code) {                
                if (products.some(p => p.code === modificacion.code && p.id !== id)) {
                    throw new Error("Ya existe un producto con este código")
                }
            }

            const indiceProduct = products.findIndex(p => p.id == id);

            if (indiceProduct === -1) {
                throw new Error("Este producto no existe")
            }

            return await ProductsModel.findByIdAndUpdate(id, modificacion);
        } catch (error) {
            throw new Error(error.message);
        }        
    }

    async deleteProduct(id) {
        try {

            return await ProductsModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default ProductsManager;