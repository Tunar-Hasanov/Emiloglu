// furnitures.js

const express = require('express');
const furnitures = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Furnitures = require('../db/models/furnitures_model.js');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/furnitures';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Function to handle file deletion
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(err);
  });
};

// Upload Image
furnitures.post('/upload/furnitures', upload.single('image'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newImage = new Furnitures({
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    await newImage.save();

    res.status(201).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get Images
furnitures.get('/furnitures/images', async (req, res) => {
  try {
    const images = await Furnitures.find({});
    const imagesWithPaths = images.map(image => ({
      ...image.toObject(),
      url: `${req.protocol}://${req.get('host')}/uploads/furnitures/${image.filename}`
    }));
    res.status(200).json(imagesWithPaths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete Image
furnitures.delete('/furnitures/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Furnitures.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    deleteFile(image.path);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update Image
furnitures.put('/furnitures/images/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = await Furnitures.findById(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    deleteFile(image.path);

    image.filename = file.filename;
    image.path = file.path;
    image.originalname = file.originalname;
    image.mimetype = file.mimetype;
    image.size = file.size;

    await image.save();

    res.status(200).json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = furnitures;