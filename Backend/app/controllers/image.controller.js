const Image = require('../models/image.model.js');

// Retrieve all images by patientId
exports.getAllImagesByPatientId = (req, res) => {

    Image.getAllImagesByPatientId(req.params.patientId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};


// Add a new image to the database
exports.addImage = (req, res) => {

    Image.getAllImagesByPatientId(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};


// Add a image with existing address
exports.addImageByAddress = (req, res) => {

    Image.addImageByAddress(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

// Delete an image by id
exports.deleteImage = (req, res) => {

    Image.deleteImage(req.params.imageId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

// Add a image with existing address
exports.updateImage = (req, res) => {

    Image.updateImage(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

exports.getImageById = (req, res) => {

    Image.getImageById(req.params.imageId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};