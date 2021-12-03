const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/Musik_App',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('connect successfully');
    }catch(err){
        console.log('connect failure!');
    }
}

module.exports = {connect};