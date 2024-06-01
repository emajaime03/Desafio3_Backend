import { Router } from "express";
import { auth }from "../middlewares/auth.js";
import MockingController from '../controllers/mocking.controller.js';

export const router = Router();

router.get("/mockingProducts",auth(["PUBLIC"]), MockingController.createAndGetAllFakeProducts);