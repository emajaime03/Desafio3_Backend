import { Router } from "express";
import { auth } from '../middlewares/auth.js';
import { checklogin } from '../middlewares/checklogin.js';
export const router = Router()

router.get("/", async (req, res) => {
    res.render("home", {login:req.session.usuario});
});

router.get("/products", async (req, res) => {
    
    let usuario = req.session.usuario

    if (usuario) {
        res.render("products", {cartId: usuario.cart, login:usuario});
    }
    else{
        res.render("products", {cartId: null, login:usuario});
    }
});

router.get("/realTimeProducts", async (req, res) => {  
    let usuario = req.session.usuario

    if (usuario) {
        res.render("realTimeProducts", {cartId: usuario.cart, login:usuario});
    }
    else{
        res.render("realTimeProducts", {cartId: null, login:usuario});
    }
});

router.get("/carts", auth, async (req, res) => {  

    let usuario = req.session.usuario

    res.render("carts", {cartId: usuario.cart, name: usuario.last_name, login:usuario});
});

router.get('/chat', async (req,res)=>{
    res.status(200).render('chat', {login:req.session.usuario})
})

router.get('/registro',(req,res)=>{

    let {error, mensaje} = req.query

    res.status(200).render('registro', {error, mensaje, login:req.session.usuario})
})

router.get('/login', checklogin, (req,res)=>{

    res.status(200).render('login', {login:req.session.usuario})
})

router.get('/perfil', auth, (req,res)=>{

    let usuario=req.session.usuario

    res.status(200).render('perfil', {usuario, login:usuario})
})