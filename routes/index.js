var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: null });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express', user: null });
});


router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Express', user: null });
});

module.exports = router;

