import { Router } from 'express';
import ProductManager from '../classes/ProductManager.js';
import { rutaProductos } from '../utils.js';
export const router = Router();
const productManager = new ProductManager(rutaProductos);

router.get("/", async(req, res) => {
    try {
        let products = await productManager.getProducts()

        let {limit} = req.query

        if (limit && limit > 0) {
            products = products.slice(0, limit)            
        }

        res.status(200).json(products)
        
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/:pid", async (req, res) => {
    try {        
        const product = await productManager.getProductById(req.params.pid)

        res.send(product);
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, thumbnail, category, status} = req.body

        let newProduct = await productManager.addProduct(title, description, price, thumbnail, stock,  category, code, status)

        req.io.emit("newProduct", newProduct)
        res.setHeader('Content-Type','application/json')
        res.status(201).json({newProduct})
        
    } catch (error) {
        res.send(error.message);
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const productManager = new ProductManager(rutaProductos);

        const respuesta = await productManager.updateProduct(req.params.pid, req.body)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const productManager = new ProductManager(rutaProductos);

        const respuesta = await productManager.deleteProduct(req.params.pid)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

export default router;