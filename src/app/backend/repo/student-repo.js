const Student = require('../models/student-model');

// Отримати всіх студентів (Read)
const getAllStudents = async () => {
  return await Student.findAll();
};

// Отримати одного студента за ID (Read)
const getStudentById = async (id) => {
  return await Student.findByPk(id);
};

// Додати нового студента (Create)
const addStudent = async (studentData) => {
  return await Student.create(studentData);
};

// Оновити інформацію про студента (Update)
const updateStudent = async (id, studentData) => {
  const [updated] = await Student.update(studentData, { where: { id } });
  return updated ? await Student.findByPk(id) : null;
};

// Видалити студента (Delete)
const deleteStudent = async (id) => {
  return await Student.destroy({ where: { id } });
};

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
};
