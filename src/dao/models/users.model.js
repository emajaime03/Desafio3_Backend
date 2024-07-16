import mongoose from 'mongoose'
const { Schema, ObjectId } = mongoose;

const usersColl = "users"
const usersSchema = new Schema(
    {
        role: String,
        age: Number,
        first_name: String,
        last_name: String,
        email: {
            type: String, unique: true
        },
        password: String,
        cart: {
            type: ObjectId,
            required: true,
            ref: "carts"
        },
        documents:[{
            name: String,
            reference: String
        }],
        last_connection: Date,
    },
    {
        timestamps: true, strict: false
    }
)

export const UsersModel = mongoose.model(usersColl, usersSchema);