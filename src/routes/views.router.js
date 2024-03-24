import { Router } from "express";
export const router = Router()

router.get("/", async (req, res) => {
    res.render("home");
});

router.get("/realTimeProducts", async (req, res) => {  
    res.render("realTimeProducts");
});

router.get('/chat', async (req,res)=>{
    res.status(200).render('chat')
})