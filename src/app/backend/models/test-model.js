const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Test extends Model {}

Test.init(
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    test_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    open_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    close_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    open_time: {
      type: DataTypes.JSON, // Зберігає об'єкт з `hours` та `minutes`
      allowNull: false,
    },
    close_time: {
      type: DataTypes.JSON, // Зберігає об'єкт з `hours` та `minutes`
      allowNull: false,
    },
    questions: {
      type: DataTypes.JSON, // Зберігає масив об'єктів з питаннями
      allowNull: false,
      // Приклад структури питання:
      // [
      //   {
      //     id: 1,
      //     question_text: "Текст питання",
      //     options: ["Відповідь 1", "Відповідь 2"],
      //     correct_answer: "Відповідь 1"
      //   },
      //   ...
      // ]
    },
    duration: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Test',
    tableName: 'tests',
    timestamps: false, // Додає поля `createdAt` та `updatedAt`
  }
);

module.exports = Test;
