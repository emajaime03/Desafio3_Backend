import { Router } from "express";
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