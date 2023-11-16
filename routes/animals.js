const express = require('express');
const router = express.Router();
const { Animal, Adoption } = require('../models');

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


router.post('/cancelAdoption/:animalId', async function (req, res, next) {
  try {
    const animalId = req.params.animalId;
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


module.exports = router;