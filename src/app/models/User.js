const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    user_name:{type : String, maxLength:255, required: true, index: { unique: true } },
    password:{type : String, maxLength:600, required: true},
    image_url:{type : String, maxLength:600},
    email:{type : String, maxLength:255, index: { unique: true }},
    display_name:{type : String, maxLength:255},
    songs:[{ type: Schema.Types.ObjectId, ref: 'Song' }],
},{
    timestamps:true
});


UserSchema.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt:true,
});

UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

     
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.generateAuthToken = async function() {

    const user = this
    const token = jwt.sign({
        uid: user._id,
        display_name: user.display_name,
        img_url: user.image_url
    }, process.env.JWT_KEY)
    return token
}

module.exports = mongoose.model('User', UserSchema)

