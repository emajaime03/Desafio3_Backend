import mongoose from 'mongoose';

const cartsColl = "carts"
const cartsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    products: [{
        productId: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
},{
    timestamps: true, strict:false
});

export const CartModel = mongoose.model(cartsColl, cartsSchema);