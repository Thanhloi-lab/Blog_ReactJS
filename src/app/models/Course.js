const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const CourseSchema = new Schema({
    name:{type : String, maxLength:255},
    description:{type : String, maxLength:600},
    image:{type : String, maxLength:255},
    slug:{type : String, slug:'name', unique:true},
    videoId:{type : String, maxLength:255},
    level:{type : String, maxLength:255}
},{
    timestamps:true
});

//Custom query helpers
CourseSchema.query.sortable = function(req){
    if(req.query.hasOwnProperty('_sort')){
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidType ? req.query.type : 'desc'
        });
    }
    return this;
}

CourseSchema.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt:true,
});
mongoose.plugin(slug);


module.exports = mongoose.model('Course', CourseSchema)