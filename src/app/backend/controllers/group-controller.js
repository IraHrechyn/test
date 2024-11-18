const groupRepository = require('../repo/group-repo');

const getAllGroups = async (req, res) => {
  try {
    const groups = await groupRepository.getAllGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch groups.' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await groupRepository.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch group.' });
  }
};

const addGroup = async (req, res) => {
  try {
    console.log("Received data:", req.body);  // Перевірка отриманих даних
    const newGroup = await groupRepository.addGroup(req.body);
    console.log("Group added:", newGroup); // Перевірка результату додавання
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error while adding group:", error); // Перевірка помилки
    res.status(500).json({ message: 'Failed to create group.' });
  }
};

const updateGroup = async (req, res) => {
  try {
    const updatedGroup = await groupRepository.updateGroup(req.params.id, req.body);
    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update group.' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const deleted = await groupRepository.deleteGroup(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    res.json({ message: 'Group deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete group.' });
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  addGroup,
  updateGroup,
  deleteGroup,
};
