var express = require('express');
var router = express.Router();
const passport = require('passport');

// Import your User model (replace 'User' with the actual model name)
const { User } = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express', user: req.user });
});

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Express', user: req.user, message: req.flash('error') });
});

router.get('/signup', function (req, res, next) {
    res.render('signup', { title: 'Express', user: req.user });
});

// Handle signup form submission
router.post('/signup', async function (req, res, next) {
    const { username, firstname, lastname, password } = req.body;

    try {
        // Create a new user in the Users table
        const newUser = await User.create({
            fullName: `${firstname} ${lastname}`,
            username,
            password, // Note: You should hash the password before storing it in a real application
            role: 'member', // Assuming a default role for new users
        });

        // Redirect to the home page
        res.redirect('/');
    } catch (error) {
        console.error('Error creating user:', error);
        // Handle the error (e.g., render an error page)
        res.status(500).send('Internal Server Error');
    }
});

// Handle login form submission
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

router.get('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});


module.exports = router;
