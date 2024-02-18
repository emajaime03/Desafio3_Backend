const fs = require("fs")

class ProductManager {

    constructor(ruta) {
        this.path = ruta;
    }

    async addProduct(title, description, price, thumbnail, stock, code) {
        const products = await this.getProducts();

        if (!title || !description || !price || !thumbnail || !stock || !code) {
            return "Debe completar todos los campos para agregar"
        }

        if (products.some(product => product.code === code)) {
            return "Ya existe un producto con este código"
        }

        let id = 1
        if (products.length > 0) {
            id = products[products.length - 1].id + 1
        }

        const newProduct = { id, title, description, price, thumbnail, stock, code };
        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
        return "Producto agregado correctamente";
    }

    async updateProduct(idProduct, datos = {}) {

        let propiedadesValidasProduct = ["title", "description", "price", "thumbnail", "stock", "code"]

        let propiedadesQueQuieroModificar = Object.keys(datos)

        let ok = propiedadesQueQuieroModificar.every(prop => propiedadesValidasProduct.includes(prop))

        if (!ok) {
            return "Está intentando ingresar un dato erroneo!"
        }

        const products = await this.getProducts();
        const indiceProduct = products.findIndex(p => p.id == idProduct);

        if (indiceProduct === -1) {
            return "Este producto no existe"
        }

        const updatedProduct = {
            ...products[indiceProduct],
            ...datos,
            id: idProduct
        };
        
        products[indiceProduct] = updatedProduct;

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
        return "Producto modificado correctamente";
    }

    async deleteProduct(idProduct) {
        let products = await this.getProducts();
        let filteredProducts = products.filter(product => product.id !== idProduct);

        if (filteredProducts.length === products.length) {
            return "No se encontró ningún producto con ese ID";
        }

        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 5));
        return "Producto eliminado correctamente";
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id == id);

        return product ? product : -1;
    }
}

module.exports = ProductManager