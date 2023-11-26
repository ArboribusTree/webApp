const mongoose = require('mongoose')
const path = require('path')
const uploadPath = 'uploads/pfpImages'

//subject to change
const userSchema = new mongoose.Schema({
    bio: String,
    pfp: {
        type: String,
        default: 'defaultPFP.jpg'
    },
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

userSchema.virtual('pfpImagePath').get(function() {
    return this.pfp ? path.join('/', uploadPath, this.pfp) : null 
}) 

module.exports = mongoose.model('User', userSchema)
module.exports.uploadPath = uploadPath