function homeController()
{
    return {
        //Function to handle & render Home page.
        index(req, res){
            res.render('home')
        }
    }
}

module.exports = homeController;