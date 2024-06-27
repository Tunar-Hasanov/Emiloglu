const express = require('express');
const sponsors_router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Sponsors = require('../db/models/sponsors_models'); // Adjust the path as necessary

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/sponsors'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Create a new sponsor
sponsors_router.post('/new/sponsor', upload.single('image'), async (req, res) => {
  try {
    const sponsor = new Sponsors({
      name: req.body.name,
      image: req.file ? req.file.path : '',
    });
    await sponsor.save(); // Corrected save method
    res.status(201).send(sponsor); // Send the saved sponsor object as response
  } catch (error) {
    console.error(error);
    res.status(400).send(error); // Send error as response
  }
});

// Get all sponsors
sponsors_router.get('/fetch/sponsors', async (req, res) => {
  try {
    const sponsors = await Sponsors.find();
    res.status(200).send(sponsors);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Update a sponsor
sponsors_router.put('/sponsor/:id', upload.single('image'), async (req, res) => {
  try {
    const sponsor = await Sponsors.findById(req.params.id);
    if (!sponsor) {
      return res.status(404).send('Sponsor not found');
    }

    sponsor.name = req.body.name || sponsor.name;

    if (req.file) {
      // Delete the old image file if it exists
      if (sponsor.image) {
        fs.unlinkSync(sponsor.image);
      }
      sponsor.image = req.file.path;
    }

    await sponsor.save();
    res.status(200).send(sponsor);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// Delete a sponsor
sponsors_router.delete('/delete/sponsor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsors.findByIdAndDelete(id);

    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }

    // Delete the associated image file
    if (sponsor.image) {
      fs.unlinkSync(sponsor.image);
    }

    res.status(200).json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = sponsors_router;
