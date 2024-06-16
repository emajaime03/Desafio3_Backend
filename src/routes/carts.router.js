import { Router } from 'express';
import CartsController from '../controllers/carts.controller.js';
import {auth} from '../middlewares/auth.js'

export const router = Router();

router.get("/:cid", auth(["user", "premium"]), CartsController.getCartById)
router.post("/", auth(["user", "premium"]), CartsController.createCart)
router.post("/:cid/product/:pid", auth(["user", "premium"]), CartsController.addProduct)
router.delete("/:cid/product/:pid", auth(["user", "premium"]), CartsController.deleteProduct)
router.delete("/:cid", auth(["user", "premium"]), CartsController.deleteAllProducts)
router.post("/:cid/purchase", auth(["user", "premium"]), CartsController.purchase)