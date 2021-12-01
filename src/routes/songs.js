var express = require('express');
var router =  express.Router();

const songController = require('../app/controllers/SongController')

router.get('/show', songController.show);
router.post('/store', songController.store);

module.exports = router;


