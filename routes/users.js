const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt');

var Warehouse = mongoose.model('warehouses');
var Users = mongoose.model('users');
const Bookings = mongoose.model('bookings');

const router = express.Router();

/* GET a list of all users. */
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        req.user.user_type === "operator" ? res.redirect(req.baseUrl + '/dashboard') : res.redirect(req.baseUrl + '/home');
    }
    res.render('login');
});

/*POST a user to the database*/
router.post('/', function (req, res, next) {
    const _userForm = req.body;

    //Generate the has
    const saltRounds = 10;
    const _password = _userForm.password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const _passwordHash = bcrypt.hashSync(_password, salt);

    //create a user object
    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username || "", //FIXME no form input for it now
        email: req.body.email,
        password: _passwordHash,
        user_type: req.body.type,
        phone: req.body.phone || ""
    };

    const _user = Users.create(user);

    _user.then(function (user) {
        //send mail confirmation
        res.redirect(req.baseUrl + '/login')
    }).catch(function (err) {
        console.error(err);
        res.redirect(req.baseUrl + '/register');
    });
});

//Login functionality
router.post('/login', function (req, res, next) {
    passport.authenticate('local', (err, user) => {
        if (err) {
            console.error(err);
        }

        req.login(user, (er) => {
            //FIXME DO NOT
            console.log("User: " + req.user);
            if (user.user_type === "operator") {
                res.redirect(req.baseUrl + '/dashboard');
            }
            else { //TODO make the depositor route and redirect them appropriately
                res.redirect(req.baseUrl + '/home')
            }
        });
    })(req, res, next);
});

router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        req.user.user_type === "operator" ? res.redirect(req.baseUrl + '/dashboard') : res.redirect(req.baseUrl + '/home');
    }else{
        res.redirect('/users/login');
    }

});

//Register functionality
router.get('/register', function (req, res) {
    res.render('register', {user: req.user});
});

//Operator Home (Dashboard)
router.get('/dashboard', function (req, res) {
    if (req.isAuthenticated()) {
        const user = req.user;
        //Can be reached by operator and the depositor
        if (user.user_type === "operator") {
            Warehouse.find({operator: user}).then(function (list) {
                res.render('operator-dashboard', {warehouses: list, user: user, pending: getPending()})
            }).catch(function (err) {
                res.send("Error");
                //console.log(err);
            });
        } else {
            //Depositor
            res.redirect(req.baseUrl + '/home');
        }

    }
    else {
        //Not authenticated, just login
        res.redirect(req.baseUrl + '/login')
    }
});

function getPending() {
    Bookings.find()
        .then(function (bookings) {
            const pending = bookings.filter(function (booking) {
                return booking.status === "pending";
            });
            return pending.length;
        }).catch(function (err) {
        throw err;
    });

}

//Depositor Dashboard
router.get('/dashboard/messages', function (req, res) {
    if (req.isAuthenticated()) {
        const user = req.user;
        if (user.user_type === "operator") {
            //Get all bookings belonging to this guy
            Bookings.find({operator: user})
                .populate('depositor')
                .populate('warehouse')
                .then(function (bookings) {
                    res.render('operator-dashboard-messages', {
                        user: user,
                        bookings: bookings,
                        pending: getPending()
                    });
                }).catch(function (err) {
                throw err;
            });
        } else {
            Bookings.find({depositor: user})
                .populate('warehouse')
                .then(function (bookings) {
                    res.render('depositor-dashboard-messages', {
                        bookings: bookings,
                        user: user,
                        notifications: bookings.length
                    });
                }).catch(function (err) {
                throw err;
            })
        }
    } else {
        res.redirect(req.baseUrl + '/login')
    }


});

//Depositor Dashboard
router.get('/home', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.user_type === "operator") {
            res.redirect(req.baseUrl + '/dashboard')
        } else {
            const user = req.user;
            Bookings.find({depositor: user})
                .then(function (bookings) {
                    res.render('home', {user: user, notifications: bookings.length});
                })
                .catch(function (err) {
                    throw err;
                })

        }
    }else{
        res.redirect('/users/login');
    }

});


module.exports = router;
