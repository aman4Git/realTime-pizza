function guest (req, res, next) {

    // Check if user is authenticated
    if(!req.isAuthenticated()){
        return next();
    }

    // If user is authenticated, redirect to home page
    return res.redirect('/');
}

module.exports = guest;