const mongoose=require('mongoose');

const Location= mongoose.model('Location', {
    lat: String,
    long: String
});

module.exports=Location;