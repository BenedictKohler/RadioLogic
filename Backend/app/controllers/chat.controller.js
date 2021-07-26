const Chat = require('../models/chat.model.js');

// Add a new contact
exports.addChat = (req, res) => {

    Chat.addChat(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

// Add a new contact
exports.updateChat = (req, res) => {

    Chat.updateChat(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

// Gets chat by patient id
exports.getChatByPatientId = (req, res) => {

    Chat.getChatByPatientId(req.params.patientId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

exports.getGeneralChats = (req, res) => {

    Chat.getGeneralChats(req.params.userId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

exports.getChatByChatId = (req, res) => {

    Chat.getChatByChatId(req.params.chatId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};