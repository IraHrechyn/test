const express = require('express');
const router = express.Router();
const testController = require('../controllers/test-controller');

// Додати новий тест
router.post('/', testController.addTest);

// Отримати всі тести
router.get('/', testController.getAllTests);

// Отримати тест за ID
router.get('/:id', testController.getTestById);

// Оновити тест за ID
router.put('/:id', testController.updateTest);

// Видалити тест за ID
router.delete('/:id', testController.deleteTest);

module.exports = router;
