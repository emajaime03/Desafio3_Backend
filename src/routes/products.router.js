import { Router } from 'express';
import ProductsController from '../controllers/products.controller.js';
import {auth} from '../middlewares/auth.js'
export const router = Router();

router.get("/", auth(["public"]), ProductsController.getProducts)
router.get("/:pid", auth(["user"]), ProductsController.getProductById)
router.post("/", auth(["admin"]), ProductsController.createProduct)
router.put("/:pid", auth(["admin"]), ProductsController.updateProduct)
router.delete("/:pid", auth(["admin"]), ProductsController.deleteProduct)