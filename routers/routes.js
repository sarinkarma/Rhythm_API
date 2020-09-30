// Initialize express router
const express = require('express');
const router = new express.Router();
const bodyParser = require('body-parser');
const auth = require('../middleware/user_auth');
const uploadImage = require('../middleware/uploadImage');

router.use(bodyParser.urlencoded({ extended: false }));

//Import Controllers
var authController = require('../controller/userController/authController');
var artistController = require('../controller/userController/artistController');
var albumController = require('../controller/userController/albumController');
var songController = require('../controller/userController/songController');
var genreController = require('../controller/userController/genreController');
var searchController = require('../controller/userController/searchController');
var userController = require('../controller/userController/userController');

//----------------------API Route---------------------//
router.route('/login')
    .post(authController.login)

router.route('/signup')
    .post(authController.signup)

router.route('/logout')    
    .get(auth, authController.logout)

router.route('/user/:user_id')
    .patch(auth, userController.update)

router.route('/user/:user_id/password')
    .patch(auth, userController.updatePassword)

router.route('/user/:user_id/image')
    .patch([auth, uploadImage], userController.updateImage)

router.route('/email_check')
    .post(authController.emailCheck)

router.route('/artist')
    .get(auth, artistController.index)

router.route('/artist/:artist_id')
    .get(auth, artistController.view)

router.route('/artist/album/:artist_id')
    .get(auth, artistController.getArtistAlbum)

router.route('/album')
    .get(auth, albumController.index)

router.route('/album/:album_id')
    .get(auth, albumController.view)

router.route('/song')
    .get(auth, songController.index)

router.route('/song/:song_id')
    .get(auth, songController.view)

router.route('/song/album/:album_id')
    .get(auth, songController.getAlbumSongs)

router.route('/genre')
    .get(auth, genreController.index)

router.route('/genre/:genre_id')
    .get(auth, genreController.view)

router.route('/genre/:genre_id/album')
    .get(auth, genreController.album)

router.route('/search')
    .post(auth, searchController.search)

// Export API routes
module.exports = router;