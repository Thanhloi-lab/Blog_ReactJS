const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://Nigga:6nigga@cluster0.moas0.mongodb.net/Song?retryWrites=true&w=majority',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('connect successfully');
    }catch(err){
        console.log('connect failure!');
    }
}

module.exports = {connect};