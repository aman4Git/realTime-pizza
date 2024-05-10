function cartController()
{
    return {
        //Function to handle & render Cart page.
        index(req, res){
            res.render('customer/cart');
        }
    }
}

module.exports = cartController;