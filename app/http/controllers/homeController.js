const Menu = require('../../models/menu');
function homeController()
{
    return {

        //Function to handle & render Home page.
        async index(req, res){

            //Get menu items
            const pizzas = await Menu.find();
            return res.render('home', {pizzas:pizzas});
        }
    }
}

module.exports = homeController;