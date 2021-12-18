const Song = require("../models/Song");
const User = require("../models/User");
const PlayList = require("../models/Playlist");
const dateFunc = require('../../dateFunc');
const {multipleMongooseToObject} = require('../../util/mongoose');

class SongController {
  //post songs/store
  store(req, res, next) {
    User.findOne({ $and: [{ _id: req.body.uploader.uid }] }, (err, user) => {
      if (user) {
        const song = new Song(req.body);
        song
          .save()
          .then(() => {
            user.songs.push(song);
            user.save();
            res.json({
              song_id: song._id,
              uploaded_date: song.createdAt,
            });
          })
          .catch((error) => {
            res.status(500).json({ error: "Lỗi kết nối về máy chủ." });
          });
      } else {
        res.status(422).json({ error: "Không tìm thấy người dùng này." });
      }
    });
  }

  //put songs/update-song
  update(req, res, next) {
    Song.updateOne( {$and:[{ _id: req.body._id, "uploader.uid": req.payload.uid }]}, req.body)
      .then((result) => {
        if(result.modifiedCount>0)
          return res.json({ result: true })
        else
          return res.json({ result: false, message: "Không thể sửa bài hát của người khác"})
      })
      .catch(() => res.status(400).json({ result: false }));
  }

  //Delete songs/delete
  delete(req, res, next) {
    Song.delete({$and:[{ _id: req.body._id, "uploader.uid": req.payload.uid }]})
      .then(() => res.json({ result: true }))
      .catch(() => res.status(400).json({ result: false }));
  }

  //get songs/get-page
  getPage(req, res, next) {
    if (req.query.page) {
      Song.find({})
        .sort("createdAt")
        .skip((req.query.page - 1) * 10)
        .limit(10)
        .then((result) => {
          console.log(result.length);
          res.json(result);
        })
        .catch(() =>
          res.status(500).json({ err: "Có lỗi trong quá trình thực hiện" })
        );
    } else res.status(200).json({ message: "Không tim thấy dữ liệu" });
  }

  //get songs/search
  search(req, res, next) {
    if (req.query.page && req.query.query) {
      const songs = Song.find({ title: new RegExp(req.query.query, "i") })
        .sort("createdAt")
        .skip((req.query.page - 1) * 10)
        .limit(10)
        .then((result) => {
          res.json(result);
        })
        .catch(() =>
          res.status(500).json({ err: "Có lỗi trong quá trình thực hiện" })
        );
    } else res.status(200).json({ message: "Không tim thấy dữ liệu" });
  }

  //get songs/user-song
  userSong(req, res, next) {
    User.findOne({ _id: req.query.uid })
      .populate({
        path: "songs",
        options: {
          limit: 10,
          sort: { createdAt: 1 },
          skip: req.query.page * 10,
        },
      })
      .then((result) => {
        res.json(result.songs);
      })
      .catch((error) => {
        res.status(500).json({ error: "Lối kết nối máy chủ." });
      });
  }

  //get get-songs-of-playlist
  getInPlaylist(req, res, next) {
    if (!req.query.playlist_id) {
      return res
        .status(401)
        .json({ result: false, message: "Khong tìm thấy playlist" });
    } else {
      PlayList.findOne({ _id: req.query.playlist_id })
        .populate("songs")
        .then((result) => {
          if (result) return res.json(result.songs);
          else
            return res
              .status(401)
              .json({ result: false, message: "Khong tìm thấy playlist" });
        })
        .catch((err) =>
          res
            .status(401)
            .json({ result: false, message: "Khong tìm thấy playlist" })
        );
    }
  }

  //put increase-listen-count
  increaseListenCount(req, res, next){
    Song.findById(req.body.song_id, (err, song) => {
      if(err){
        return res.status(500).json({result:false, message:'Lỗi kết nối cơ sở dữ liệu.'})
      }
      if(song){

        song.listenCount.push(new Date());
        song.save();
        return res.json({result :true})
      }
      else{
        return res.json({result :false, message :"Bài hát không tồn tại."})
      }
    })
  }

  //get top-listen
  getTopListen(req, res, next){
    const date = new Date();
    var startDate;
    var stopDate;

    if(req.query.thang==='1'){
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      stopDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    if(req.query.nam==='1'){
      startDate = new Date(new Date().getFullYear(), 0, 1);
      stopDate = new Date(new Date().getFullYear(), 11, 31);
    }

    Song.find({ listenCount : { $elemMatch: { $gte: startDate,  $lt: stopDate} } })
      .then(result=>{
        var songs = result.map(song=>song.toObject());
        songs.forEach(song=>{ 
          song.listenCount = dateFunc.getDates(startDate, stopDate, song.listenCount).length
          return song;
        })
        songs.sort((a, b) => b.listenCount - a.listenCount)

        return res.json(songs.slice(0, 50))
      })
      .catch((err)=>res.json({result:false, message:"Lỗi kết nối cơ sở dữ liêu."}))
    

  }
  
}

module.exports = new SongController();
