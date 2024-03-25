import { Router } from 'express';
import CartManager from '../dao/CartsManagerMongo.js';
import ProductsManager from '../dao/ProductsManagerMongo.js';

export const router = Router();
const cartManager = new CartManager();

router.get("/:cid", async (req, res) => {
    try {
        const products = await cartManager.getProductsById(req.params.cid)

        res.send(products);
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const productsManager = new ProductsManager();
        
        let respuesta = ""
        if (req.body.products) {
            for (let i = 0; i < req.body.products.length; i++) {
                await productsManager.getProductById(req.body.products[i].productId)
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
        const productsManager = new ProductsManager();
        
        await productsManager.getProductById(req.params.pid)

        const respuesta = await cartManager.addProduct(req.params.cid, req.params.pid, req.body.quantity || 1)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

export default router;