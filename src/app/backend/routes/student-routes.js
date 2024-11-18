const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student-controller');

// Створити нового студента
router.post('/', studentController.addStudent);

// Отримати всіх студентів
router.get('/', studentController.getAllStudents);

// Отримати студента за ID
router.get('/:id', studentController.getStudentById);

// Оновити інформацію про студента за ID
router.put('/:id', studentController.updateStudent);

// Видалити студента за ID
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
