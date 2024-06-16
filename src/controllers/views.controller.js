import { Router } from "express";
export const router = Router()

export default class ViewsController {
    static async home(req, res) {
        res.status(200).render("home", {login:req.session.user});
    }

    static async products(req, res) {
        let user = req.session.user

        if (user) {
            return res.status(200).render("products", {cartId: user.cart, login:user});
        }
        else{
            return res.status(200).render("products", {cartId: null, login:user});
        }
    }

    static async realTimeProducts(req, res) {
        let user = req.session.user

        if (user) {
            return res.status(200).render("realTimeProducts", {cartId: user.cart, login:user});
        }
        else{
            return res.status(200).render("realTimeProducts", {cartId: null, login:user});
        }
    }

    static async carts(req, res) {
        let user = req.session.user

        return res.status(200).render("carts", {cartId: user.cart, name: user.last_name, login:user});
    }

    static async chat(req, res) {
        return res.status(200).render('chat', {login:req.session.user})
    }

    static async signup(req, res) {
        let {error, mensaje} = req.query

        return res.status(200).render('register', {error, mensaje, login:req.session.user})
    }
    
    static async login(req, res) {
        return res.status(200).render('login', {login:req.session.user})
    }

    static async recoveryRequest(req, res) {
        return res.status(200).render('recoveryRequest', {login:req.session.user})
    }

    static async recoveryReset(req, res) {
        return res.status(200).render('recoveryReset', {login:req.session.user})
    }

    static async profile(req, res) {
        let user=req.session.user

        return res.status(200).render('profile', {user, login:user})
    }
}