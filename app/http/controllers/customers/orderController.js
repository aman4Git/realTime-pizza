const Order = require('../../../models/order');
const moment = require('moment');

function orderController()
{
    return {

        //Function to handle orders.
        async store(req, res) {
            // Validate request
            const { phone, address } = req.body;
        
            if (!phone || !address) {
                // Flash message
                req.flash('error', 'All fields are required');
                return res.redirect('/cart');
            }
        
            try {
                // Store order data
                const order = new Order({
                    customerId: req.user._id,
                    items: req.session.cart.items,
                    phone,
                    address
                });
        
                // Save order
                const result = await order.save();
        
                // Get order data
                const placedOrder = await Order.populate(result, { path: 'customerId' });
        
                // Flash message
                req.flash('success', 'Order placed successfully!');
        
                // Delete cart data after order is placed
                delete req.session.cart;
        
                // Event emitter for socket.io events
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('orderPlaced', placedOrder);
        
                // Redirect to orders page
                return res.redirect('/customer/orders');
            } catch (err) {
                req.flash('error', 'Something went wrong');
                return res.redirect('/cart');
            }
        },
        
        async index(req, res){

            //find orders by customer id
            const orders = await Order.find({customerId: req.user._id}, null, { sort: {'createdAt' : -1 }} );

            //Return orders
            return res.render('customer/orders', { orders: orders, moment: moment});
        },

        async show(req, res){

            //find order by id
            const order = await Order.findById(req.params.id);

            //If Authorized user
            if(req.user._id.toString() === order.customerId.toString())
            {    
                return res.render('customer/singleOrder', { order: order});
            }

            //Else return to home page
            return res.redirect('/');

        },
    }
}

module.exports = orderController;