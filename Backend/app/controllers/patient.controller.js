const Patient = require('../models/patient.model.js');

// Retrieve all patients by a userId
exports.getAllPatientsByUserId = (req, res) => {

    Patient.getAllPatientsByUserId(req.params.userId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

exports.addPatient = (req, res) => {

    Patient.addPatient(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};


exports.deletePatient = (req, res) => {

    Patient.deletePatient(req.params.patientId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};
