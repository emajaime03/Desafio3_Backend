import mongoose from 'mongoose'
const { Schema, ObjectId } = mongoose;

const usuariosColl = "usuarios"
const usuariosSchema = new Schema(
    {
        rol: String,
        nombre: String,
        apellido: String,
        age: Number,
        email: {
            type: String, unique: true
        },
        password: String,
        cart: {
            type: ObjectId,
            required: true,
            ref: "carts"
        },
    },
    {
        timestamps: true, strict: false
    }
)

export const usuariosModelo = mongoose.model(usuariosColl, usuariosSchema);