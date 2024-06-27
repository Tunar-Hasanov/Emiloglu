const express = require('express');
const productSubRouter = express.Router();
const ProductSub = require('../db/models/product_sub');
const multer = require('multer');
const Category = require('../db/models/category_model');
const SubCategory = require('../db/models/sub_category_model');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/sub-product'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only certain file types (e.g., images)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File type not supported'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Create a new product
productSubRouter.post('/sub/product/post', upload.single('image'), async (req, res) => {
    try {
        const { name, price, categoryId, subCategoryId } = req.body;

        // Validate category or sub-category
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(400).send('Invalid category ID');
            }
        } else if (subCategoryId) {
            const subCategory = await SubCategory.findById(subCategoryId);
            if (!subCategory) {
                return res.status(400).send('Invalid sub-category ID');
            }
        }

        // Check if image is uploaded
        const image = req.file ? req.file.path : '';

        const newProduct = new ProductSub({
            name,
            price,
            image,
            category: categoryId || null,
            subCategory: subCategoryId || null,
        });

        await newProduct.save();

        res.redirect('/add/article'); // Redirect after successful save
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

// Update a product
productSubRouter.put('/sub/product/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, categoryId, subCategoryId } = req.body;

        // Check if product exists
        const product = await ProductSub.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Validate category or sub-category
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(400).send('Invalid category ID');
            }
            product.category = categoryId;
            product.subCategory = null;
        } else if (subCategoryId) {
            const subCategory = await SubCategory.findById(subCategoryId);
            if (!subCategory) {
                return res.status(400).send('Invalid sub-category ID');
            }
            product.subCategory = subCategoryId;
            product.category = null;
        }

        // Update fields
        if (name) product.name = name;
        if (price) product.price = price;
        if (req.file) product.image = req.file.path; // Update image path

        await product.save();

        res.send(product); // Send updated product as response
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

// Delete a product
productSubRouter.delete('/sub/product/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if product exists
        const product = await ProductSub.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        await ProductSub.deleteOne({ _id: id });

        res.send({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

// Get products by category or sub-category
productSubRouter.get('/sub/products', async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.query;
        let products;

        if (categoryId) {
            products = await ProductSub.find({ category: categoryId });
        } else if (subCategoryId) {
            products = await ProductSub.find({ subCategory: subCategoryId });
        } else {
            products = await ProductSub.find();
        }

        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

module.exports = productSubRouter;
