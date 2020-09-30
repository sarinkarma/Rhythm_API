// Import dependencies
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 8080

require('./database/db')

// Initialize the app
const app = express();

app.use(cors());
app.use('/public', express.static(__dirname+"/public"))

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Import routes
let apiRoutes = require("./routers/routes")
let adminApiRoutes = require("./routers/admin_routes")

// Use Api routes in the App
app.use('/api', apiRoutes)
app.use('/api/admin', adminApiRoutes)

// Launch app to listen to specified port
var server = app.listen(port, function () {
     console.log("Running App on port " + port);
});

module.exports = server;