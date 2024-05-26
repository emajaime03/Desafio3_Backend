import passport from 'passport';

export default class SessionsController {

    static async signup(req, res) {
        try {
            passport.authenticate("register", (err, user, info) => {
                if (err) {
                    // return res.status(500).json({ error: err.message, success: false });
                    return res.redirect(`/signup?error=${err.message}`)
                }
                if (!user) {
                    // return res.status(400).json({ error: info.message, success: false });
                    return res.redirect(`/signup?error=${info.message}`)
                }
                
                // return res.status(200).json({ user, success: true });
                return res.redirect(`/signup?mensaje=Registro exitoso para ${user.last_name}`)
            })(req, res);
        } catch (error) {
            res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            });
        }
    };

    static async login(req, res, next) {
        try {
            passport.authenticate("login", (err, user, info) => {
                if (err) {
                    return res.status(500).json({ error: err.message, success: false });
                }
                if (!user) {
                    return res.status(400).json({ error: info.message, success: false });
                }
                req.login(user, (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message, success: false });
                    }
                    req.session.user = user

                    return res.status(200).json({ message: "Login exitoso", user, success: true});
                });
            })(req, res, next);
        } catch (error) {
            res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            });
        }
    };

    static async logout(req, res) {
        req.session.destroy(e => {
            if (e) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json(
                    {
                        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle: `${e.message}`
                    }
                )

            }
        })

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/login')
    }
}