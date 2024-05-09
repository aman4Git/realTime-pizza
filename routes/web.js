function initRoutes(app){

    //Routes for home page
    app.get('/', (req, res) => {
        res.render('home');
    })

    //Routes for cart page
    app.get('/cart', (req, res) => {
        res.render('customer/cart');
    })

    //Auth routes for login
    app.get('/login', (req, res) => {
        res.render('auth/login');
    })

    //Auth routes for register
    app.get('/register', (req, res) => {
        res.render('auth/register');
    })

}

module.exports = initRoutes;