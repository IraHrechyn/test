// models/teacher.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Teacher extends Model {}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    timestamps: true, // Enables createdAt and updatedAt fields
  }
);

module.exports = Teacher;
