const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const base64Img = require('base64-img');
const port = 8000;
const app = express();
app.use(cors());
app.use(cors());
app.use(express.static('./server/images'));
app.use(bodyParser.json({limit: '10mb'}));
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Tennisgolf@1',
  database : 'radiologic'
});

connection.connect();

// Gets all users from the database
app.get("/users", async (req, res) => {

    try {
        
        connection.query('select * from user', (error, results, fields) => {
            if (error) throw error;
            res.status(200).json(results);
        });

    } catch (err) {
        res.status(500).json({ 'Error': err.message });
    }

});

// Gets a user by their id from the database
app.get("/user/:userId", async (req, res) => {

    try {

        connection.query('select * from user where userId = ?', [req.params.userId], (error, results, fields) => {
            if (error) throw error;
            res.status(200).json(results);
        });

    } catch (err) {
        res.status(500).json({ 'Error': err.message });
    }
    
});

// Gets all patients associated with a particular user from the database
app.get("/patients/:userId", async (req, res) => {

    try {

        connection.query('select patientId, name, description, dateAdded from user natural join patient where user.userId = ?', [req.params.userId], (error, results, fields) => {
            if (error) throw error;
            res.status(200).json(results);
        });

    } catch (err) {
        res.status(500).json({ 'Error': err.message });
    }
    
});

// Gets all images associated with patientId from the database
app.get("/images/:patientId", async (req, res) => {

    try {

        connection.query('select * from image where patientId = ?', [req.params.patientId], (error, results, fields) => {
            if (error) throw error;
            res.status(200).json(results);
        });

    } catch (err) {
        res.status(500).json({ 'Error': err.message });
    }
    
});

// Builds date format compatible with MySql
getCurrentDateTime = () => {
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}

// Adds a new image to the database
app.post("/image", async (req, res) => {

    try {

        const imageData = req.body.imageData;
        
        req.body.dateAdded = getCurrentDateTime();

        let filepath = base64Img.imgSync(imageData, './server/images', Date.now());
        const arr = filepath.split('\\');

        req.body.imageData = 'http://localhost:8000/' + arr[arr.length - 1];

        connection.query('insert into image (patientId, name, description, imageData, dateAdded) values (?, ?, ?, ?, ?)', [req.body.patientId, req.body.name, req.body.description, req.body.imageData, req.body.dateAdded], (error, results, fields) => {
            if (error) throw error;
            res.sendStatus(200);
        });

    } catch (err) {
        res.status(500).json({ 'Error': err.message });
    }

});

// Gets all chats associated with a particular patient from the database
app.get("/chats/:patientId", async (req, res) => {

    try {

        connection.query('select maxDate as dateAdded, fname, lname, text, chatId, userId from (select max(date) as maxDate, text, chatId from message group by chatId) as t1 natural join (select fname, lname, chatId, user.userId from user join chat on user.userId = chat.contactId where chat.patientId = ?) as t2', [req.params.patientId], (error, results, fields) => {
            if (error) throw error;
            res.status(200).json(results);
        });

    } catch (err) {
        res.status(500).json({ 'Error': err.message });
    }
    
});

// Gets all messages associated with a particular chat from the database
app.get("/messages/:chatId", async (req, res) => {

    try {

        connection.query('select * from message where chatId = ? order by date asc', [req.params.chatId], (error, results, fields) => {
            if (error) throw error;
            res.status(200).json(results);
        });

    } catch (err) {
        res.status(500).json({ 'Error': err.message });
    }
    
});

app.listen(port, () => console.log(`Phone Catalog REST API listening on port ${port}!`));