const User = require('../../models/user');
const bcrypt = require('bcrypt')
const passport = require('passport');

function authController()
{

    //Redirect to the relevant user page
    const _getRedirectUrl = (req) =>{
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders';
    }

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
        
        //Login a user
        userLogin(req, res, next){
            
            //req body data
            const {email, password } = req.body;

             //validate required
            if( !email || !password ){
 
                //flash message
                req.flash('error', 'All fields are required');

                //redirect to register page
                return res.redirect('/login');
            }

            passport.authenticate('local', (err, user, info) =>{

                //If error
                if(err){
                    
                    //flash message
                    req.flash('error', info.message );

                    return next(err);
                }

                //check if user exists
                if(!user){

                    //flash message
                    req.flash('error', info.message );

                    return res.redirect('/login');
                }

                //login user
                req.logIn(user, (err) =>{
                    if(err){

                        //flash message
                        req.flash('error', info.message );
                        return next(err);
                    }

                    return res.redirect(_getRedirectUrl(req));
                });

            })(req, res, next);

        },

        logout(req, res) {
            req.logout((err) => {
                if (err) {
                    return next(err); 
                }
                res.redirect('/login');
            });
        }
        
    }
}

module.exports = authController;