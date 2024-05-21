require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
const passport = require('passport');
const passportInit = require('./app/config/passport');
const Emitter = require('events');

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

//Session store
let mongoStore = new MongoDbStore ({
    mongooseConnection: connection,
    collection:'sessions',
})

//Event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

//Session configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
}));

//Passport configuration
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;

    next();
});

//Set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

//Call Routes.
require('./routes/web')(app);

//Start the server
const server = app.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});

//web socket connection
const io = require('socket.io')(server);
//connect socket
io.on('connection', (socket) => {

    socket.on('join', (orderId) => {

        //join room
        socket.join(orderId);
    });

});

//Pass data to client room
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data);
});

//Pass data to admin room
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
})