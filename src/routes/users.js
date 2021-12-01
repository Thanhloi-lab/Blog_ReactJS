var express = require('express');
var router = express.Router();

const userController = require('../app/controllers/UserController');

router.post('/register', userController.store);
router.post('/login', userController.login);
router.get('/show', userController.show);

module.exports = router;
