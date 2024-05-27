import { TicketsDAO } from "../dao/factory.js";

class TicketsService{

    constructor(dao){
        this.TicketsDAO= new dao()
    }
    
    async createTicket(ticket){
        return await this.TicketsDAO.create(ticket)
    }
}

export const ticketsService=new TicketsService(TicketsDAO)