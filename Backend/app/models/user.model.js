const connection = require('./db.js');
const Helper = require('../helpers/Helper.js');

const User = (user) => {
    this.userId = user.userId;
    this.password = user.password;
    this.fname = user.fname;
    this.lname = user.lname;
}

User.getAll = result => {
    try {
        connection.query('select * from user', (error, results, fields) => {
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

User.getUserById = (userId, result) => {
    try {
        connection.query('select * from user where userId = ?', [userId], (error, results, fields) => {
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


User.addUser = (user, result) => {
    try {
        connection.query('insert into user (userId, password, fname, lname) values (?, ?, ?, ?)', [user.userId, user.password, user.fname, user.lname], (error, results, fields) => {
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