const express = require('express');
const path = require('path');
const router = express.Router();

var db_config = require('../config/database.js');
var conn = db_config.init();
db_config.connect(conn);

// 메인화면 관련 라우터
router.get('/',(req,res)=>{
    res.redirect('main');
});

router.get('/main',(req,res)=>{
    res.render('main');
});

// 로그인 관련 라우터
router.get('/login',(req,res)=>{
    res.render('login');
});
// router.post('/admit',(req,res)=>{
//     console.log(req.body);
//     res.send(req.body);
//     res.end();
// });
router.post('/admit', (req, res) => {
    var web_id = req.body['web_id'];
    var web_password = req.body['web_password'];
    console.log(web_id)

    conn.query('select * from user where web_id=?', [web_id], (err, data) => {
        if (err) throw err
        if (web_id == data[0].web_id && web_password == data[0].web_password) {
            console.log('로그인 성공');
            res.render('main')
        } else {
            console.log('로그인 실패');
            res.render('join');
        }
    });
});

// 회원가입 관련 라우터
router.get('/join',(req,res)=>{
    res.render('join');
});
router.post('/join',(req,res)=>{
    res.send('join post 테스트');
});

module.exports = router;