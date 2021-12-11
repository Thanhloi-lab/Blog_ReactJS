const User = require('../models/User');
const Song = require('../models/Song');
const nodeMailer = require('nodemailer');
const sysEmail = require('../../sys_email');


class UserController{
    //[post] 
    login(req, res, next){
        User.findOne({user_name: req.body.user_name})
            .then(user=>{
                if(user){
                    user.comparePassword(req.body.password, (err, isMatch)=>{
                        if(err) return res.status(401).json({err: 'Lỗi không xác minh được tài khoản.'});
                        if(isMatch)
                            user.generateAuthToken()
                                .then(token =>{
                                    return res.json({jwt:token});
                                })   
                        else{
                            return res.status(401).json({err: 'Tài khoản hoặc mật khẩu không đúng.'});
                        }
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
            User.findOneAndUpdate({_id:req.payload.uid}, req.body)
                .then((user)=>{
                    Song.updateMany({'uploader.uid': req.payload.uid}, {'uploader.name': req.body.display_name})
                        .then(()=>{
                            return user;
                        })
                        .catch((err)=>{

                            return res.status(400).json({result:false})
                        })
                })
                .catch(()=>{

                    return res.status(400).json({result:false})
                })
                .finally(() => {
                    User.findOne({_id: req.payload.uid})
                        .then(user=>{
                            user.generateAuthToken()
                                .then(token =>{
                                    return res.json({result:true, jwt:token});
                                }) 
                                .catch((err)=>res.status(400).json({result:true, jwt:'cannot generare jwt'}))
                        })
                        .catch((err)=>res.status(400).json({result:true, jwt:'cannot generare jwt'}))
                });

            
        }
        else
            res.status(200).json({result:true });

    }
    //put users/change-password
    changePassword(req, res, next){
        if(req.body.password === req.body['confirm-password']){
            User.findOne({_id:req.payload.uid})
                .then((user)=>{
                    user.comparePassword(req.body.old_password, (err, isMatch)=>{
                        if(isMatch){
                            user.password = req.body.password;
                            user.save();
                            return res.json({result:true})
                        }
                        else
                            return res.json({result:false, message:"Mật khẩu hiện tại không chính xác."})
                    })
                    
                })
                .catch(err=>res.json({result:false}))

        }else
            res.json({result:false, message:'Nhập lại mật khẩu không đúng.'})
    }

    //get songs/send-forgot-code
    sendCode(req, res, next){
        if(req.body.email){
            User.findOne({email:req.body.email})
                .then((user)=>{
                    if(user){
                        var transporter = nodeMailer.createTransport({
                            host:'smtp.gmail.com',
                            port: 587,
                            secure: false,
                            auth: {
                              user: sysEmail.Email,
                              pass: sysEmail.password
                            }
                        });
                        
                        const code = sysEmail.getCode();
                        var mailOptions = {
                            from: '"Nodemailer Contact" <mypersonalaccount@gmail.com>',
                            to: req.body.email,
                            subject: 'Restore code',
                            text: 'Mã khôi phục của bạn là: ' + code
                        };
            
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                return res.status(400).json({result:false});
                            } else {
                                let now = sysEmail.expiredDate(new Date(), 10);
                                user.restoreCode = {
                                    code:code.toString(),
                                    timeExpired:now
                                };
                                user.save()
                                    .then(()=>res.json({result:true}))
                                    .catch(()=>res.status(400).json({result: false, message:'Có lỗi trong quá trình gửi mã xác nhận'}))
                            }
                        });
                    }
                    else{
                        return res.status(400).json({result:false, message:'Không tìm thấy người dùng.'});
                    }
                })
                .catch(()=>res.status(500).json({result:false, message:'Lỗi truy cập hệ thống'}))
        }
    }

    //put /uses/confirm-code
    resetPassword(req, res, next){
        if(req.body.password !== req.body.confirm_password)
            res.status(410).json({result:false, message:'Nhập lại mật khẩu không chính xác'})
        if(req.body.email && req.body.code){
            User.findOne({email:req.body.email})
                .then((user)=>{
                    if(user){
                        let now = new Date();
                        if(!user.restoreCode.code || !user.restoreCode.timeExpired)
                        {
                            return res.status(410).json({result:false, message:'Không có mã'})
                        }
                        if(user.restoreCode.code !== req.body.code &&
                             user.restoreCode.timeExpired < now){
                            return res.status(410).json({result:false, message:'Mã xác thực không tồn tại.'})
                        }
                        else{
                            user.password = req.body.password
                            user.restoreCode = {};
                            user.save()
                                .then(()=>res.json({result:true, message:'Đổi mật khẩu thành công'}))
                                .catch(()=>res.json({result:false, message:'Có lỗi xảy ra, thử lại sau'}))
                        }
                    }
                    else{
                        return res.status(400).json({result:false, message:'Không tìm thấy người dùng.'});
                    }
                })
                .catch(()=>res.status(500).json({result:false, message:'lỗi truy cập hệ thống.'}))
        }
    }
}

module.exports = new UserController();
