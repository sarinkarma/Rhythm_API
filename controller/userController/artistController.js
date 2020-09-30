const Artist = require('../../models/artist');
const Album = require('../../models/album');
const Genre = require('../../models/genre');
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

exports.index = function (req, res) {
    Artist.find()
    .then(artists => {
        res.send({
            status: 200,
            message: "Artists retrieved successfully",
            data: artists
        })
    }).catch(err => {
        res.json({
            status: "500",
            message: err.message,
        });
    })
};

exports.view = function (req, res) {
    Artist.findById(req.params.artist_id)
    .then(artist => {
        if(!artist){
            return res.send({
                status: 404,
                message: "Artist not found"
            })
        }
        res.send({
            status: 200,
            message: 'Artist retrieved successfully.',
            data: artist
        })
    }).catch(err => {
        if(err.kind === 'objectId') {
            return res.send({
                status: 404,
                message: 'Artist not found.'
            })
        }
        return res.send({
            status: 500,
            message: err.message
        })
    })
};


exports.getArtistAlbum = function (req, res) {
    Album.find({artist: ObjectId(req.params.artist_id)}).populate('artist').sort({createdAt: -1})
    .then(albums => {
        var albs = [];    

        albums.map(function (item){
            var genreArr = item.genre;

            Genre.find({_id : { $in: genreArr}}).then(response => {
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
