const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const authMiddleware = require('../app/http/middleware/auth');

function initRoutes(app){

    //Home related routes
    app.get('/', homeController().index);

    //Auth related routes
    app.get('/register', authMiddleware, authController().register);
    app.post('/register', authController().registerUser);
    app.get('/login', authMiddleware, authController().login);
    app.post('/login', authController().userLogin);
    app.post('/logout', authController().logout);

    //Cart related routes
    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);

    //Orders related routes
    app.post('/orders', orderController().store);


}

module.exports = initRoutes;