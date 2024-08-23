const {Product} = require('../models/productModel')

async function searchProduct(productInput){
    try {
        const products = await Product.find({
            $text: { $search: productInput }
        }).select('_id name brand'); // Select fields to return

        return products;
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    searchProduct,
}