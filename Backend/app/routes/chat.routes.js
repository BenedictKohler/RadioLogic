module.exports = app => {
    
    const chat = require('../controllers/chat.controller.js');

    // Add a new Chat
    app.post("/chat", chat.addChat);

    // Update a chat
    app.post("/chatImage", chat.updateChat);

    app.get("/chats/:patientId", chat.getChatByPatientId);

    app.get("/generalchats/:userId", chat.getGeneralChats);

    app.get("/chat/:chatId", chat.getChatById);

}