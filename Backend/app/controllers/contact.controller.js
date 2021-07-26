const Contact = require('../models/contact.model.js');

// Retrieve a all contacts by a userId
exports.getAllByUserId = (req, res) => {

    Contact.getAllByUserId(req.params.userId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

// Add a new contact
exports.addContact = (req, res) => {

    Contact.addContact(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};
