var express = require('express');
var router = express.Router();
var authorizeMiddleware = require('../app/middlewares/authorizeMiddleware')

const playListController = require('../app/controllers/PlayListController');
const Playlist = require('../app/models/Playlist');

router.post('/create',authorizeMiddleware(), playListController.store);
router.put('/update',authorizeMiddleware(), playListController.update);
router.delete('/delete', authorizeMiddleware(), playListController.delete);
router.get('/get-playlist', playListController.getPlayList);
router.get('/get-user-playlists', playListController.getUserPlayList);
router.get('/check-song-in-playlist', playListController.checkSongInPlayList);
router.post('/add-song-to-playlist',playListController.addSongInPlayList);
router.delete('/remove-song-from-playlist',playListController.removeSongFromPlayList)


module.exports = router;
