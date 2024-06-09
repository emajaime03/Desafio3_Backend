import winston from 'winston';
import {config} from '../config/config.js';

const customLevels={
    fatal:0,
    error:1, 
    warning:2, 
    info:3,
    http:4,
    debug:5
}

export const logger=winston.createLogger(
    {
        levels: customLevels,
        transports:[]
    }
)

const fileTransport=new winston.transports.File({
    level: "info",
    filename: "./src/logs/errors.log",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
})

const consoleTransport=new winston.transports.Console(
    {
        level: "debug", 
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
        )
    }
)

if(config.general.MODE!="PROD"){
    logger.add(consoleTransport)
} else {
    logger.add(fileTransport)
}

export const middLogg=(req, res, next)=>{
    req.logger=logger
    next()
}