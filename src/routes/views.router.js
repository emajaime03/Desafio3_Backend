import { Router } from "express";
import ProductManager from "../classes/ProductManager.js";
import { rutaProductos } from "../utils.js";
export const router = Router()

const productManager = new ProductManager(rutaProductos);

router.get("/", async (req, res) => {
  try
  {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }  
});

router.get("/realTimeProducts", async (req, res) => {
  try{
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {  
    res.status(500).json({ error: error.message });
  }
});