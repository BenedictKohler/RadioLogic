const User = require('../models/user.model.js');

// Retrieve all users from the database
exports.getAll = (req, res) => {

    User.getAll((err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

// Retrieve a user by their userId
exports.getUserById = (req, res) => {

    User.getUserById(req.params.userId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

// Add a new user
exports.addUser = (req, res) => {

    User.addUser(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while posting a user."
            });
        else res.status(200).json(data);
    });

};


