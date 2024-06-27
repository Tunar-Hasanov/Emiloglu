// ironworks.js

const express = require('express');
const ironworks = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Ironworks = require('../db/models/ironworks_model.js');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/ironworks';
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
ironworks.post('/upload/ironworks', upload.single('image'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newImage = new Ironworks({
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
ironworks.get('/ironworks/images', async (req, res) => {
  try {
    const images = await Ironworks.find({});
    const imagesWithPaths = images.map(image => ({
      ...image.toObject(),
      url: `${req.protocol}://${req.get('host')}/uploads/ironworks/${image.filename}`
    }));
    res.status(200).json(imagesWithPaths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete Image
ironworks.delete('/ironworks/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Ironworks.findByIdAndDelete(id);

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
ironworks.put('/ironworks/images/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = await Ironworks.findById(id);

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

module.exports = ironworks;