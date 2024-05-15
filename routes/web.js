const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middleware/guest');

function initRoutes(app){
    app.get('/', homeController().index);
    app.get('/register', guest, authController().register);
    app.post('/register', authController().registerUser);
    app.get('/login', guest, authController().login);
    app.post('/login', authController().userLogin);

    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);

}

module.exports = initRoutes;