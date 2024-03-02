import fs from 'fs';

class ProductManager {

    constructor(ruta) {
        this.path = ruta;
    }

    async addProduct(title, description, price, thumbnail = [], stock, category, code, status = true) {
        try {
            const products = await this.getProducts();

            if (!title || !description || !price || !category || !stock || !code) {
                throw new Error("Debe completar todos los campos para agregar") 
            }
            else if (typeof title !== "string" || typeof description !== "string" || typeof category !== "string" || typeof code !== "number" || typeof price !== "number" || typeof stock !== "number" || typeof status !== "boolean" || !Array.isArray(thumbnail)) {
                throw new Error("Los tipos de datos ingresados no son correctos")
            }

            if (products.some(product => product.code === code)) {
                throw new Error("Ya existe un producto con este código")
            }

            let id = 1
            if (products.length > 0) {
                id = products[products.length - 1].id + 1
            }
    
            const newProduct = { id, title, description, price, thumbnail: Array.isArray(products) ? thumbnail : [], stock, code, category, status };
            products.push(newProduct);
    
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
            return "Producto agregado correctamente";
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(idProduct, datos = {}) {
        try {
            const products = await this.getProducts();

            idProduct = Number(idProduct);
            if (isNaN(idProduct)) {
                throw new Error("El ID del producto debe ser un número");
            }

            let propiedadesValidasProduct = ["title", "description", "price", "thumbnail", "stock", "code", "status"]

            let propiedadesQueQuieroModificar = Object.keys(datos)

            let ok = propiedadesQueQuieroModificar.every(prop => propiedadesValidasProduct.includes(prop))

            if (!ok) {
                throw new Error("Está intentando ingresar un dato erroneo!")
            }

            if (datos.code) {                
                if (products.some(product => product.code === datos.code && product.id !== idProduct)) {
                    throw new Error("Ya existe un producto con este código")
                }
            }
            
            const indiceProduct = products.findIndex(p => p.id == idProduct);

            if (indiceProduct === -1) {
                throw new Error("Este producto no existe")
            }

            const updatedProduct = {
                ...products[indiceProduct],
                ...datos,
                id: idProduct
            };
            
            products[indiceProduct] = updatedProduct;

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
            
            return "Producto actualizado correctamente";

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProduct(idProduct) {
        try {

            idProduct = Number(idProduct);
            if (isNaN(idProduct)) {
                throw new Error("El ID del producto debe ser un número");
            }

            let products = await this.getProducts();
            let filteredProducts = products.filter(product => product.id !== idProduct);
    
            if (filteredProducts.length === products.length) {
                throw new Error("No se encontró ningún producto con ese ID");
            }
    
            await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 5));
            return "Producto eliminado correctamente";
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProducts() {
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

    async getProductById(id) {
        try {

            id = Number(id);
            if (isNaN(id)) {
                throw new Error("El ID del producto debe ser un número");
            }

            const products = await this.getProducts();
            const product = products.find(p => p.id == id);

            if (product) {
                return product;            
            } else {
                throw new Error("No se encontró ningún producto con ese ID");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default ProductManager;