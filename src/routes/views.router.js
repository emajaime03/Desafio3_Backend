import { Router } from "express";
import { auth } from '../middlewares/auth.js';
import { checklogin } from '../middlewares/checklogin.js';
export const router = Router()

router.get("/", async (req, res) => {
    res.render("home");
});

router.get("/products", async (req, res) => {
    res.render("products");
});

router.get("/realTimeProducts", async (req, res) => {  
    res.render("realTimeProducts");
});

router.get("/carts/:cid", async (req, res) => {  
    res.render("carts", {cartId: req.params.cid});
});

router.get('/chat', async (req,res)=>{
    res.status(200).render('chat')
})

router.get('/registro',(req,res)=>{

    let {error, mensaje} = req.query

    res.status(200).render('registro', {error, mensaje})
})

router.get('/login', checklogin, (req,res)=>{

    res.status(200).render('login')
})

router.get('/perfil', auth, (req,res)=>{

    let usuario=req.session.usuario

    res.status(200).render('perfil', {usuario})
})