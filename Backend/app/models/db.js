// Open a connection with the MySQL Database

const mysql = require('mysql');
const dbConfig = require('../config/db.config.js');

const connection = mysql.createConnection(dbConfig);

connection.connect();

module.exports = connection;