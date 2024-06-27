const mongoose = require('mongoose');

const ironworksSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true }
});

module.exports = mongoose.model('Ironworks', ironworksSchema);