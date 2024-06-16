import {config} from "../../config/config.js";
import mongoose from "mongoose";

export let CartsRepository;
export let ProductsRepository;
export let UsersRepository;
export let MessagesRepository;
export let TicketsRepository;

switch (config.db.PERSISTANCE) {
  case "MONGO":
    await mongoose.connect(`${config.db.MONGO_URL}&dbname=${config.db.DB_NAME}`);
    ProductsRepository = (await import("./mongo/ProductsRepository.js")).ProductsRepository
    CartsRepository = (await import("./mongo/CartsRepository.js")).CartsRepository
    UsersRepository = (await import("./mongo/UsersRepository.js")).UsersRepository
    MessagesRepository = (await import("./mongo/MessagesRepository.js")).MessagesRepository
    TicketsRepository = (await import("./mongo/TicketsRepository.js")).TicketsRepository

    break;
  default:
    throw new Error("No se ha definido un tipo de persistencia válido en la configuración");
}