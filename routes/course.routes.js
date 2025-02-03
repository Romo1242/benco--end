const router = require('express').Router();
const courseController = require('../controllers/course.controller');

router.get('/', courseController.readCourse);
router.get('/:id', courseController.readByClientCourse);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;