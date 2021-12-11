const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://khang:bao123456@cluster0.sd6xi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('connect successfully');
    }catch(err){
        console.log('connect failure!');
    }
}

module.exports = {connect};
