const Song = require('../../models/song');

exports.index = function (req, res) {
    Song.find()
    .then(songs => {
        res.send({
            status: 200,
            message: "Song retrieved successfully",
            data: songs
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
        var file = item.filename

        var song = new Song();
        song.name = req.body.name;
        song.file = file;
        song.tags = req.body.tags;
        song.artist = req.body.artist;
        song.album = req.body.album;

        song.save()
        .then(dt => {
            Song.find({_id : dt._id}).populate('artist').populate('album').exec(function(err, value){
                res.send({
                    status: 200,
                    message: 'Song added successfully',
                    data: value
                });
            })
            
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while creating the "
            });
        })
    });
};

exports.view = function (req, res) {
    Song.findById(req.params.song_id)
    .then(song => {
        if(!song){
            return res.send({
                status: 404,
                message: "Song not found"
            })
        }
        res.send({
            status: 200,
            message: 'Song retrieved successfully.',
            data: song
        })
    }).catch(err => {
        if(err.kind === 'objectId') {
            return res.send({
                status: 404,
                message: 'Song not found.'
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
        var file = item.filename

        Song.findByIdAndUpdate(req.params.song_id, {
            name: req.body.name,
            file: file,
            tags: req.body.tags,
            artist: req.body.artist,
            album: req.body.album,

        }).then(song => {
            if(!song){
                return res.send({
                    status: 404,
                    message: 'Song not found.'
                })
            }

            Song.find().populate('artist').populate('album').exec(function(err, value){
                res.send({
                    status: 200,
                    message: 'Song Updated successfully',
                    data: value
                });
            })
        }).catch(err => {
            if(err.kind === 'objectId') {
                return res.send({
                    status: 404,
                    message: 'Song not found.'
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
    Song.findByIdAndDelete(req.params.song_id)
    .then(song => {
        if(!song){
            return res.send({
                status: 404,
                message: 'Song not found.'
            })
        }
        res.send({
            status: 200,
            message: 'Song deleted successfully.'
        })
    }).catch(err => {
        if(err.kind === 'objectId' || err.name === 'Not found') {
            return res.send({
                status: 404,
                message: 'Song not found.'
            })
        }
        return res.send({
            status: 500,
            message: err.message
        })
    })
};