import { Router } from 'express';
import CartManager from '../dao/mongo/CartsManagerMongo.js';
import ProductsManager from '../dao/mongo/ProductsManagerMongo.js';

export const router = Router();
const cartManager = new CartManager();
const productsManager = new ProductsManager();

router.get("/:cid", async (req, res) => {
    try {

        const products = await cartManager.getCartProductsById(req.params.cid)

        res.send(products);
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/", async (req, res) => {
    try {
        let respuesta = ""
        if (req.body.products) {

            req.body.products.forEach(async product => {
                await productsManager.getProductById(product.productId)
            });

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
        await productsManager.getProductById(req.params.pid)

        const respuesta = await cartManager.addProduct(req.params.cid, req.params.pid, req.body.quantity || 1)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const respuesta = await cartManager.deleteProduct(req.params.cid, req.params.pid)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const respuesta = await cartManager.deleteAllProducts(req.params.cid)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
})

router.put("/:cid", async (req, res) => {
    try {
        const respuesta = await cartManager.updateCart(req.params.cid, req.body.products)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const respuesta = await cartManager.addProduct(req.params.cid, req.params.pid, req.body.quantity, true)

        res.send(respuesta);
    } catch (error) {
        res.send(error.message);
    }
});


export default router;