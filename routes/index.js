var express = require('express');
var router = express.Router();
const passport = require('passport');

const { User } = require('../models');



router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express', user: req.user });
});


router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Express', user: req.user, message: req.flash('error') });
});


router.get('/signup', function (req, res, next) {
    res.render('signup', { title: 'Express', user: req.user });
});




router.post('/signup', async function (req, res, next) {
    const { username, firstname, lastname, password } = req.body;

    try {
        const newUser = await User.create({
            fullname: `${firstname} ${lastname}`,
            username,
            password,
            role: 'member',
        });
        res.redirect('/login');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});


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
