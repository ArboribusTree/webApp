const  express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('posts/index' )
})

router.post('/', (req, res) =>{
    if(req.cookies){
        
    }
})


module.exports = router