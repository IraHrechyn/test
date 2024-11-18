const teacherRepository = require('../repo/teacher-repo');

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherRepository.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers.' });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await teacherRepository.getTeacherById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teacher.' });
  }
};

const addTeacher = async (req, res) => {
  console.log( res, req.body);
  try {
    console.log('Request body:', req.body);
    const newTeacher = await teacherRepository.addTeacher(req.body);
    res.status(201).json(newTeacher);
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({ message: 'Failed to create teacher.' });
  }
};


const updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await teacherRepository.updateTeacher(req.params.id, req.body);
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update teacher.' });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const deleted = await teacherRepository.deleteTeacher(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.json({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete teacher.' });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher,
  deleteTeacher,
};
