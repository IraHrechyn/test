const testRepository = require('../repo/test-repo');

const getAllTests = async (req, res) => {
  try {
    const tests = await testRepository.getAllTests();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tests.' });
  }
};

const getTestById = async (req, res) => {
  try {
    const test = await testRepository.getTestById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch test.' });
  }
};

const addTest = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const newTest = await testRepository.addTest(req.body);
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error adding test:', error);
    res.status(500).json({ message: 'Failed to create test.' });
  }
};

const updateTest = async (req, res) => {
  try {
    const updatedTest = await testRepository.updateTest(req.params.id, req.body);
    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update test.' });
  }
};

const deleteTest = async (req, res) => {
  try {
    const deleted = await testRepository.deleteTest(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    res.json({ message: 'Test deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete test.' });
  }
};

module.exports = {
  getAllTests,
  getTestById,
  addTest,
  updateTest,
  deleteTest,
};

