const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const SongInPlayListSchema = new Schema({
    song: { type: Schema.Types.ObjectId, ref: 'Song' },
    playlist: { type: Schema.Types.ObjectId, ref: 'PlayList' },
},{
    timestamps:true
});


SongInPlayListSchema.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt:true,
});

module.exports = mongoose.model('SongInPlayList', SongInPlayListSchema)

