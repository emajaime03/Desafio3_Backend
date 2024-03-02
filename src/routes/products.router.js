import { Router } from 'express';
import path from 'path';
import ProductManager from '../ProductManager.js';
import __dirname from '../utils.js';

export const router = Router();

let ruta = path.join(__dirname, 'data', 'products.json');

router.get("/", async(req, res) => {
    try {
        const productManager = new ProductManager(ruta);
        let products = await productManager.getProducts()

        let {limit} = req.query

        if (limit && limit > 0) {
            products = products.slice(0, limit)            
        }

        res.send(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/:pid", async (req, res) => {
    try {
        const productManager = new ProductManager(ruta);
        
        const product = await productManager.getProductById(req.params.pid)

        res.send(product);
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const productManager = new ProductManager(ruta);
        
        const { title, description, code, price, stock, thumbnail, category, status} = req.body

        let respuesta = await productManager.addProduct(title, description, price, thumbnail, stock,  category, code, status)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const productManager = new ProductManager(ruta);

        const respuesta = await productManager.updateProduct(req.params.pid, req.body)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const productManager = new ProductManager(ruta);

        const respuesta = await productManager.deleteProduct(req.params.pid)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

export default router;