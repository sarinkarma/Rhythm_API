const Genre = require('../../models/genre');

exports.index = function (req, res) {
    Genre.find()
    .then(genres => {
        res.send({
            status: 200,
            message: "Genre retrieved successfully",
            data: genres
        })
    }).catch(err => {
        res.json({
            status: "500",
            message: err.message,
        });
    })
};

exports.new = function (req, res) {
    var genre = new Genre();
    genre.name = req.body.name;

    genre.save()
    .then(dt => {
        Genre.find({_id : dt._id}).exec(function(err, value){
            res.send({
                status: 200,
                message: 'Genre added successfully',
                data: value
            });
        })
        
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: err.message || "Some error occurred while creating the "
        });
    })
};

exports.view = function (req, res) {
    Genre.findById(req.params.genre_id)
    .then(genre => {
        if(!genre){
            return res.send({
                status: 404,
                message: "Genre not found"
            })
        }
        res.send({
            status: 200,
            message: 'Genre retrieved successfully.',
            data: genre
        })
    }).catch(err => {
        if(err.kind === 'objectId') {
            return res.send({
                status: 404,
                message: 'Genre not found.'
            })
        }
        return res.send({
            status: 500,
            message: err.message
        })
    })
};

exports.update = function (req, res) {
    Genre.findByIdAndUpdate(req.params.genre_id, {

        name: req.body.name

    }).then(genre => {
        if(!genre){
            return res.send({
                status: 404,
                message: 'Genre not found.'
            })
        }

        Genre.find().exec(function(err, value){
            res.send({
                status: 200,
                message: 'Genre Updated successfully',
                data: value
            });
        })
    }).catch(err => {
        if(err.kind === 'objectId') {
            return res.send({
                status: 404,
                message: 'Genre not found.'
            })
        }
        return res.send({
            status: 500,
            message: err.message
        })
    })
};

exports.delete = function (req, res) {
    Genre.findByIdAndDelete(req.params.genre_id)
    .then(genre => {
        if(!genre){
            return res.send({
                status: 404,
                message: 'Genre not found.'
            })
        }
        res.send({
            status: 200,
            message: 'Genre deleted successfully.'
        })
    }).catch(err => {
        if(err.kind === 'objectId' || err.name === 'Not found') {
            return res.send({
                status: 404,
                message: 'Genre not found.'
            })
        }
        return res.send({
            status: 500,
            message: err.message
        })
    })
};