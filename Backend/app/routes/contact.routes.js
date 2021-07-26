module.exports = app => {
    
    const contact = require('../controllers/contact.controller.js');

    // Get all contacts by userId
    app.get("/contacts/:userId", contact.getAllByUserId);

    // Add a new Contact
    app.post("/contact", contact.addContact);

}