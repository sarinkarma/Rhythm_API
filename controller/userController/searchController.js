const Song = require('../../models/song');
const Genre = require('../../models/genre');
const getMP3Duration = require('get-mp3-duration');
const fs = require('fs');
var path = require('path');
const Artist = require('../../models/artist');
const Album = require('../../models/album');

exports.search = async function(req, res){
    var result = {};
    var searchValue = new RegExp(req.body.search, 'i');

    await Genre.find({name: searchValue})
    .then(async genre =>{
        result.genres = genre
    })

    await Album.find({name: searchValue}).populate('artist')
    .then(async album =>{
        if(album.length !== 0){ 
            albumGenre(album, function(data){
                result.albums = data;
            })
        }else{
            result.albums = [];
        }
    })

    await Song.find({name: searchValue})
    .populate('artist')
    .populate(
        {
            path: 'album', 
            model: 'album',
            populate: {
                path: 'artist',
                model: 'artist'
            }
        })
    .then(async val =>{
        if(val.length !== 0){ 
            songGenre(val, function(data){
                result.songs = data;
            })
        }else{
            result.songs = [];
        }
    })

    await Artist.find({name: searchValue})
    .then(async artist =>{
        result.artists = artist
    })        

    res.send({
        status: 200,
        message: "Search retrieved successfully",
        data: result
    })
}

function albumGenre(albums, callback){
    var albs = [];
    albums.map(function (item){
        var genreArr = item.genre;

        Genre.find({_id : { $in: genreArr}}).then(response => {
            item._doc.genre = response;
            albs.push(item);

            if(albs.length == albums.length){
                callback(albs);
            }
        })
    })
}

function songGenre(songs, callback){
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
                callback(final_songs);
            }
        })

    })
}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
  
    return mins + ':' + secs;
  }