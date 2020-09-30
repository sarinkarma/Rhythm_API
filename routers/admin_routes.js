// Initialize express router
const express = require('express');
const router = new express.Router();
const bodyParser = require('body-parser');
const auth = require('../middleware/user_auth');
const uploadImage = require('../middleware/uploadImage');
const uploadFile = require('../middleware/uploadFiles');

router.use(bodyParser.urlencoded({ extended: false }));

//Admin Controller
var adminArtistController = require('../controller/adminController/artistController');
var adminAlbumController = require('../controller/adminController/albumController');
var adminSongController = require('../controller/adminController/songController');
var adminGenreController = require('../controller/adminController/genreController');

//----------------------Admin API Route---------------------//
router.route('/artist')
    .get(auth, adminArtistController.index)
    .post([auth, uploadImage], adminArtistController.new);

router.route('/artist/:artist_id')
    .get(auth, adminArtistController.view)
    .patch([auth, uploadImage], adminArtistController.update)
    .put([auth, uploadImage], adminArtistController.update)
    .delete(auth, adminArtistController.delete);

router.route('/album')
    .get(auth, adminAlbumController.index)
    .post([auth, uploadImage], adminAlbumController.new);

router.route('/album/:album_id')
    .get(auth, adminAlbumController.view)
    .patch([auth, uploadImage], adminAlbumController.update)
    .put([auth, uploadImage], adminAlbumController.update)
    .delete(auth, adminAlbumController.delete);

router.route('/song')
    .get(auth, adminSongController.index)
    .post([auth, uploadFile], adminSongController.new);

router.route('/song/:song_id')
    .get(auth, adminSongController.view)
    .patch([auth, uploadFile], adminSongController.update)
    .put([auth, uploadFile], adminSongController.update)
    .delete(auth, adminSongController.delete);

router.route('/genre')
    .get(auth, adminGenreController.index)
    .post([auth, uploadImage], adminGenreController.new);

router.route('/genre/:genre_id')
    .get(auth, adminGenreController.view)
    .patch([auth, uploadImage], adminGenreController.update)
    .put([auth, uploadImage], adminGenreController.update)
    .delete(auth, adminGenreController.delete);

// Export API routes
module.exports = router;