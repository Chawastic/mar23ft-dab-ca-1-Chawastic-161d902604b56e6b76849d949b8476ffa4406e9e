const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Animal = sequelize.define('Animal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    species: DataTypes.STRING,
    birthday: DataTypes.DATE,
    temperament: DataTypes.STRING,
    size: DataTypes.STRING,
    adopted: DataTypes.BOOLEAN,
  });

  return Animal;
};