const PlayList = require('../models/Playlist');
const Song = require('../models/Song');
const User = require('../models/User');

class PlayListController
{
    store(req, res, next) {

        User.findOne({$and:[{ _id: req.body.uploader.uid}, {display_name: req.body.uploader.name}]}, (err, user)=>{
            if(user){
                const playList = new PlayList (req.body);
                playList.save()
                    .then(()=>{
                       
                        playList.save();
                        res.json({
                            "playlist_id": playList._id
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
    update(req, res, next) {

        PlayList.updateOne({_id: req.body.playlist_id}, req.body)
        .then(()=>res.json({result: true}))
        .catch(()=>res.status(400).json({result: false}))
        
    }

    delete(req, res, next) {

        PlayList.deleteOne({_id: req.body.playlist_id})
        .then(()=>res.json({result: true}))
        .catch(()=>res.status(400).json({result: false}))
        
    }
    getPlayList(req, res, next)
    {
        PlayList.findOne({_id: req.body.playlist_id}).then(
                result => {
                const playList = new PlayList (result);
                res.status(200).json(  playList);})
        .catch((err) => {console.log(err); res.status(404).json(null)})
    }
    getUserPlayList(req, res, next){
        PlayList.find({"uploader.uid" : req.body.uid}).sort('name').limit(10)
                .then(result=>{res.status(200).json(result)})
                .catch(()=>res.status(500).json({err:"Có lỗi trong quá trình thực hiện"}))
    }
}
module.exports = new PlayListController();