const connection = require('./db.js');
const Helper = require('../helpers/Helper.js');

const Chat = (chat) => {
    this.userId = chat.userId;
    this.contactId = chat.contactId;
    this.imageId = chat.imageId;
    this.patientId = chat.patientId;
}

Chat.addChat = (chat, result) => {
    try {

        connection.query('insert into chat (userId, contactId, patientId) values (?, ?, ?)', [chat.userId, chat.contactId, chat.patientId], (error, results, fields) => {
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

Chat.updateChat = (chat, result) => {
    try {
        connection.query('update chat set imageId = ? where chatId = ?', [chat.imageId, chat.chatId], (error, results, fields) => {
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

Chat.getChatByPatientId = (patientId, result) => {
    try {
        connection.query('select maxDate as dateAdded, fname, lname, text, chatId, userId from (select max(date) as maxDate, text, chatId from message group by chatId) as t1 natural join (select fname, lname, chatId, user.userId from user join chat on user.userId = chat.contactId where chat.patientId = ?) as t2 order by dateAdded desc', [patientId], (error, results, fields) => {
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

Chat.getGeneralChats = (userId, result) => {
    try {
        connection.query('select chatId, dateAdded, text, fname, lname from (select max(date) as dateAdded, text, chatId from message group by chatId) as t1 natural join (select * from chat natural join user where chat.contactId = ?) as t2 order by dateAdded desc', [userId], (error, results, fields) => {
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

Chat.getChatById = (chatId, result) => {
    try {
        connection.query('select * from chat where chatId = ?', [chatId], (error, results, fields) => {
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
