import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const { Schema, ObjectId } = mongoose;

const productsColl = "products"
const productsSchema = new Schema({
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
    },
    owner: {
        type: ObjectId,
        ref: "users",
        required: true
    }
}, {
    timestamps: true, strict: false
});

productsSchema.plugin(paginate);

export const ProductsModel = mongoose.model(productsColl, productsSchema);