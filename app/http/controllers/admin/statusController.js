const Order = require('../../../models/order');

function statusController() {
    return {
        async update(req, res) {
            try {
                await Order.updateOne({_id: req.body.orderId}, {status: req.body.status});

                // If no errors
                return res.redirect('/admin/orders');
            } catch (err) {
                
                // If any errors
                return res.redirect('/admin/orders');
            }
        }
    }
}


module.exports = statusController;
