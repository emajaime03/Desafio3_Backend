import mongoose from 'mongoose';

const messagesColl = "messages"
const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String
    }
},{
    timestamps: true, strict:false
});

export const MessagesModel = mongoose.model(messagesColl, messagesSchema);