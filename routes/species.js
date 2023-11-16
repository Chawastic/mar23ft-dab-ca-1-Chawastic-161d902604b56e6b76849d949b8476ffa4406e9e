const express = require('express');
const router = express.Router();
const { Animal, Species } = require('../models');

// Passport authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(401).send('Unauthorized: User not logged in or not an admin');
};



router.get('/', ensureAuthenticated, async function (req, res, next) {
  try {
    const animals = await Animal.findAll();
    const uniqueSpecies = [...new Set(animals.map(animal => animal.species))];
    const speciesData = uniqueSpecies.map(species => {
      const animalIds = animals.filter(animal => animal.species === species).map(animal => animal.id);
      return { Ids: animalIds.join(', '), Name: species };
    });

    res.render('species', { user: req.user, species: speciesData });
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/add', ensureAuthenticated, async function (req, res, next) {
    try {
        const { speciesName } = req.body;

        // Check if the species already exists
        const existingSpecies = await Species.findOne({ where: { name: speciesName } });
        if (existingSpecies) {
            return res.status(400).send('Species already exists');
        }

        // Create a new species
        const newSpecies = await Species.create({ name: speciesName });

        // Redirect to the species page with the updated list
        res.redirect('/species');
    } catch (error) {
        console.error('Error adding new species:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/update', ensureAuthenticated, async function (req, res, next) {
  res.render('index', { user: null });
});

module.exports = router;
