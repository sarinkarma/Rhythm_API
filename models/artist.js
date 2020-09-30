const mongoose = require('mongoose')

const artistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: String
},
{
  timestamps: true
});

const Artist = mongoose.model('artist', artistSchema);
module.exports = Artist;