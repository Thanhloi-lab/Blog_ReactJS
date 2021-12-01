var express = require('express');
var router = express.Router();

const siteController = require('../app/controllers/SiteController');
router.get('/', siteController.index);
router.get('/search', siteController.search);
module.exports = router;
