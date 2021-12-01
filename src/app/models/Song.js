const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const SongSchema = new Schema({
    title:{type : String, maxLength:255, required: true},
    audio_url:{type : String, maxLength:600, required: true},
    image_url:{type : String, maxLength:600, required: true},
    duration:{type : Number, default:0},
    uploader:{type: Object, default:{}}
},{
    timestamps:true
});


SongSchema.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt:true,
});

module.exports = mongoose.model('Song', SongSchema)

