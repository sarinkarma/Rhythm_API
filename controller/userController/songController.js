const Song = require('../../models/song');
const Genre = require('../../models/genre');
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const getMP3Duration = require('get-mp3-duration');
const fs = require('fs');
var path = require('path');

exports.index = function (req, res) {
    Song.find({"tags" : { $in : ['hit']  } }).populate('artist').populate(
        {
            path: 'album', 
            model: 'album',
            populate: {
                path: 'artist',
                model: 'artist'
            }
        })
    .then(songs => {
        var final_songs = []

        songs.map(function(song){
            var genreArr = song.album.genre;
            var buffer = fs.readFileSync(path.join(__dirname, "../../public/files/") + song.file);
            var duration = getMP3Duration(buffer);
            var time = msToTime(duration);

            Genre.find({_id : { $in: genreArr}}).then(response => {
                song.album._doc.genre = response;
                song._doc.time = time;
                final_songs.push(song);

                if(final_songs.length == songs.length){
                    res.send({
                        status: 200,
                        message: "Song retrieved successfully",
                        data: final_songs.sort((a,b)=>b.createdAt-a.createdAt)
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
    Song.findOne({_id: ObjectId(req.params.song_id)}).populate('artist').populate(
        {
            path: 'album', 
            model: 'album',
            populate: {
                path: 'artist',
                model: 'artist'
            }
        })
    .then(song => {
        var genreArr = song.album.genre;

        Genre.find({_id : { $in: genreArr}}).then(response => {
            song.album._doc.genre = response;

            res.send({
                status: 200,
                message: "Song retrieved successfully",
                data: song
            })

        })
    }).catch(err => {
        res.json({
            status: "500",
            message: err.message,
        });
    })
};

exports.getAlbumSongs = function (req, res) {
    Song.find({album: ObjectId(req.params.album_id)}).populate('artist').populate(
        {
            path: 'album', 
            model: 'album',
            populate: {
                path: 'artist',
                model: 'artist'
            }
        })
    .then(songs => {
        var final_songs = []

        songs.map(function(song){
            var genreArr = song.album.genre;
            var buffer = fs.readFileSync(path.join(__dirname, "../../public/files/") + song.file);
            var duration = getMP3Duration(buffer);
            var time = msToTime(duration);

            Genre.find({_id : { $in: genreArr}}).then(response => {
                song.album._doc.genre = response;
                song._doc.time = time;
                final_songs.push(song);

                if(final_songs.length == songs.length){
                    res.send({
                        status: 200,
                        message: "Song retrieved successfully",
                        data: final_songs
                    })

                }
            })

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

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
  
    return mins + ':' + secs;
  }
