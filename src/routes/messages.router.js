import { Router } from "express";
import MessagesController from "../controller/messages.controller.js";
import {auth} from '../middlewares/auth.js'

export const router = Router();

router.get("/", auth(["user"]), MessagesController.getAllMessages);
router.post("/", auth(["user"]), MessagesController.createMessage);