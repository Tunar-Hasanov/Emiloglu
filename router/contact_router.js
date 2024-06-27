const express = require('express');
const contact = express.Router();
const contactController = require('../controllers/contact_controller.js');

contact.post('/submit', contactController.submitForm);
contact.get('/contacts', contactController.getContacts);
contact.delete('/contacts/:id', contactController.deleteContact);

module.exports = contact;