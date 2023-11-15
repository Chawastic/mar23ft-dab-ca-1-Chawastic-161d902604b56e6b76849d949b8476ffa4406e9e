const express = require('express');
const router = express.Router();
const { Animal } = require('../models');

router.get('/', async function (req, res, next) {
  try {
    // Fetch all animals from the Animals table
    const animals = await Animal.findAll();
    res.render('animals', { user: null, animals: animals });
  } catch (error) {
    console.error('Error fetching animals:', error);
    next(error); // Pass the error to the error handler
  }
});

module.exports = router;
