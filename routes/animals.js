const express = require('express');
const router = express.Router();
const { Animal, Adoption, sequelize } = require('../models');
const { Op } = require('sequelize');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Unauthorized: User not logged in');
}


// Add this function to your routes file to check if the user is an admin
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ success: false, message: 'Forbidden: Only admin users can access this feature' });
}


// route for main animals page
router.get('/', async function (req, res, next) {
  try {
    const animals = await Animal.findAll();
    res.render('animals', { user: req.user, animals: animals });
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Names bu poularity list
router.get('/popularNames', async function (req, res, next) {
  try {
    const animals = await Animal.findAll({
      order: [['name', 'ASC']],
    });
    res.render('animals', { user: req.user, animals: animals });
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).send('Internal Server Error');
  }
});


//animals that have been adopted
router.get('/adoptedAnimals', async function (req, res, next) {
  try {
    const adoptedAnimals = await Animal.findAll({
      where: {
        adopted: true,
      },
    });
    res.render('animals', { user: req.user, animals: adoptedAnimals });
  } catch (error) {
    console.error('Error fetching adopted animals:', error);
    res.status(500).send('Internal Server Error');
  }
});


// sort animals by age
router.get('/animalsByAge', async function (req, res, next) {
  try {
    const animalsByAge = await Animal.findAll({
      order: [['birthday', 'DESC']], // Assuming 'birthday' is the field representing the animal's age
    });
    res.render('animals', { user: req.user, animals: animalsByAge });
  } catch (error) {
    console.error('Error fetching animals by age:', error);
    res.status(500).send('Internal Server Error');
  }
});



//get animals born withing given dates
router.get('/animalsByDateRange', async function (req, res, next) {
  res.render('animalsByDateRange', { user: req.user });
});

router.post('/animalsByDateRange', async function (req, res, next) {
  try {
    const { startDate, endDate } = req.body;

    const animalsInDateRange = await Animal.findAll({
      where: {
        birthday: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.render('animals', { user: req.user, animals: animalsInDateRange });
  } catch (error) {
    console.error('Error fetching animals by date range:', error);
    res.status(500).send('Internal Server Error');
  }
});


// adopt animal
router.post('/adopt/:animalId', async function (req, res, next) {
  const animalId = req.params.animalId;

  try {
    const userId = req.user.id;
    const animal = await Animal.findByPk(animalId);
    if (!animal || animal.adopted) {
      return res.json({ success: false, message: 'Animal not available for adoption.' });
    }

    await Animal.update({ adopted: true }, { where: { id: animalId } });

    await Adoption.create({
      userId: userId,
      animalId: animalId,
    });

    res.json({ success: true, message: 'Adoption successful.' });
  } catch (error) {
    console.error('Error adopting animal:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



// cancel adoption - admin only
router.post('/cancelAdoption/:animalId', ensureAuthenticated, async function (req, res, next) {
  try {
    const animalId = req.params.animalId;
    const userId = req.user.id;
    if (req.user.role !== 'admin') {
      return res.status(403).send('Forbidden: Only admin users can cancel adoptions');
    }
    const adoption = await Adoption.findOne({
      where: { animalId },
    });

    if (!adoption) {
      return res.status(404).send('Adoption not found');
    }
    await adoption.destroy();
    const animal = await Animal.findByPk(animalId);
    if (animal) {
      await animal.update({ adopted: false });
    }
    res.send('Adoption canceled successfully');
  } catch (error) {
    console.error('Error canceling adoption:', error);
    res.status(500).send('Internal Server Error');
  }
});

// show amount of animals per certain size as pop-up
router.get('/animalsPerSize', ensureAdmin, async function (req, res, next) {
  try {
    const animalsPerSize = await Animal.findAll({
      attributes: ['size', [sequelize.fn('COUNT', 'id'), 'count']],
      group: ['size'],
    });

    res.json(animalsPerSize);
  } catch (error) {
    console.error('Error fetching animals per size:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



module.exports = router;