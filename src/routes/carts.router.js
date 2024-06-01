import { Router } from 'express';
import CartsController from '../controllers/carts.controller.js';
import {auth} from '../middlewares/auth.js'

export const router = Router();

router.get("/:cid", auth(["user"]), CartsController.getCartById)
router.post("/", auth(["user"]), CartsController.createCart)
router.post("/:cid/product/:pid", auth(["user"]), CartsController.addProduct)
router.delete("/:cid/product/:pid", auth(["user"]), CartsController.deleteProduct)
router.delete("/:cid", auth(["user"]), CartsController.deleteAllProducts)
router.post("/:cid/purchase", auth(["user"]), CartsController.purchase)