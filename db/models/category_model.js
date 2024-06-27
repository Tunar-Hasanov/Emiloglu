const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    }]
});

module.exports = mongoose.model('Category', CategorySchema);
