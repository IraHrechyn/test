const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Subject extends Model {}

Subject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true
    },
    subject_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_teacher: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'Subject',
    tableName: 'subjects',
    timestamps: false,
  }
);

module.exports = Subject;
