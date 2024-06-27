const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Category = require('../db/models/category_model.js');
const Subcategory = require('../db/models/sub_category_model.js')
// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/category');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Create a new category
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      image: req.file ? req.file.path : '',
      link: req.body.link
    });
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all categories
router.get('/fetch/category', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a category
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    category.name = req.body.name || category.name;
    category.link = req.body.link || category.link;

    if (req.file) {
      // Delete the old image file if it exists
      if (category.image) {
        fs.unlinkSync(category.image);
      }
      category.image = req.file.path;
    }

    await category.save();
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
 try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    deleteFile(category.path);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/fetch/categories', async (req, res) => {
  try {
      const Categories = await Category.find();
      res.send(Categories);
  } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
  }
});

router.get('/categories/:categoryId/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ parentId: req.params.categoryId });
    res.status(200).send(subcategories);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;

