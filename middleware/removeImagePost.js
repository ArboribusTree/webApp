const path = require('path')
const fs = require('fs')

function removeImagePost(fileName, uploadPath){
    console.log(uploadPath)
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

module.exports = removeImagePost