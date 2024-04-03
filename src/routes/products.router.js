import { Router } from 'express';
import { ProductsManager } from '../dao/ProductsManagerMongo.js';
export const router = Router();
const productosManager = new ProductsManager();

router.get("/", async(req, res) => {
    try {
        
        let {limit, page, sort, query } = req.query

        let response = await productosManager.getProducts(limit, page, sort, query)
        
        res.status(200).json(response)
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
})

router.get("/:pid", async (req, res) => {
    try {        
        const product = await productosManager.getProductById(req.params.pid)

        res.send(product);
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const product = req.body.product

        let respuesta = await productosManager.addProduct(product)

        req.io.emit("addProduct", respuesta)
        res.setHeader('Content-Type','application/json')
        res.status(201).json(respuesta)
        
    } catch (error) {
        res.send(error.message);
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const respuesta = await productosManager.updateProduct(req.params.pid, req.body.producto)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const respuesta = await productosManager.deleteProduct(req.params.pid)

        req.io.emit("deleteProduct", respuesta)
        res.setHeader('Content-Type','application/json')
        res.status(201).json(respuesta)
    } catch (error) {
        res.send(error.message);
    }
})

export default router;