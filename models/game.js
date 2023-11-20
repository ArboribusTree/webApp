const mongoose = require('mongoose') 
const path = require('path') 
const uploadPath = '/uploads/gameImages'

const gameSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    genre: String,
    image: String
}) 

gameSchema.virtual('imagePath').get(function () {
    if (this.image) {
        return path.join(uploadPath, this.image) 
    }
    return null 
}) 

module.exports = mongoose.model('Game', gameSchema) 
module.exports.uploadPath = uploadPath
