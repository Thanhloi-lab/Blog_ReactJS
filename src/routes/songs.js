var express = require('express');
var router =  express.Router();
var authorizeMiddleware = require('../app/middlewares/authorizeMiddleware')

const songController = require('../app/controllers/SongController')

router.get('/user-song', authorizeMiddleware(), songController.userSong)
router.delete('/delete', authorizeMiddleware(), songController.delete)
router.put('/update', authorizeMiddleware(), songController.update);
router.get('/get-Page', songController.getPage);
router.get('/search', songController.search);
router.post('/store', authorizeMiddleware(), songController.store);

module.exports = router;


