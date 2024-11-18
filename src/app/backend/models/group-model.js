const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Group extends Model {}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
    },
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    students_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
    timestamps: false,
  }
);

module.exports = Group;
