import {ProductsModel} from './models/products.modelo.js';

export class ProductsManager {
    
    async getProducts() {
        try{
            return await ProductsModel.find().lean();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductById(id) {
        try {
            id = Number(id);
            if (isNaN(id)) {
                throw new Error("El ID del producto debe ser un número");
            }

            let product = await ProductsModel.findOne({id}).lean();

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

            let id = 1
            if (products.length > 0) {
                id = products[products.length - 1].id + 1
                product.id = id
            }

            return await ProductsModel.create(product);
        } catch (error) {
            throw new Error(error.message);
        }        
    }

    async updateProduct(id, modificacion = {}) {
        try {
            id = Number(id);
            if (isNaN(id)) {
                throw new Error("El ID del producto debe ser un número");
            }

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

            return await ProductsModel.updateOne({id:id}, modificacion);
        } catch (error) {
            throw new Error(error.message);
        }        
    }

    async deleteProduct(id) {
        try {
            id = Number(id);
            if (isNaN(id)) {
                throw new Error("El ID del producto debe ser un número");
            }

            return await ProductsModel.deleteOne({id:id});
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default ProductsManager;