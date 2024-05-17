const Order = require('../../../models/order');

function orderController() {
    return {
        async index(req, res) {
            try {
                // Get all orders, excluding completed ones, sorted by creation date
                const orders = await Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } })
                                          .populate('customerId', '-password')
                                          .exec();

                // If request comes from AJAX request
                if (req.xhr) {
                    return res.json(orders);
                } else {
                    // Render the orders page
                    return res.render('admin/orders'); // { orders: orders, moment: moment}
                }
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
        }
    }
}

module.exports = orderController;
