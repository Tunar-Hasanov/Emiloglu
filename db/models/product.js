// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    image: {
        type: String,
        required: true
      },
    price: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;