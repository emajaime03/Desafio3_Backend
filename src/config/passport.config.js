import passport from "passport";
import local from "passport-local";
import { UsersDAO, CartsDAO } from "../dao/factory.js";
import { creaHash, validaPassword as isValidPassword } from "../utils.js";
import github from "passport-github2";

let usersDAO = new UsersDAO()
let cartsDAO = new CartsDAO()

// 1) Definir la funcion de configuracion
export const initializePassport = () => {

    passport.use(
        "register",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async function (req, username, password, done) {
                try {
                    let { first_name, last_name, age } = req.body
                    if (!first_name || !last_name || !age) {
                        return done(null, false, { message: 'Datos incompletos' })
                    }

                    let existe = await usersDAO.getOneBy({ email: username })
                    if (existe) {
                        return done(null, false, { message: 'Usuario ya registrado' })
                    }

                    let rol
                    if (username === 'adminCoder@coder.com') {
                        rol = 'admin'
                    } else {
                        rol = 'user'
                    }

                    // validaciones extra...
                    password = creaHash(password)

                    let userCart = await cartsDAO.create()

                    let newUser = await usersDAO.create({ rol, first_name, last_name, age, email: username, password, cart: userCart._id })

                    return done(null, newUser)
                }
                catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'login',
        new local.Strategy(
            {
                usernameField: 'email'
            },
            async function (username, password, done) {
                try {

                    let usuario = await usersDAO.getOneBy({ email: username })
                    if (!usuario) {
                        return done(null, false, { message: 'Usuario no registrado' })
                    }

                    if (!isValidPassword(usuario, password)) {
                        return done(null, false, { message: 'Contraseña incorrecta' })
                    }

                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        'github',
        new github.Strategy(
            {
                clientID: 'completar',
                clientSecret: 'completar',
                callbackURL: 'completar'
            },
            async function (access_token, refreshToken, profile, done) {
                try {
                    let name = profile._json.name
                    let email = profile._json.email
                    if (!email) {
                        return done(null, false)
                    }
                    let usuario = await usersDAO.getOneBy(email)
                    if (!usuario) {
                        let userCart = await cartsDAO.create()
                        let rol
                        if (email === 'adminCoder@coder.com') {
                            rol = 'admin'
                        } else {
                            rol = 'user'
                        }
                        usuario = await usersDAO.createUser({
                            name, email, rol, cart: userCart._id,
                            profileGithub: profile
                        })
                    }

                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    // 1') solo si se usan sesiones, definir serializer y deserializer
    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id);
    });

    passport.deserializeUser((usuario, done) => {
        return done(null, usuario);
    });
};