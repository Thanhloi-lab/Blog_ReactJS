const User = require('../models/User');
const Song = require('../models/Song');


class UserController{
    //[post] 
    login(req, res, next){
        User.findOne({user_name: req.body.user_name})
            .then(user=>{
                if(user){
                    user.comparePassword(req.body.password, (err, isMatch)=>{
                        if(err) return res.status(401).json({err: 'Tài khoản hoặc mật khẩu không đúng.'});
                        user.generateAuthToken()
                            .then(token =>{
                                return res.json({jwt:token});
                            })   
                    })
                }
                else
                    return res.status(401).json({err: 'Tài khoản hoặc mật khẩu không đúng.'});
            })
            .catch(next);
    }
    //[post] store user
    store(req, res, next){
        if(req.body.password !== req.body.confirm_password)
            return res.status(401).json({err: 'Xác nhận mật khẩu không đúng.'});
        Promise.all([
                    User.findOne({user_name: req.body.user_name}),
                    User.findOne({email: req.body.email})])
                .then(([checkUserName, checkEmail])=>{
                    if(checkUserName) return res.status(401).json({err:'Tài khoản đã được dùng.'});
                    if(checkEmail) return res.status(401).json({err:'Email đã được dùng.' });
                    
                    const user = new User(req.body);
                    user.save(err=>{
                        if(err) return res.status(401).json(err);
                        res.json({message:"Tạo thành công."});
                    })
                })
                .catch((error) => {
                    res.status(500).json({err:'Lỗi kết nối hệ thống.' });
                });
    }
    //put users/edit
    edit(req, res, next){
        if(req.body){
            const oldValue = 
            User.updateOne({_id:req.payload.uid}, req.body)
                .then((user)=>{
                    // User.findOne({_id:req.payload.uid}).populate('songs')
                    //     .then((userWithSongs)=>{
                    //         userWithSongs.songs.map(song=>song.uploader.name=userWithSongs.display_name)
                    //     })
                    Song.updateMany({'uploader.uid': req.payload.uid}, {'uploader.name': req.body.display_name})
                        .then(()=>{
                            return res.json({result:true})
                        })
                        .catch((err)=>{

                            return res.status(400).json({result:false})
                        })
                })
                .catch(()=>{

                    return res.status(400).json({result:false})
                })
        }
        else
            res.status(200).json({result:true });

    }
    //put users/change-password
    changePassword(req, res, next){
        if(req.body.password === req.body['confirm-password']){
            User.findOne({_id:req.payload.uid})
                .then((user)=>{
                    
                    user.password = req.body.password;
                    user.save();
                    res.json({result:true})
                })
                .catch(err=>res.json({result:false}))

        }else
            res.json({result:false, message:'Nhập lại mật khẩu không đúng.'})
    }
}

module.exports = new UserController();