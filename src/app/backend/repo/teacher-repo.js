const Teacher = require('../models/teacher-model');

// Отримати всі записи (Read)
const getAllTeachers = async () => {
  return await Teacher.findAll();
};

// Отримати одного вчителя за ID (Read)
const getTeacherById = async (id) => {
  return await Teacher.findByPk(id);
};

// Додати нового вчителя (Create)
const addTeacher = async (teacherData) => {
  return await Teacher.create(teacherData);
};

// Оновити інформацію про вчителя (Update)
const updateTeacher = async (id, teacherData) => {
  const [updated] = await Teacher.update(teacherData, { where: { id } });
  return updated ? await Teacher.findByPk(id) : null;
};

// Видалити вчителя (Delete)
const deleteTeacher = async (id) => {
  return await Teacher.destroy({ where: { id } });
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher,
  deleteTeacher,
};
