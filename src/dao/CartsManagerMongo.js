import {CartModel} from './models/cart.modelo.js';

export class CartsManager {

    async getCarts() {
        try{
            return await CartModel.find().lean();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductsById(id) {
        try {
            id = Number(id);
            if (isNaN(id)) {
                throw new Error("El ID del carrito debe ser un número");
            }

            let cart = await CartModel.findOne({id}).lean();

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
                    if (product.productId !== undefined) {
                        if (isNaN(product.productId)) {
                            throw new Error("El ID de los productos deben ser números");
                        }
                    } else {
                        throw new Error("El ID de los productos son requeridos");
                    }

                    if (product.quantity) {                        
                        if (isNaN(product.quantity)) {
                            throw new Error("La cantidad de los productos deben ser números");
                        }
                    }
                });
            }

            const carts = await this.getCarts();

            let id = 1
            if (carts.length > 0) {
                id = carts[carts.length - 1].id + 1
            }

            const newCart = { id, products: Array.isArray(products) ? products : [] };

            return await CartModel.create(newCart);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            cartId = Number(cartId);
            productId = Number(productId);
            quantity = Number(quantity);
            if (isNaN(cartId) || isNaN(productId) || isNaN(quantity)){
                throw new Error("Formatos incorrectos");
            }

            const carts = await this.getCarts();
          
            const productAdded = { productId: productId, quantity };

            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            let productExiste = false
            if(cartIndex !== -1){
                if (carts[cartIndex].products.length !== 0) {
                    productExiste = carts[cartIndex].products.findIndex(p => p.productId === productId)     

                    if (productExiste !== -1) {
                        return await CartModel.updateOne({id: cartId, "productos.productoId": productId}, {$inc: {"productos.$.quantity": quantity}}).lean();
                    }
                    else {
                        return await CartModel.updateOne({id: cartId}, {$push: {products: productAdded}}).lean();
                    }   
                } else {
                    return await CartModel.updateOne({id: cartId}, {$push: {products: productAdded}}).lean();
                    }   

            } else {
                throw new Error("No se encontró ningún carrito con ese ID");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default CartsManager;