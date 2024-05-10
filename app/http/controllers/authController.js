function authController()
{
    return {
        //Function to handle & render Login page.
        login(req, res){
            res.render('auth/login')
        },

        //Function to handle & render Register page.
        register(req, res){
            res.render('auth/register')
        }
    }
}

module.exports = authController;