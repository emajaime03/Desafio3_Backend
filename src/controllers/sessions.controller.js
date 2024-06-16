import passport from 'passport';
import UserDTO from '../dao/dto/UserDTO.js';
import { ERRORS } from "../utils/EErrors.js"
import CustomError from "../utils/CustomError.js"
import { logger } from '../utils/Logger.js';
import { usersService } from '../services/users.service.js';
import { config } from '../config/config.js';
import { sendMail } from '../utils.js';
import { creaHash, validaPassword } from "../utils.js";
import jwt from 'jsonwebtoken';

export default class SessionsController {

    static async signup(req, res) {
        try {
            passport.authenticate("register", (err, user, info) => {
                if (err) {
                    logger.error(err.message)
                    return res.redirect(`/signup?error=${err.message}`)
                }
                if (!user) {
                    logger.error(info.message)
                    return res.redirect(`/signup?error=${info.message}`)
                }
                logger.info(`Registro exitoso para ${user.last_name}`)
                return res.redirect(`/signup?mensaje=Registro exitoso para ${user.last_name}`)
            })(req, res);
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    };

    static async login(req, res, next) {
        try {
            passport.authenticate("login", (err, user, info) => {
                if (err) {
                    logger.error(err.message)
                    return res.status(500).json({ error: err.message, success: false });
                }
                if (!user) {
                    logger.error(info.message)
                    return res.status(400).json({ error: info.message, success: false });
                }
                req.login(user, (err) => {
                    if (err) {
                        logger.error(err.message)
                        return res.status(500).json({ error: err.message, success: false });
                    }
                    req.session.user = user
                    logger.info(`Login exitoso para ${user.last_name}`)
                    return res.status(200).json({ message: "Login exitoso", user, success: true });
                });
            })(req, res, next);
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    };

    static async recoveryRequest(req, res) {
        try{
            let {email} = req.body
    
            if (!email) {
                logger.error("Email no encontrado")
                return res.status(400).json({ error: "Email no encontrado", success: false });
            }
    
            let user = await usersService.getUserByEmail(email)
    
            if (!user) {
                logger.error("Usuario no encontrado")
                return res.status(404).json({ error: "Usuario no encontrado", success: false });
            }
    
            delete user.password // eliminar datos confidenciales...
            let token=jwt.sign(user, config.general.SECRET, {expiresIn:"1h"})
            let url=`http://localhost:8080/api/sessions/recoveryVerify?token=${token}`
            let mensaje=`Ha solicitado reinicio de password. Si no fue usted, avise al 
            admin... para continuar haga click <a href="${url}">aqui</a>`
            
            await sendMail(email, "Recupero de password", mensaje)
            return res.redirect("/recoveryRequest?message=Recibira un email en breve. Siga los pasos...")
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }

    static async recoveryVerify(req, res) {        
        try{
            let {token} = req.query
            if(!token){
                logger.error("Token no encontrado")
                return res.status(400).json({ error: "Token no encontrado", success: false });
            }
            let user=jwt.verify(token, config.general.SECRET)
            if(!user){
                logger.error("Token inválido")
                return res.status(400).json({ error: "Token inválido", success: false });
            }
            return res.redirect(`/recoveryReset?token=${token}`)
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }

    static async recoveryReset(req, res) {
        try{
            let {token} = req.query
            let {password} = req.body
            if(!token){
                logger.error("Token no encontrado")
                return res.status(400).json({ error: "Token no encontrado", success: false });
            }
            let user=jwt.verify(token, config.general.SECRET)
            if(!user){
                logger.error("Token inválido")
                return res.status(400).json({ error: "Token inválido", success: false });
            }
            if(!password){
                logger.error("Contraseña no encontrada")
                return res.status(400).json({ error: "Contraseña no encontrada", success: false });
            }
            let userDB = await usersService.getUserByEmail(user.email)
            if(validaPassword(userDB, password)){
                logger.error("La contraseña no puede ser igual a la anterior")
                return res.status(400).json({ error: "La contraseña no puede ser igual a la anterior", success: false });
            }
            password=creaHash(password)
            let userUpdated = await usersService.update(user._id, {password})
            if(!userUpdated){
                logger.error("Error al actualizar la contraseña")
                return res.status(400).json({ error: "Error al actualizar la contraseña", success: false });
            }
            logger.info(`Contraseña actualizada para ${userUpdated.last_name}`)
            return res.status(200).json({ message: "Contraseña actualizada", success: true });
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }

    static async getCurrentSession(req, res, next) {

        if (!req.session.user) {
            logger.error("No hay una sesión activa")
            return res.status(400).json({ error: "No hay una sesión activa" });
        }

        const userDTO = new UserDTO(req.session.user);

        const session = {
            message: "Sesión activa",
            user: userDTO
        };
        logger.info(`Session activa para ${userDTO.last_name}`)
        return res.status(200).json(session);
    };

    static async logout(req, res) {
        try {
            let user = req.session.user
            if (!user) {
                logger.error("No hay una sesión activa")
                return res.status(400).json({ error: "No hay una sesión activa" });
            }
            req.session.destroy(e => {
                if (e) {
                    CustomError.createError({ name: 'Error', cause: e, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
                }
            })
            logger.info(`Logout exitoso para ${user.last_name}`)
            res.setHeader('Content-Type', 'application/json');
            return res.redirect('/login')
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Ha ocurrido un error al intentar cerrar la sesión`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }
}