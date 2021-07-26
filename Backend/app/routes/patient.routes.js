module.exports = app => {
    
    const patient = require('../controllers/patient.controller.js');

    // Get all patients by a userId
    app.get("/patients/:userId", patient.getAllPatientsByUserId);

    // Add a new patient
    app.post("/patient", patient.addPatient);

    // Delete patient by id
    app.delete("/patient/:patientId", patient.deletePatient);

}