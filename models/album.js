const mongoose = require('mongoose')

const albumSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: String,
    release_date: String,
    copyright: String,
    genre: [{
      type: String,
    }],
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'artist'
    },
},
{
  timestamps: true
});

const Album = mongoose.model('album', albumSchema);
module.exports = Album;