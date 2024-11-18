const Group = require('../models/group-model'); // Імпортуємо модель Group

// Отримати всі групи (Read)
const getAllGroups = async () => {
  return await Group.findAll();
};

// Отримати одну групу за ID (Read)
const getGroupById = async (id) => {
  return await Group.findByPk(id);
};

// Додати нову групу (Create)
const addGroup = async (groupData) => {
  return await Group.create(groupData);
};

// Оновити інформацію про групу (Update)
const updateGroup = async (id, groupData) => {
  const [updated] = await Group.update(groupData, { where: { id } });
  return updated ? await Group.findByPk(id) : null;
};

// Видалити групу (Delete)
const deleteGroup = async (id) => {
  return await Group.destroy({ where: { id } });
};

module.exports = {
  getAllGroups,
  getGroupById,
  addGroup,
  updateGroup,
  deleteGroup,
};
