import { Router } from "express";
import { auth } from '../middlewares/auth.js';
import { checklogin } from '../middlewares/checklogin.js';
import ViewsController from "../controllers/views.controller.js";

export const router = Router()

router.get("/", auth(["public"]), ViewsController.home);
router.get("/products", auth(["public"]), ViewsController.products);
router.get("/realTimeProducts", auth(["admin"]), ViewsController.realTimeProducts);
router.get("/carts", auth(["user", "premium"]), ViewsController.carts);
router.get('/chat', auth(["user", "premium"]), ViewsController.chat);
router.get('/signup', checklogin, auth(["public"]), ViewsController.signup);
router.get('/login', checklogin, auth(["public"]), ViewsController.login);
router.get('/recoveryRequest', auth(["public"]), ViewsController.recoveryRequest);
router.get('/recoveryReset', auth(["public"]), ViewsController.recoveryReset);
router.get('/profile', auth(["user", "premium"]), ViewsController.profile);