const path = require('path')

function removeImagePost(fileName, uploadPath){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}