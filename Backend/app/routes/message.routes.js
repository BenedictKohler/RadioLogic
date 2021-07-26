module.exports = app => {
    
    const message = require('../controllers/message.controller.js');

    // Add a new message
    app.post("/message", message.addMessage);

    app.get("/messageinfo/:chatId", message.getMessageInfo);

    app.get("/generalmessageinfo/:chatId", message.getGeneralInfo);

    app.get("/messages/:chatId", getMessagesByChatId);

}