const connection = require('./db.js');
const Helper = require('../helpers/Helper.js');

const Message = (message) => {
    this.patientId = message.patientId;
    this.name = message.name;
    this.description = message.description;
    this.messageData = message.messageData;
    this.text = message.dateAdded;
    this.date = message.dateAdded;
}

Message.addMessage = (message, result) => {
    try {

        message.date = Helper.getCurrentDateTime();

        connection.query('insert into message (chatId, senderId, receiverId, text, date) values (?, ?, ?, ?, ?)', [message.chatId, message.senderId, message.receiverId, message.text, message.date], (error, results, fields) => {
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

Message.getMessageInfo = (chatId, result) => {
    try {
        connection.query('select * from (select imageId, patientId, fname, lname from chat join user on chat.contactId = user.userId where chatId = ?) as t left outer join image using(imageId)', [chatId], (error, results, fields) => {
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

Message.getGeneralInfo = (chatId, result) => {
    try {
        connection.query('select * from (select imageId, patientId, fname, lname from chat join user on chat.userId = user.userId where chatId = ?) as t left outer join image using(imageId)', [chatId], (error, results, fields) => {
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

Message.getMessagesByChatId = (chatId, result) => {
    try {
        connection.query('select * from message where chatId = ? order by date asc', [chatId], (error, results, fields) => {
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