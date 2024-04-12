export const checklogin=(req, res, next)=>{
    if(req.session.usuario){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Ya hay un usuario autenticado`})
    }

    next()
}