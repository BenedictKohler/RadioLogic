const connection = require('./db.js');
const Helper = require('../helpers/Helper.js');

const Contact = (contact) => {
    this.userId = contact.userId;
    this.contactId = contact.contactId;
}


Contact.getAllByUserId = (userId, result) => {
    try {
        connection.query('select fname, lname, contactId from user join contact on user.userId = contact.contactId where contact.userId = ?', [userId], (error, results, fields) => {
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


Contact.addContact = (contact, result) => {
    try {
        connection.query('insert into contact (userId, contactId) values (?, ?)', [contact.userId, contact.contactId], (error, results, fields) => {
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

