const express = require('express');
const router = express.Router();
const { Animal } = require('../models');

router.get('/', async function (req, res, next) {
    try {
        const animals = await Animal.findAll({
            attributes: ['id', 'temperament'],
            raw: true, // Get plain JSON objects
            group: ['id', 'temperament'] // Group by id and temperament
        });

        console.log(animals); // Log the retrieved data

        const uniqueTemperaments = Array.from(new Set(animals.map(animal => animal.temperament)))
            .map(temperament => {
                const ids = animals
                    .filter(animal => animal.temperament === temperament)
                    .map(animal => animal.id);

                return {
                    Ids: ids.join(', '), // Combine IDs into a string
                    Name: temperament
                };
            });


        res.render("temperament", { user: null, temperament: uniqueTemperaments });
    } catch (error) {
        console.error('Error fetching temperaments:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/update', async function (req, res, next) {
    res.render("index", { user: null });
});

module.exports = router;
