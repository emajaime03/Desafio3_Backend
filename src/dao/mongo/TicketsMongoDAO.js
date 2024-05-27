import { TicketsModel } from "../models/tickets.model.js";

export class TicketsMongoDAO{

    constructor(){}
    
    async create(ticket){
        return await TicketsModel.create(ticket)
    }
}