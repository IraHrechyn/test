const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject-controller');

router.post('/', subjectController.addSubject);

router.get('/', subjectController.getAllSubjects);

router.get('/:id', subjectController.getSubjectById);

router.put('/:id', subjectController.updateSubject);

router.delete('/:id', subjectController.deleteSubject);
router.get('/teacher/:teacherId', subjectController.getSubjectsByTeacherId);

// Маршрут для отримання предметів за ID групи
router.get('/group/:groupId', subjectController.getSubjectsByGroupId);

module.exports = router;
