const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');

const authenticationMiddleware = require('./middleware');
const Users = mongoose.model('users');


function initPassport () {
    // configure passport.js to use the local strategy
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {
            Users.findOne({email: email}).then(function(user){
                if (!user) {
                    console.log('User not found');
                    return done(null, false)
                }

                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) {
                        return done(err)
                    }
                    if (!isValid) {
                        return done(null, false)
                    }
                    return done(null, user)
                })
            }).catch(function (err) {
               return done(err);
            });
        }
    ));

    passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport;