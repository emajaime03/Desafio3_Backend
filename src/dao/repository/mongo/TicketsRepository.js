import { TicketsModel } from "../../models/tickets.model.js";

export class TicketsRepository{

    constructor(){}
    
    async create(ticket){
        return await TicketsModel.create(ticket)
    }
}