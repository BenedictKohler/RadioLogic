module.exports = app => {
    
    const user = require('../controllers/user.controller.js');

    // Get all users
    app.get("/users", user.getAll);

    // Gets user by id
    app.get("/user/:userId", user.getUserById);

    // Add new user
    app.post("/user", user.addUser);

}