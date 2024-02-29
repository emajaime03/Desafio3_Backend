import { Router } from 'express';
import path from 'path';
import CartManager from '../CartManager.js';
import ProductManager from '../ProductManager.js';
import __dirname from '../utils.js';

export const router = Router();

let ruta = path.join(__dirname, 'data', 'carrito.json');

router.get("/:cid", async (req, res) => {
    try {
        const cartManager = new CartManager(ruta);
        
        const products = await cartManager.getProductsById(req.params.cid)

        res.send(products);
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const cartManager = new CartManager(ruta);        
        const rutaProductos = path.join(__dirname, 'data', 'products.json');
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
        const cartManager = new CartManager(ruta);
        const rutaProductos = path.join(__dirname, 'data', 'products.json');
        const productManager = new ProductManager(rutaProductos);
        
        await productManager.getProductById(req.params.pid)

        const respuesta = await cartManager.addProduct(req.params.cid, req.params.pid)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

export default router;