const Contact = require('../db/models/contact_model.js');

exports.submitForm = async (req, res, next) => {
    try {
        const { name, number, message } = req.body;

        if (!name || !number || !message) {
            return res.status(400).json({ message: 'Name, number, and message are required fields' });
        }

        const newContact = new Contact({
            name,
            number,
            message
        });

        await newContact.save();

        res.status(201).json({ message: 'Contact saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Contact ID is required' });
        }

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};