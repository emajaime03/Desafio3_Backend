import { Router } from "express";
import MessagesController from "../controllers/messages.controller.js";
import {auth} from '../middlewares/auth.js'

export const router = Router();

router.get("/", auth(["user", "premium"]), MessagesController.getAllMessages);
router.post("/", auth(["user", "premium"]), MessagesController.createMessage);