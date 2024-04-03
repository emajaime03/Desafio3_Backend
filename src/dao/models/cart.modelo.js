import mongoose from 'mongoose';
const { Schema, ObjectId } = mongoose;

const cartsColl = "carts"
const cartsSchema = new Schema({
    products: {
        type: [
            {
                product: {
                    type: ObjectId,
                    required: true,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }]
    }
},{
    timestamps: true, strict:false
});

export const CartModel = mongoose.model(cartsColl, cartsSchema);