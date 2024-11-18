const studentRepository = require('../repo/student-repo');

const getAllStudents = async (req, res) => {
  try {
    const students = await studentRepository.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students.' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await studentRepository.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student.' });
  }
};

const addStudent = async (req, res) => {
  try {
    console.log("Received data:", req.body);  // Перевірка отриманих даних
    const newStudent = await studentRepository.addStudent(req.body);
    console.log("Student added:", newStudent); // Перевірка результату додавання
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error while adding student:", error); // Перевірка помилки
    res.status(500).json({ message: 'Failed to create student.' });
  }
};


const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await studentRepository.updateStudent(req.params.id, req.body);
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student.' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const deleted = await studentRepository.deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student.' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
};
