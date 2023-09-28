const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.BLOB('long'),
    },
  });

  return Image;
};