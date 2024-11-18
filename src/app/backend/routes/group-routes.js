const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group-controller'); // Імпортуємо контролер групи

// Створити нову групу
router.post('/', groupController.addGroup);

// Отримати всі групи
router.get('/', groupController.getAllGroups);

// Отримати групу за ID
router.get('/:id', groupController.getGroupById);

// Оновити інформацію про групу за ID
router.put('/:id', groupController.updateGroup);

// Видалити групу за ID
router.delete('/:id', groupController.deleteGroup);

module.exports = router;
