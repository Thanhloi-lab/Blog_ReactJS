const User = require('../models/User');
const {multipleMongooseToObject} = require('../../util/mongoose');


class UserController{
    //test get list song of user [get] users/show
    show(req, res, next) {
        User.findOne({_id:"61a5f193efb3514d2acc6fe9"}).populate("songs")
        .then(result=> {
            res.json(result);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
    }
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
}

module.exports = new UserController();