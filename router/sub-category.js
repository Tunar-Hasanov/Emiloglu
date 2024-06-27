const express = require('express');
const subCategoryRouter = express.Router();
const SubCategory = require('../db/models/sub_category_model');
const Category = require('../db/models/category_model');

// Create a new sub-category
subCategoryRouter.post('/sub-category', async (req, res) => {
    try {
        const { name, categoryId } = req.body;

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).send('Invalid category ID');
        }

        const newSubCategory = new SubCategory({
            name,
            category: categoryId,
        });

        await newSubCategory.save();

        // Add sub-category to the category's subCategories array
        category.subCategories.push(newSubCategory._id);
        await category.save();

        res.status(201).send(newSubCategory);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

// Get all sub-categories
subCategoryRouter.get('/sub-categories', async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.send(subCategories);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

module.exports = subCategoryRouter;
