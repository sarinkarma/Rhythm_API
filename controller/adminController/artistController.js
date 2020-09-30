const Artist = require('../../models/artist');

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

exports.new = function (req, res) {
    req.files.map(function(item){
        var image = item.filename

        var artist = new Artist();
        artist.name = req.body.name;
        artist.image = image;

        artist.save()
        .then(dt => {
            Artist.find({_id : dt._id}).exec(function(err, value){
                res.send({
                    status: 200,
                    message: 'Artist added successfully',
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

exports.update = function (req, res) {
    req.files.map(function(item){
        var image = item.filename

        Artist.findByIdAndUpdate(req.params.artist_id, {
            name: req.body.name,
            image: image
        }).then(artist => {
            if(!artist){
                return res.send({
                    status: 404,
                    message: 'Artist not found.'
                })
            }

            Artist.find().exec(function(err, value){
                res.send({
                    status: 200,
                    message: 'Artist Updated successfully',
                    data: value
                });
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
    })
};

exports.delete = function (req, res) {
    Artist.findByIdAndDelete(req.params.artist_id)
    .then(artist => {
        if(!artist){
            return res.send({
                status: 404,
                message: 'Artist not found.'
            })
        }
        res.send({
            status: 200,
            message: 'Artist deleted successfully.'
        })
    }).catch(err => {
        if(err.kind === 'objectId' || err.name === 'Not found') {
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