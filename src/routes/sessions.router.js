import { Router } from 'express';
import passport from 'passport';
import {auth} from '../middlewares/auth.js'
import {checklogin} from '../middlewares/checklogin.js'
import SessionsController from '../controllers/sessions.controller.js';

export const router=Router()

router.post('/signup', checklogin, auth(["public"]), SessionsController.signup);
router.post('/login', checklogin, auth(["public"]), SessionsController.login);
router.post('/recoveryRequest', auth(["public"]), SessionsController.recoveryRequest);
router.post('/recoveryReset', auth(["public"]), SessionsController.recoveryReset);
router.get('/recoveryVerify', auth(["public"]), SessionsController.recoveryVerify);
router.get('/current', checklogin, auth(["public"]), SessionsController.getCurrentSession);
router.get('/logout', auth(["public"]), SessionsController.logout);
router.get('/github', checklogin, auth(["public"]), passport.authenticate('github', {}), async (req,res)=>{});
router.get('/callbackGithub', checklogin, auth(["public"]), passport.authenticate('github', {failureRedirect: "/login"}), async (req,res)=>{
    req.session.usuario = req.user
    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        payload:"Login correcto", usuario:req.user
    })
})
