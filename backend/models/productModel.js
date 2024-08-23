const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, default: 0, required: true },
    image: { type: String, required: true }, 
    category: { type: String, required: true },
    brand: { type: String, required: true },
    userId:{type:String,required:true}
    
})
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('productCollections',productSchema)
module.exports = {
    Product,
}

