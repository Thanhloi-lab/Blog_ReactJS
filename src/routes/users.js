var express = require('express');
var router = express.Router();
var authorizeMiddleware = require('../app/middlewares/authorizeMiddleware')

const userController = require('../app/controllers/UserController');

router.put('/change-password', authorizeMiddleware(), userController.changePassword)
router.put('/edit', authorizeMiddleware(), userController.edit)
router.post('/sign-up', userController.store);
router.post('/login', userController.login);

module.exports = router;
