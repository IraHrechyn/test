const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // Import the UUID library

class Teacher extends Model {}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
    timestamps: true,
  }
);

module.exports = Teacher;
