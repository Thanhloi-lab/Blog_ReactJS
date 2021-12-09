const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const PlayListSchema = new Schema({
    name:{type : String, maxLength:255, required: true},
    description:{type : String, maxLength:600, required: true},
    image_url:{type : String, maxLength:600, required: true},
    uploader:{type: Object, default:{}},
    songs:[{ type: Schema.Types.ObjectId, ref: 'Song' }],
},{
    timestamps:true
});


PlayListSchema.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt:true,
});

module.exports = mongoose.model('PlayList', PlayListSchema)

