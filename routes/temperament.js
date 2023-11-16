const express = require('express');
const router = express.Router();
const { Animal, temperament } = require('../models');


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

        console.log(animals);

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

router.post('/update', async function (req, res, next) {
    res.render("index", { user: null });
});

module.exports = router;
