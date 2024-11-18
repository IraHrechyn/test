const Test = require('../models/test-model');

// Отримати всі тести (Read)
const getAllTests = async () => {
  return await Test.findAll();
};

// Отримати тест за ID (Read)
const getTestById = async (id) => {
  return await Test.findByPk(id);
};

// Додати новий тест (Create)
const addTest = async (testData) => {
  return await Test.create(testData);
};

// Оновити інформацію про тест (Update)
const updateTest = async (id, testData) => {
  const [updated] = await Test.update(testData, { where: { id } });
  return updated ? await Test.findByPk(id) : null;
};

// Видалити тест (Delete)
const deleteTest = async (id) => {
  return await Test.destroy({ where: { id } });
};

module.exports = {
  getAllTests,
  getTestById,
  addTest,
  updateTest,
  deleteTest,
};
