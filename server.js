const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');

//Assets
app.use(express.static('public'))

//Set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

//Routes for home page
app.get('/', (req, res) => {
    res.render('home');
})

//Routes for cart page
app.get('/cart', (req, res) => {
    res.render('customer/cart');
})

//Auth routes
app.get('/login', (req, res) => {
    res.render('auth/login');
})

app.get('/register', (req, res) => {
    res.render('auth/register');
})

//Start the server
app.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});
