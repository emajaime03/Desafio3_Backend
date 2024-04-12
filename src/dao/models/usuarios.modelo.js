import mongoose from 'mongoose'

export const usuariosModelo=mongoose.model('usuarios',new mongoose.Schema({
    rol: String,
    first_name: String,
    last_name: String,
    email:{
        type: String, unique:true
    },    
    age: Number,
    password: String
}))