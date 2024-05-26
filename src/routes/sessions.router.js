import { Router } from 'express';
import passport from 'passport';
import {auth} from '../middlewares/auth.js'
import {checklogin} from '../middlewares/checklogin.js'
import SessionsController from '../controller/sessions.controller.js';

export const router=Router()

router.post('/signup', checklogin, auth(["public"]), SessionsController.signup)
router.post('/login', checklogin, auth(["public"]), SessionsController.login)
router.get('/logout', auth(["public"]), SessionsController.logout);
router.get('/github', checklogin, auth(["public"]), passport.authenticate('github', {}), (req,res)=>{});
router.get('/callbackGithub', checklogin, auth(["public"]), passport.authenticate('github', {failureRedirect:'/api/sessions/errorGithub'}), (req,res)=>{
    console.log('hola')
    req.session.usuario = req.user
    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        payload:"Login correcto", usuario:req.user
    })
})
