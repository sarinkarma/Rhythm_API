const Album = require('../../models/album');
const Genre = require('../../models/genre');
var mongoose = require('mongoose');

exports.index = function (req, res) {
    Album.find().populate('artist')
    .then(albums => {
        var albs = [];    

        albums.map(function (item){
            var genreArr = item.genre;

            Genre.find({_id : { $in: genreArr}}).then(response => {
                item._doc.genre = response;
                albs.push(item);

                if(albs.length == albums.length){
                    res.json({
                        status: 200,
                        message: "Album retrieved successfully",
                        data: albs.sort((a,b)=>b.createdAt-a.createdAt)
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

exports.view = function (req, res) {
    Album.findById(req.params.album_id).populate('artist')
    .then(album => {
        var alb;
        if(!album){
            return res.send({
                status: 404,
                message: "Album not found"
            })
        }
        var genreArr = album.genre;

        Genre.find({_id : { $in: genreArr}}).then(response => {
            album._doc.genre = response;

            res.send({
                status: 200,
                message: "Album retrieved successfully",
                data: album
            })
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
