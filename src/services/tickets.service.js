import { TicketsRepository } from "../dao/repository/factory.js";

class TicketsService{

    constructor(repository){
        this.TicketsRepository= new repository()
    }
    
    async createTicket(ticket){
        return await this.TicketsRepository.create(ticket)
    }
}

export const ticketsService=new TicketsService(TicketsRepository)