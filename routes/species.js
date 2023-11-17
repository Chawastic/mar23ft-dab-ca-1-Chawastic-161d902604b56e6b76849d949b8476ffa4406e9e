const express = require('express');
const router = express.Router();
const { Animal } = require('../models');

// Passport authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(401).send('Unauthorized: only accesible as admin');
};



router.get('/', async function (req, res, next) {
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


//add new species
router.post('/add', ensureAuthenticated, async function (req, res, next) {
    try {
      const { newSpeciesName } = req.body;
      const existingSpecies = await Animal.findOne({ where: { species: newSpeciesName } });
      if (existingSpecies) {
        return res.status(400).send('Species already exists');
      }
      await Animal.create({ species: newSpeciesName });
      res.redirect('/species');
    } catch (error) {
      console.error('Error adding new species:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  


// routes/species.js
router.post('/update', ensureAuthenticated, async function (req, res, next) {
    try {
      const { speciesId, newSpeciesName } = req.body;
  
      // Check if the animal exists
      const animal = await Animal.findByPk(speciesId);
      if (!animal) {
        return res.status(404).send('Animal not found');
      }
  
      // Update the species name
      animal.species = newSpeciesName;
      await animal.save();
  
      // Redirect to the species page with the updated list
      res.redirect('/species');
    } catch (error) {
      console.error('Error updating species:', error);
      res.status(500).send('Internal Server Error');
    }
  });


  router.post('/delete', ensureAuthenticated, async function (req, res, next) {
    try {
      const speciesId = parseInt(req.body.speciesId);
      const animalToDelete = await Animal.findOne({ 
        where: { name: null } 
      });
  
      if (!animalToDelete) {
        return res.status(404).send('Species has animals');
      }
      const deletedAnimal = await Animal.destroy({ where: { name: null } });
  
      if (deletedAnimal > 0) {
        res.redirect('/species');
      } else {
        res.status(500).send('Error deleting species');
      }
    } catch (error) {
      console.error('Error deleting species:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  

module.exports = router;
