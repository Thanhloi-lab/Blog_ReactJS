const jwt = require('jsonwebtoken')

module.exports = ()=>{
    return (req, res, next)=>{
        console.log("authorizing");
        //find jwt in headers
        const token = req.headers['authorization'];
        if(!token){
            return res.status(401).json({error:'Bạn không có quyền truy cập thông tin này.'});
        }else{
            //validate token
            //bearer
            const tokenBody = token.split(' ')[1];

            jwt.verify(tokenBody, process.env.JWT_KEY, (err, decoded)=>{
                if(err){
                    return res.status(401).json({error:'Bạn không có quyền truy cập thông tin này...'});
                }
                req.payload = decoded
                next();
            })
        }

    }
}

