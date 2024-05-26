import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productsColl = "products"
const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: Array,
    stock: Number,
    category: String,
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

productsSchema.plugin(paginate);

export const ProductsModel = mongoose.model(productsColl, productsSchema);