const fs = require('fs/promises');
const path = require('path');
const { Animal } = require('../models');

const populateAnimals = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../public/json/animals.json'), 'utf-8');
    const animals = JSON.parse(data);

    await Animal.bulkCreate(animals);

    console.log('Animals table populated!');
  } catch (error) {
    console.error('Error populating Animals table: ', error);
  }
};

module.exports = populateAnimals;