function adminMiddleware (req, res, next) {

    // Check if user is authenticated and role is admin
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next();
    }

    // If user is not admin, redirect to home page
    return res.redirect('/');
}

module.exports = adminMiddleware;