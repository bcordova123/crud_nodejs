const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    //res.send('Index');
    res.render('index');
});
router.get('/about', function(req, res){
    //res.send('About');
    res.render('about');
});
module.exports = router;