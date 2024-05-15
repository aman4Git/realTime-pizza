const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt')

function init(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {

        //Check if the user already exists
        const user = await User.findOne({email: email});

        //If the user does not exist
        if(!user){
            return done(null, false, { message: 'User does not exist' });
        }

        //Bcrypt the password
        bcrypt.compare( password, user.password ).then(match => {

            //If the password matches
            if(match){
                return done(null, user, { message: 'Logged in successfully!' });
            }

            //If the password does not match
            return done(null, false, { message: 'Invalid credentials' });
        }).catch(err => {

            //If there is an error
            return done(null, false, { message: 'Something went wrong' });
        });

    }));

    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}

module.exports = init;