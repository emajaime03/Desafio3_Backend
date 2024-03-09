import { Router } from 'express';
import path from 'path';
import CartManager from '../classes/CartManager.js';
import ProductManager from '../classes/ProductManager.js';
import { rutaCarritos, rutaProductos } from '../utils.js';

export const router = Router();

router.get("/:cid", async (req, res) => {
    try {
        const cartManager = new CartManager(rutaCarritos);
        
        const products = await cartManager.getProductsById(req.params.cid)

        res.send(products);
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const cartManager = new CartManager(rutaCarritos);
        const productManager = new ProductManager(rutaProductos);
        
        let respuesta = ""
        if (req.body.products) {
            for (let i = 0; i < req.body.products.length; i++) {
                await productManager.getProductById(req.body.products[i].productId)
            }
            respuesta = await cartManager.createCart(req.body.products)
            res.send(respuesta);
        } else {
            respuesta = await cartManager.createCart()  
            res.send(respuesta);
        }
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartManager = new CartManager(rutaCarritos);
        const productManager = new ProductManager(rutaProductos);
        
        await productManager.getProductById(req.params.pid)

        const respuesta = await cartManager.addProduct(req.params.cid, req.params.pid)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

export default router;