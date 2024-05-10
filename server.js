const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
require("dotenv").config();

//Database configuration
const url = process.env.DATABASE_CONNECTION_STRING;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "pizzaStream",
});

const connection = mongoose.connection;

connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

//Assets
app.use(express.static('public'))

//Set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

//Call Routes.
require('./routes/web')(app);

//Start the server
app.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});
