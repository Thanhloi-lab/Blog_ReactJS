const Song = require('../models/Song');
const User = require('../models/User');


class SongController {
    //post songs/store
    store(req, res, next) {

        User.findOne({$and:[{ _id: req.body.uploader.uid}]}, (err, user)=>{
            if(user){
                const song = new Song(req.body);
                song.save()
                    .then(()=>{
                        user.songs.push(song);
                        user.save();
                        res.json({
                            "song_id": song._id,
                            "uploaded_date": song.createdAt
                        });   
                    })
                    .catch((error) => {
                        res.status(500).json({ error:"Lỗi kết nối về máy chủ." });
                    });
            }else{
                res.status(422).json({error: 'Không tìm thấy người dùng này.'})
            }
        })
        
    }

    //put songs/update-song
    update(req, res, next){
        Song.updateOne({_id: req.body._id}, req.body)
            .then(()=>res.json({result: true}))
            .catch(()=>res.status(400).json({result: false}))
    }

    //Delete songs/delete
    delete(req, res, next){
        Song.delete({_id: req.body.song_id})
            .then(()=>res.json({result: true}))
            .catch(()=>res.status(400).json({result: false}))
    }

    //get songs/get-page
    getPage(req, res, next){
        if(req.query.page)
        {
            Song.find({}).sort('createdAt').skip((req.query.page-1) * 10).limit(10)
                .then(result=>{
                    console.log(result.length);
                    res.json(result)
                })
                .catch(()=>res.status(500).json({err:"Có lỗi trong quá trình thực hiện"}))
        }
        else
            res.status(200).json({message:"Không tim thấy dữ liệu"})
    }

    //get songs/search
    search(req, res, next){
        if(req.query.page && req.query.query){
            const songs = Song.find({'title': new RegExp(req.query.query, "i")})
                .sort('createdAt')
                .skip((req.query.page-1) * 10).limit(10)
                .then(result=>{
                    res.json(result);
                })
                .catch(()=>res.status(500).json({err:"Có lỗi trong quá trình thực hiện"}))
        }
        else
            res.status(200).json({message:"Không tim thấy dữ liệu"})
    }

    //get songs/user-song
    userSong(req, res, next){
        User.findOne({_id:req.query.uid}).populate({
                path:"songs",
                options:{
                    limit: 10,
                    sort:{createdAt:1},
                    skip: req.query.page
                }
            })
            .then(result=> {
                res.json(result.songs);
            })
            .catch((error) => {
                res.status(500).json({ error:"Lối kết nối máy chủ." });
            });
    }
}


module.exports = new SongController();