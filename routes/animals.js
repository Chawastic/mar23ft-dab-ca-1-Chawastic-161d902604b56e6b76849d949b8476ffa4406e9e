const express = require('express');
const router = express.Router();
const { Animal, Adoption } = require('../models');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Unauthorized: User not logged in');
}


router.get('/', async function (req, res, next) {
  try {
    const animals = await Animal.findAll();
    res.render('animals', { user: req.user, animals: animals });
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).send('Internal Server Error');
  }
});


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




router.post('/cancelAdoption/:animalId', ensureAuthenticated, async function (req, res, next) {
  try {
    const animalId = req.params.animalId;
    const userId = req.user.id; // Get the ID of the logged-in user

    // Check if the user has the 'admin' role
    if (req.user.role !== 'admin') {
      return res.status(403).send('Forbidden: Only admin users can cancel adoptions');
    }

    // Find the corresponding Adoption record
    const adoption = await Adoption.findOne({
      where: { animalId },
    });

    if (!adoption) {
      return res.status(404).send('Adoption not found');
    }

    // Destroy the Adoption record
    await adoption.destroy();

    // Now, update the Animal record to set adopted back to false
    const animal = await Animal.findByPk(animalId);
    if (animal) {
      await animal.update({ adopted: false });
    }

    // Send a success response
    res.send('Adoption canceled successfully');
  } catch (error) {
    console.error('Error canceling adoption:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;