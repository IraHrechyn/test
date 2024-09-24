// src/routes/user.js

const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher-model');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create teacher.' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers.' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found.' });
    } else {
      res.json(teacher);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teacher.' });
  }
});

// Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowsCount] = await Teacher.update(req.body, {
      where: { id: req.params.id }
    });
    if (updatedRowsCount === 0) {
      res.status(404).json({ message: 'Teacher not found.' });
    } else {
      const teacher = await Teacher.findByPk(req.params.id);
      res.json(teacher);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update teacher.' });
  }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Teacher.destroy({ where: { id: req.params.id } });
    if (deletedRowsCount === 0) {
      res.status(404).json({ message: 'Teacher not found.' });
    } else {
      res.json({ message: 'Teacher deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete teacher.' });
  }
});

module.exports = router;
