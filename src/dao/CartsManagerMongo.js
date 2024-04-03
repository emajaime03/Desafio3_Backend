import {CartModel} from './models/cart.modelo.js';

export class CartsManager {

    async getCarts() {
        try{
            return await CartModel.find().lean();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCartProductsById(id) {
        try {
            let cart = await CartModel.findById(id).populate('products.product').lean();
            
            if (cart) {
                return cart.products;
            } else {
                throw new Error("No se encontró ningún carrito con ese ID");
            }
        } catch (error) {
            throw new Error(error.message);
        }        
    }

    async createCart(products = []) {
        try {

            if(!Array.isArray(products)){
                throw new Error("Los productos deben ser un array");
            }else {
                products.forEach(product => {                    
                    if (product.productId == undefined) {
                        throw new Error("El ID de los productos son requeridos");
                    }

                    if (product.quantity) {                        
                        if (isNaN(product.quantity)) {
                            throw new Error("La cantidad de los productos deben ser números");
                        }
                    }
                });
            }

            const newCart = { products: Array.isArray(products) ? products : [] };

            return await CartModel.create(newCart);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProduct(cartId, productId, quantity = 1, setQuantity = false) {
        try {
            quantity = Number(quantity);
            if (isNaN(quantity)){
                throw new Error("La cantidad de los productos debe ser un número");
            }

            const cart = await CartModel.findById(cartId).lean();

            if (cart) {
                let product = cart.products.find(p => p.product == productId);

                if (product) {
                    if (setQuantity) {
                        return await CartModel.updateOne({_id: cartId, "products.product": productId}, {$set: {"products.$.quantity": quantity}}).lean();
                    }
                    return await CartModel.updateOne({_id: cartId, "products.product": productId}, {$inc: {"products.$.quantity": quantity}}).lean();
                } else {
                    return await CartModel.updateOne({_id: cartId}, {$push: {products: {product: productId, quantity}}}).lean();
                }

            } else {
                throw new Error("No se encontró ningún carrito con ese ID");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            
            return await CartModel.updateOne({_id: cartId}, {$pull: {products: {product: productId}}}).lean();
            
        } catch (error) {
            throw new Error(error.message);
        }      
    }

    async deleteAllProducts(cartId) {
        try {
            return await CartModel.updateOne({_id: cartId}, {products: []}).lean();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateCart(cartId, products) {
        try {
            if(!Array.isArray(products)){
                throw new Error("Los productos deben ser un array");
            }else {
                products.forEach(product => {                    
                    if (product.product == undefined) {
                        throw new Error("El ID de los productos son requeridos");
                    }

                    if (product.quantity) {                        
                        if (isNaN(product.quantity)) {
                            throw new Error("La cantidad de los productos deben ser números");
                        }
                    }
                });
            }

            return await CartModel.updateOne({_id: cartId}, {products}).lean();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default CartsManager;