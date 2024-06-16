import dotenv from "dotenv"

dotenv.config({
    override: true, path: "./src/.env"
})

export const config={
    general:{
        PORT: process.env.PORT||3000,
        SECRET: process.env.SECRET,
        MODE: process.env.MODE,
        EMAIL: process.env.EMAIL,
        EMAIL_PASS: process.env.EMAIL_PASS
    },
    db:{
        PERSISTANCE: process.env.PERSISTANCE,
        MONGO_URL: process.env.MONGO_URL, 
        DB_NAME: process.env.DB_NAME
    }
}