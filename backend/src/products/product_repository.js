import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema, 'products');

export async function getProductsRepo() {
    return await Product.find();
};

export async function getProductByIdRepo(id) {
    return await Product.findById(id);
};

export async function createProductRepo(data) {
    return await Product.create(data);
};

export async function updatedProductRepo(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export async function deleteProductRepo(id) {
    return await Product.findByIdAndDelete(id);
}; 