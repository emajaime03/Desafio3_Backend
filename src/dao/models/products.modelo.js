import mongoose from 'mongoose';

const productsColl = "products"
const productsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: String,
    description: String,
    price: Number,
    thumbnail: Array,
    stock: Number,
    code: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true, strict:false
});

export const ProductsModel = mongoose.model(productsColl, productsSchema);