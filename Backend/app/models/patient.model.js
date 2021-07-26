const connection = require('./db.js');
const Helper = require('../helpers/Helper.js');

const Patient = (patient) => {
    this.userId = patient.userId;
    this.name = patient.name;
    this.description = patient.description;
    this.dateAdded = patient.dateAdded;
}

Patient.getAllPatientsByUserId = (userId, result) => {
    try {
        connection.query('select patientId, name, description, dateAdded from user natural join patient where user.userId = ?', [userId], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });

    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }
}

Patient.addPatient = (patient, result) => {
    try {

        patient.dateAdded = Helper.getCurrentDateTime();

        connection.query('insert into patient (userId, name, description, dateAdded) values (?, ?, ?, ?)', [patient.userId, patient.name, patient.description, patient.dateAdded], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });

    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }
}

Patient.deletePatient = (patientId, result) => {
    try {
        connection.query('delete from patient where patientId = ?', [patientId], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });

    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }
}