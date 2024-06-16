import { ERRORS } from "../utils/EErrors.js";
import { logger } from "../utils/Logger.js";

export default (error, req, res, next)=>{
    let errorDetail
    if (error.cause) {
        if(error.cause.message){
            errorDetail = error.cause.message
        } else {
            errorDetail = error.cause
        }
    } else {
        errorDetail = error.message
    }

    switch(error.code) {
        case ERRORS.INTERNAL_SERVER_ERROR:
            logger.fatal(errorDetail)
            break;
        case ERRORS.BAD_REQUEST:
            logger.warn(errorDetail)
            break;
        default:
            logger.error(errorDetail)
    }
    return res.status(error.code).json({message: error.message})
}