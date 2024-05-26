import {config} from "../config/config.js";
import mongoose from "mongoose";

export let CartsDAO;
export let ProductsDAO;
export let UsersDAO;
export let MessagesDAO;

switch (config.db.PERSISTANCE) {
  case "MONGO":
    const connection = await mongoose.connect(`${config.db.MONGO_URL}&dbname=${config.db.DB_NAME}`);
    ProductsDAO = (await import("./mongo/ProductsMongoDAO.js")).ProductsMongoDAO
    CartsDAO = (await import("./mongo/CartsMongoDAO.js")).CartsMongoDAO
    UsersDAO = (await import("./mongo/UsersMongoDAO.js")).UsersMongoDAO
    MessagesDAO = (await import("./mongo/MessagesMongoDAO.js")).MessagesMongoDAO

    break;
  default:
    throw new Error("No se ha definido un tipo de persistencia válido en la configuración");
}