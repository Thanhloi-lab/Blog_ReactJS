import jwt from 'jsonwebtoken'

module.exports = (credentials = [])=>{
    return (req, res, next)=>{
        console.log("authorizing");
        //allow for string or array
        if(typeof credentials === 'string'){
            credentials = [credentials];
        }

        //find jwt in headers
        const token = req.headers['Authorization'];
        if(!token){
            return res.status(401).json({error:'Bạn không có quyền truy cập thông tin này.'});
        }else{
            //validate token
            //bearer
            const tokenBody = token.split(' ')[1];

            jwt.verify(tokenBody, process.env.JWT_SECRET, (err, decoded)=>{
                if(err){
                    console.log(err);
                    return res.status(401).json({error:'Bạn không có quyền truy cập thông tin này'});
                }
                //no err
                if(credentials.length){
                    if(
                        decoded.scopes &&
                        decoded.scopes.length &&
                        credentials.some(cred=>decoded.scopes.indexOf(cred))
                    ){
                        next();
                    }else{
                        return res.status(401).json({error:'Bạn không có quyền truy cập thông tin này.'});
                    }
                }
            })
        }

    }
}

