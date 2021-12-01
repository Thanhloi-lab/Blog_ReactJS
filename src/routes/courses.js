var express = require('express');
var router = express.Router();

const courseController = require('../app/controllers/CourseController');


router.post('/store', courseController.store);
router.post('/handle-form-action', courseController.handleFormAction);
router.get('/:id/edit', courseController.edit);
router.put('/:id', courseController.update);
router.patch('/:id/restore', courseController.restore);
router.delete('/:id', courseController.delete);
router.delete('/:id/force', courseController.forceDelete);
router.get('/create', courseController.create);
router.get('/:slug', courseController.show);
module.exports = router;
