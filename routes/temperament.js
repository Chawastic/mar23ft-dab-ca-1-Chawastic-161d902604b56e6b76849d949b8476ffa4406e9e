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
  

router.get('/', ensureAuthenticated, async function (req, res, next) {
    try {
        const animals = await Animal.findAll({
            attributes: ['id', 'temperament'],
            raw: true,
            group: ['id', 'temperament']
        });
        const uniqueTemperaments = Array.from(new Set(animals.map(animal => animal.temperament)))
            .map(temperament => {
                const ids = animals
                    .filter(animal => animal.temperament === temperament)
                    .map(animal => animal.id);
                return {
                    Ids: ids.join(', '),
                    Name: temperament
                };
            });
        res.render("temperament", { user: req.user, temperament: uniqueTemperaments });
    } catch (error) {
        console.error('Error fetching temperaments:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/update-temperament', ensureAuthenticated, async function (req, res, next) {
    try {
      const { animalId, updatedTemp } = req.body;
  
      const animal = await Animal.findByPk(animalId);
  
      if (!animal) {
        return res.status(404).send('Animal not found');
      }
      animal.temperament = updatedTemp;
      await animal.save();
      res.redirect('/temperament');
    } catch (error) {
      console.error('Error updating animal temperament:', error);
      res.status(500).send('Internal Server Error');
    }
  });


  router.post('/delete', ensureAuthenticated, async function (req, res, next) {
    try {
      const { temperamentId } = req.body;
      const deletedRows = await Animal.destroy({
        where: {
          id: temperamentId,
          name: null,
        }
      });
  
      if (deletedRows === 0) {
        return res.status(404).send({ error: 'Temperament is connected to existing animals, can only delete temperament if no animals have said temperament' });
      }
      res.redirect('/temperament');
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });
  


// add new temperaments
  router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
      const { newTempName } = req.body;
      const existingTemp = await Animal.findOne({ where: { temperament: newTempName } });
  
      if (existingTemp) {
        req.flash('error', 'Temperament already exists');
        return res.redirect('/temperament');
      }
      await Animal.create({ temperament: newTempName });
      req.flash('success', 'Temperament added successfully');
      return res.redirect('/temperament');
    } catch (error) {
      console.error('Error adding new temperament:', error);
      req.flash('error', 'Error adding new temperament');
      return res.redirect('/temperament');
    }
  });

module.exports = router;
