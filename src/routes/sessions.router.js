import { Router } from 'express';
import { UsuariosManagerMongo } from '../dao/mongo/UsuariosManagerMongo.js';
import { creaHash, validaPassword } from '../utils.js';
import passport from 'passport';
export const router=Router()

let usuariosManager=new UsuariosManagerMongo()

router.get('/errorRegistro', (req, res) => {
    return res.redirect('/registro?error=Error en el proceso de registro')
})

// 3) Implemento la estrategia correspondiente
router.post('/registro', passport.authenticate('registro', {failureRedirect:'/api/sessions/errorRegistro'}), (req,res)=>{

    // passport, si se ejecuta correctamente deja un req.user
    return res.redirect(`/registro?mensaje=Registro exitoso para ${req.user.last_name}`)

})

router.get('/errorLogin', (req, res) => {
    return res.status(400).json({error:'Error en el proceso de login'})
})

// 3) Implemento la estrategia correspondiente
router.post('/login', passport.authenticate('login', {failureRedirect:'/api/sessions/errorLogin'}), (req,res)=>{

    let usuario = req.user
    usuario={...usuario}
    delete usuario.password
    req.session.usuario=usuario // en un punto de mi proyecto

    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        message:"Login correcto", usuario
    })
})

router.get('/github', passport.authenticate('github', {}), (req,res)=>{});

// 3) Implemento la estrategia correspondiente
router.get('/callbackGithub', passport.authenticate('github', {failureRedirect:'/api/sessions/errorGithub'}), (req,res)=>{
    console.log('hola')
    req.session.usuario = req.user
    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        payload:"Login correcto", usuario:req.user
    })
})

router.get('/errorGithub', (req, res) => {
    res.setHeader('Content-Type','application/json')
    res.status(500).json({
        error:'Error inesperado en el servidor - Intente mas tarde',
        detalle: 'fallo al autenticar con GitHub'
    })
})

router.get('/logout',(req,res)=>{

    req.session.destroy(e=>{
        if(e){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${e.message}`
                }
            )
            
        }
    })
    
    res.setHeader('Content-Type','application/json');
    res.redirect('/login')
});