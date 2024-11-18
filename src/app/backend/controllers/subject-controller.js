const subjectRepository = require('../repo/subject-repo');


const getSubjectsByTeacherId = async (req, res) => {
  try {
    const subjects = await subjectRepository.getSubjectsByTeacherId(req.params.teacherId);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects by teacher ID.' });
  }
};

const getSubjectsByGroupId = async (req, res) => {
  try {
    const subjects = await subjectRepository.getSubjectsByGroupId(req.params.groupId);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects by group ID.' });
  }
};
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await subjectRepository.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects.' });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await subjectRepository.getSubjectById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subject.' });
  }
};

const addSubject = async (req, res) => {
  try {
    const newSubject = await subjectRepository.addSubject(req.body);
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subject.' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await subjectRepository.updateSubject(req.params.id, req.body);
    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update subject.' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const deleted = await subjectRepository.deleteSubject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    res.json({ message: 'Subject deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete subject.' });
  }
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
