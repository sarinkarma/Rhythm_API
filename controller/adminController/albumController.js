const Album = require('../../models/album');
const Genre = require('../../models/genre');
var mongoose = require('mongoose');

exports.index = function (req, res) {
    Album.find()
    .then(albums => {
        var albs = [];    

        albums.map(function (item){
            var genreArr = item.genre.split(',');
            var newArray = genreArr.map(s => mongoose.Types.ObjectId(s));

            Genre.find({_id : { $in: newArray}}).then(response => {
                item._doc.genre = response;
                albs.push(item);

                if(albs.length == albums.length){
                    res.send({
                        status: 200,
                        message: "Album retrieved successfully",
                        data: albs
                    })

                }
            })
        })

    }).catch(err => {
        res.json({
            status: "500",
            message: err.message,
        });
    })
};

exports.new = function (req, res) {
    req.files.map(function(item){
        var image = item.filename

        var album = new Album();
        album.name = req.body.name;
        album.image = image;
        album.release_date = req.body.release_date;
        album.copyright = req.body.copyright;
        album.genre = req.body.genre;
        album.artist = req.body.artist;

        album.save()
        .then(dt => {
            Album.find({_id : dt._id}).populate('artist').exec(function(err, value){
                res.send({
                    status: 200,
                    message: 'Album added successfully',
                    data: value
                });
            })
            
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while creating the "
            });
        })
    })
};

exports.view = function (req, res) {
    Album.findById(req.params.album_id)
    .then(album => {
        if(!album){
            return res.send({
                status: 404,
                message: "Album not found"
            })
        }
        res.send({
            status: 200,
            message: 'Album retrieved successfully.',
            data: album
        })
    }).catch(err => {
        if(err.kind === 'objectId') {
            return res.send({
                status: 404,
                message: 'Album not found.'
            })
        }
        return res.send({
            status: 500,
            message: err.message
        })
    })
};

exports.update = function (req, res) {
    req.files.map(function(item){
        var image = item.filename

        Album.findByIdAndUpdate(req.params.album_id, {
            name: req.body.name,
            image: image,
            release_date: req.body.release_date,
            copyright: req.body.copyright,
            genre: req.body.genre,
            artist: req.body.artist,

        }).then(album => {
            if(!album){
                return res.send({
                    status: 404,
                    message: 'Album not found.'
                })
            }

            Album.find().populate('artist').exec(function(err, value){
                res.send({
                    status: 200,
                    message: 'Album Updated successfully',
                    data: value
                });
            })
        }).catch(err => {
            if(err.kind === 'objectId') {
                return res.send({
                    status: 404,
                    message: 'Album not found.'
                })
            }
            return res.send({
                status: 500,
                message: err.message
            })
        })
    })
};

exports.delete = function (req, res) {
    Album.findByIdAndDelete(req.params.album_id)
    .then(album => {
        if(!album){
            return res.send({
                status: 404,
                message: 'Album not found.'
            })
        }
        res.send({
            status: 200,
            message: 'Album deleted successfully.'
        })
    }).catch(err => {
        if(err.kind === 'objectId' || err.name === 'Not found') {
            return res.send({
                status: 404,
                message: 'Album not found.'
            })
        }
        return res.send({
            status: 500,
            message: err.message
        })
    })
};