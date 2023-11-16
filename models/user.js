const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    profileDescription: String,
    followingGames: [String],
    following: [mongoose.SchemaTypes.ObjectId],
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('User', userSchema)