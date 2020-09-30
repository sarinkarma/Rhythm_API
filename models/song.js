const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    file: String,
    tags: [{
      type: String,
    }],
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'artist'
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'album'
    }
},
{
  timestamps: true
});

const Song = mongoose.model('song', songSchema);
module.exports = Song;