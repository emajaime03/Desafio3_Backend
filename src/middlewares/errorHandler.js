import { ERRORS } from "../utils/EErrors.js";

export default (error, req, res, next)=>{
    console.log("******************")
    console.log(`${error.cause?error.cause:error.stack}`)
    console.log("******************")

    switch (error.code) {
        case ERRORS.INVALIDS_ARGUMENTS:
            res.setHeader('Content-Type','application/json');
            return res.status(ERRORS.INVALIDS_ARGUMENTS).json({error:`${error.name}`, detalle:error.message})

        case ERRORS.NOT_FOUND:
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error:"Recurso no encontrado"})

        case ERRORS.AUTENTICATION:
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:"No autorizado"})
        
        case ERRORS.AUTORIZATION:
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:"No autorizado"})
        
        case ERRORS.INTERNAL_SERVER_ERROR:
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error en el servidor`,
                    detalle:`${error.message}`
                }
            )
    
        default:
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
    }
}