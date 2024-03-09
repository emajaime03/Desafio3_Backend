import fs from 'fs';

class CartManager {
    
    constructor(ruta) {
        this.path = ruta;
    }
    
    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
                return JSON.parse(data);
            } else {
                return [];
            }
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
    
            const carts = await this.getCarts();

            if (carts.length === 0 || carts.findIndex(c => c.id == id) === -1) {
                throw new Error("No se encontró ningún carrito con ese ID y/o No hay carritos creados");
            }

            const products = carts.find(c => c.id == id).products;
    
            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createCart(products = []) {
        try {

            if(!Array.isArray(products)){
                throw new Error("El carrito debe ser un array");
            }else {
                products.forEach(product => {                    
                    if (product.productId !== undefined && product.quantity !== undefined) {
                        if (isNaN(product.productId) || isNaN(product.quantity)) {
                            throw new Error("El ID y la cantidad de los productos deben ser números");
                        }
                    } else {
                        throw new Error("El ID y la cantidad de los productos son requeridos");
                    }
                });
            }

            const carts = await this.getCarts();

            let id = 1
            if (carts.length > 0) {
                id = carts[carts.length - 1].id + 1
            }

            const newCart = { id, products: Array.isArray(products) ? products : [] };
            carts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5));
            return "Carrito creado correctamente";
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
          
            const productAdded = { productId, quantity };

            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            let productExiste = false
            if(cartIndex !== -1){
                if (carts[cartIndex].products.length !== 0) {
                    productExiste = carts[cartIndex].products.findIndex(p => p.productId === productId)     

                    if (productExiste !== -1) {
                        carts[cartIndex].products[productExiste].quantity += quantity;
                    }
                    else {
                        carts[cartIndex].products.push(productAdded);
                    }   
                } else {
                        carts[cartIndex].products.push(productAdded);
                    }   

            } else {
                throw new Error("No se encontró ningún carrito con ese ID");
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5));
            return "Producto agregado correctamente";

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default CartManager;