const express = require('express');
const router = express.Router();
const { Animal } = require('../models');

router.get('/', async function (req, res, next) {
  try {
    // Fetch all animals from the Animals table
    const animals = await Animal.findAll();

    // Extract unique species and corresponding animal IDs
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

router.post('/update', async function (req, res, next) {
  res.render('index', { user: null });
});

module.exports = router;