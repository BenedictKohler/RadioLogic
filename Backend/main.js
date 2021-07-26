const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const base64Img = require('base64-img');

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.static('./server/images'));
app.use(bodyParser.json({ limit: '10mb' }));

// Set up routes
require('./app/routes/user.routes.js')(app);
require('./app/routes/contact.routes.js')(app);
require('./app/routes/patient.routes.js')(app);
require('./app/routes/image.routes.js')(app);
require('./app/routes/chat.routes.js')(app);
require('./app/routes/message.routes.js')(app);

// Listen for requests
app.listen(PORT, () => console.log(`RadioLogic REST API listening on port ${PORT}!`));