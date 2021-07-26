const Message = require('../models/image.model.js');

// Add message to database
exports.addMessage = (req, res) => {

    Message.addMessage(req.body, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

exports.getMessageInfo = (req, res) => {

    Message.getMessageInfo(req.params.chatId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

exports.getGeneralInfo = (req, res) => {

    Message.getGeneralInfo(req.params.chatId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};

exports.getMessagesByChatId = (req, res) => {

    Message.getMessagesByChatId(req.params.chatId, (err, data) => {
        if (err) 
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.status(200).json(data);
    });

};