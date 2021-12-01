const Song = require('../models/Song');
const User = require('../models/User');
const {multipleMongooseToObject} = require('../../util/mongoose');

class SongController {
     //get /Course/:slug
     show(req, res, next) {
        Song.find({_id:"61a5f1b744d9a8bf8574a3bd"}).populate("users")
            .then(song=>
                // res.render('courses/show', {course:mongooseToObject(course)})
                res.json({
                            errCode:0,
                            data:multipleMongooseToObject(song),
                            count:1
                        })
            )
            .catch(next);
    }

    //get songs/create
    create(req, res, next) {
        res.render('courses/create')
    }

    //post songs/store
    store(req, res, next) {
        req.body.uid = req.body.uploader.uid;
        const song = new Song(req.body);
        song.save()
            .then((result)=>{
                User.findOne({ _id: req.body.uploader.uid}, (err, user)=>{
                    if (user){
                        user.songs.push(song);
                        user.save();
                        res.json({
                            "song_id": song._id,
                            "uploaded_date": song.createdAt
                        });
                    }
                    else{
                        res.status(422).json({error: 'Không tìm thấy người dùng này.'})
                    }
                        
                })
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
    }

}

module.exports = new SongController();