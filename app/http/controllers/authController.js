const User = require('../../models/user');
const bcrypt = require('bcrypt')

function authController()
{
    return {

        //Function to handle & render Register page.
        register(req, res){
            res.render('auth/register')
        },

        //Add a new user
        async registerUser(req, res){

            //req body data
            const { name, email, password } = req.body;

            //validate required
            if(!name || !email || !password){

                //flash message
                req.flash('error', 'All fields are required');
                req.flash('name', name);
                req.flash('email', email);

                //redirect to register page
                return res.redirect('/register');
            }

            //Check if email is already registered
            const emailExists = await User.exists({ email: email });

                if(emailExists){

                    //flash message
                    req.flash('error', 'Email is already registered');
                    req.flash('name', name);
                    req.flash('email', email);

                    //redirect to register page
                    return res.redirect('/register');
                }

            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            //Create a new user
            const user = new User({
                name,
                email,
                password: hashedPassword
            });

            //Save user to database
            user.save().then((user) =>{

                //redirect to home page
                return res.redirect('/');
                
            }).catch(err =>{

                //flash message
                req.flash('error', 'Something went wrong');

                //redirect to register page
                return res.redirect('/register');
                
            });

        },

        //Function to handle & render Login page.
        login(req, res){
            res.render('auth/login')
        },

    }
}

module.exports = authController;