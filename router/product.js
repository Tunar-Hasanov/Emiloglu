const express = require('express');
const productRouter = express.Router();
const Product = require('../db/models/product');
const multer = require('multer');
const Category = require('../db/models/category_model');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/products'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });
productRouter.post('/product/post', upload.single('image'), async (req, res) => {
    try {
        const { name, price, categoryId } = req.body;

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).send('Not a correct category ID');
        }

        // Check if image is uploaded
        const image = req.file ? req.file.path : '';

        const newProduct = new Product({
            name,
            price,
            image,
            category: categoryId,
        });

        await newProduct.save();

        res.redirect('/add/article'); // Redirect to a different page after saving the product
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});
// Update a product
productRouter.put('/product/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, categoryId } = req.body;

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Check if category exists, if categoryId is provided
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(400).send('Not a correct category ID');
            }
            product.category = categoryId;
        }

        // Check if image is uploaded and update if necessary
        if (req.file) {
            product.image = req.file.path;
        }

        // Update other fields if provided
        if (name) {
            product.name = name;
        }
        if (price) {
            product.price = price;
        }

        await product.save();

        res.send(product);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

// Delete a product
productRouter.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        await Product.deleteOne({ _id: id });

        res.send({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});


productRouter.get('/fetch/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

productRouter.get('/subcategories/:subcategoryId', async (req, res) => {
    try {
      const products = await Product.find({ subcategoryId: req.params.subcategoryId });
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  productRouter.get('/categories/:categoryId', async (req, res) => {
    try {
      const products = await Product.find({ categoryId: req.params.categoryId });
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = productRouter;
