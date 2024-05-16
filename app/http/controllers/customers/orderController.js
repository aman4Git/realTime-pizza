const Order = require('../../../models/order');

function orderController()
{
    return {

        //Function to handle orders.
        store(req, res){
          //validate request
           const {phone, address} = req.body;

           if(!phone || !address){

            //flash message
            req.flash('error', 'All fields are required');
            res.redirect('/cart'); 
           }

           //Store order data
           const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
           });
          
           //save order
           order.save().then(result =>{

            req.flash('success', 'Order placed successfully!')
            return res.redirect('/');

           }).catch(err =>{

            req.flash('error', 'Something went wrong');
            return res.redirect('/cart');
           });
        }
    }
}

module.exports = orderController;