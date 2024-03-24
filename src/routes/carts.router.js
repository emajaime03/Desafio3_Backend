import { Router } from 'express';
import CartManager from '../dao/CartsManagerMongo.js';
import ProductsManager from '../dao/ProductsManagerMongo.js';
import { cartsRoute, productsRoute } from '../utils.js';

export const router = Router();
const cartManager = new CartManager(cartsRoute);

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
        const productosManager = new ProductsManager(productsRoute);
        
        let respuesta = ""
        if (req.body.products) {
            for (let i = 0; i < req.body.products.length; i++) {
                await productosManager.getProductById(req.body.products[i].productId)
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
        const productosManager = new ProductsManager(productsRoute);
        
        await productosManager.getProductById(req.params.pid)

        const respuesta = await cartManager.addProduct(req.params.cid, req.params.pid, req.body.quantity || 1)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

export default router;