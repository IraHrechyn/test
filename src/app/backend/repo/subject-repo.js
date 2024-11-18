const Subject = require('../models/subject-model');

// Отримати всі предмети (Read)
const getAllSubjects = async () => {
  return await Subject.findAll();
};

// Отримати один предмет за ID (Read)
const getSubjectById = async (id) => {
  return await Subject.findByPk(id);
};

// Додати новий предмет (Create)
const addSubject = async (subjectData) => {
  return await Subject.create(subjectData);
};

// Оновити інформацію про предмет (Update)
const updateSubject = async (id, subjectData) => {
  const [updated] = await Subject.update(subjectData, { where: { id } });
  return updated ? await Subject.findByPk(id) : null;
};

// Видалити предмет (Delete)
const deleteSubject = async (id) => {
  return await Subject.destroy({ where: { id } });
};
const getSubjectsByTeacherId = async (teacherId) => {
  return await Subject.findAll({
    where: { id_teacher: teacherId }
  });
};

// Отримати предмети за ID групи
const getSubjectsByGroupId = async (groupId) => {
  return await Subject.findAll({
    where: { group_ids: groupId }
  });
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  addSubject,
  updateSubject,
  deleteSubject,
  getSubjectsByTeacherId,
  getSubjectsByGroupId
};
