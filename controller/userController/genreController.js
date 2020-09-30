const Genre = require('../../models/genre');
const Album = require('../../models/album');

exports.index = function (req, res) {
    Genre.aggregate([{$sample: {size: 10}}])
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

exports.album = function(req, res) {
    Album.find({"genre" : { $in : [req.params.genre_id]  } }).populate('artist')
    .then(albums => {
        var albs = [];    

        albums.map(function (item){
            var genreArr = item.genre;
            console.log(genreArr)

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
}