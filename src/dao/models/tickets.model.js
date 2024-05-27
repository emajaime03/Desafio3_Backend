import mongoose from 'mongoose'
const { Schema, ObjectId } = mongoose;

const ticketsColl = "tickets"
const ticketsSchema = new Schema(
    {
        code: {type: Number, unique: true},
        amount: Number,
        purchaser: String
    },
    {
        timestamps: true, strict: false
    }
)

export const TicketsModel = mongoose.model(ticketsColl, ticketsSchema);