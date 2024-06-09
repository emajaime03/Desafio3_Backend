import CustomError from "../utils/CustomError.js"
import { ERRORS } from "../utils/EErrors.js"

export const auth=(accesos=[])=>{
    return (req, res, next)=>{
        accesos=accesos.map(a=>a.toLowerCase())

        if(accesos.includes("public")){
            return next()
        }

        if(!req.session.user || !req.session.user.rol){
            CustomError.createError({name:"Unauthorized", cause: "No existen usuarios autenticados", message:"No existen usuarios autenticados", code: ERRORS.AUTENTICATION})            
        }

        if(!accesos.includes(req.session.user.rol.toLowerCase())){
            CustomError.createError({name:"Forbidden", cause: "No tiene privilegios suficientes para acceder al recurso", message:"No tiene privilegios suficientes para acceder al recurso", code: ERRORS.AUTORIZATION})
        }

        next()
    }
}