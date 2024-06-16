import { Router } from 'express';
import ProductsController from '../controllers/products.controller.js';
import {auth} from '../middlewares/auth.js'
export const router = Router();

router.get("/", auth(["public"]), ProductsController.getProducts)
router.get("/:pid", auth(["public"]), ProductsController.getProductById)
router.post("/", auth(["admin", "premium"]), ProductsController.createProduct)
router.put("/:pid", auth(["admin", "premium"]), ProductsController.updateProduct)
router.delete("/:pid", auth(["admin", "premium"]), ProductsController.deleteProduct)