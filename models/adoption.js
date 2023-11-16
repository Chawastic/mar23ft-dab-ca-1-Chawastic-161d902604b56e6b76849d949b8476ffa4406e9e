const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const Adoption = sequelize.define('Adoption', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    animalId: { type: DataTypes.INTEGER, primaryKey: true },
  });
  Adoption.associate = models => {
    Adoption.belongsTo(models.User, { foreignKey: 'userId' });
    Adoption.belongsTo(models.Animal, { foreignKey: 'animalId' });
  };

  return Adoption;
};
