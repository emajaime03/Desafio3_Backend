import mongoose from 'mongoose'

export const usuariosModelo = mongoose.model(
    'usuarios', 
    new mongoose.Schema(
        {
            rol: String,
            nombre: String,
            apellido: String,
            email: {
                type: String, unique: true
            },
            age: Number,
            password: String
        },
        {
            timestamps: true, strict:false
        }
    )
)