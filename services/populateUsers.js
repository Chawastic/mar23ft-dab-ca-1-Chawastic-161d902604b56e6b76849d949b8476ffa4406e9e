// services/populateUsers.js
const fs = require('fs/promises');
const path = require('path');
const { User } = require('../models');

const populateUsers = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../public/json/users.json'), 'utf-8');
    const users = JSON.parse(data);

    for (const user of users) {
        await User.create(user);
      }

    console.log('Users table populated!');
  } catch (error) {
    console.error('Error populating Users table: ', error);
  }
};

module.exports = populateUsers;
