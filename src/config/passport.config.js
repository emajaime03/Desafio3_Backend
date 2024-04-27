import passport from "passport";
import local from "passport-local";
import { UsuariosManagerMongo } from "../dao/mongo/UsuariosManagerMongo.js";
import { CartsManager } from "../dao/mongo/CartsManagerMongo.js";
import { creaHash, validaPassword } from "../utils.js";
import github from "passport-github2";

const usuariosManager = new UsuariosManagerMongo();
const cartsManager = new CartsManager();

// 1) Definir la funcion de configuracion
export const inicializarPassport = () => {

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async function (req, username, password, done) {
                try {
                    let { first_name, last_name, age } = req.body
                    if (!first_name || !last_name || !age) {
                        return done(null, false)
                    }

                    let existe = await usuariosManager.getBy({ email:username })
                    if (existe) {
                        return done(null, false)
                    }

                    let rol = "usuario"

                    // validaciones extra...
                    password = creaHash(password)

                    let userCart = await cartsManager.createCart()

                    let nuevoUsuario = await usuariosManager.create({ rol, first_name, last_name, age, email:username, password, cart: userCart._id})

                    return done(null, nuevoUsuario)
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

                    let usuario = await usuariosManager.getBy({ email:username })
                    if (!usuario) {
                        return done(null, false)
                    }

                    if (!validaPassword(usuario, password)) {
                        return done(null, false)
                    }

                    return done(null,usuario)
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
            async function(access_token, refreshToken, profile, done){
                try {
                    let nombre=profile._json.name
                    let email=profile._json.email
                    if(!email){
                        return done(null, false)
                    }
                    let usuario=await usuariosManager.getBy({email})
                    if(!usuario){
                        let userCart = await cartsManager.createCart()
                        usuario=await usuariosManager.create({
                            nombre, email, rol:'usuario', cart:userCart._id,
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