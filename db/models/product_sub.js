const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSubSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
    }
});

module.exports = mongoose.model('Product_sub', ProductSubSchema);
