import passport from 'passport';
import UserDTO from '../dao/dto/UserDTO.js';
import { ERRORS } from "../utils/EErrors.js"
import CustomError from "../utils/CustomError.js"
import { logger } from '../utils/logger.js';

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

    static async getCurrentSession(req, res, next) {
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
            req.session.destroy(e => {
                if (e) {
                    CustomError.createError({ name: 'Error', cause: e, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
                }
            })
            logger.info(`Logout exitoso para ${user.last_name}`)
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/login')
        } catch (error) {
            logger.error("Ha ocurrido un error al intentar cerrar la sesión")
        }
    }
}