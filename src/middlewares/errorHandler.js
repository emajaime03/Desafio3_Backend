import { ERRORS } from "../utils/EErrors.js";
import { logger } from "../utils/logger.js";

export default (error, req, res, next)=>{
    switch(error.code) {
        case ERRORS.INTERNAL_SERVER_ERROR:
            logger.fatal(error.message)
        default:
            logger.error(error.message)
    }
}