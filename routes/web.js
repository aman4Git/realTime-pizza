const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');

//Middlewares
const guestMiddleware = require('../app/http/middleware/guest');
const authMiddleware = require('../app/http/middleware/auth');
const adminMiddleware = require('../app/http/middleware/admin');

function initRoutes(app){

    //Home related routes
    app.get('/', homeController().index);

    //Auth related routes
    app.get('/register', guestMiddleware, authController().register);
    app.post('/register', authController().registerUser);
    app.get('/login', guestMiddleware, authController().login);
    app.post('/login', authController().userLogin);
    app.post('/logout', authController().logout);

    //Cart related routes
    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);
    
    //Customer related routes
    app.post('/orders', authMiddleware, orderController().store);
    app.get('/customer/orders', authMiddleware, orderController().index);

    //Admin related routes
    app.get('/admin/orders', adminMiddleware, adminOrderController().index);


}

module.exports = initRoutes;