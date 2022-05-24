const express = require('express');
const path = require('path');
const router = express.Router();

var db_config = require('../config/database.js');
var conn = db_config.init();

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
router.post('/admit', (req, res) => {
    var web_id = req.body['web_id'];
    var web_password = req.body['web_password'];
    if (web_id &&  web_password){
        conn.query('select * from user where web_id=? and web_password=?', [web_id,web_password], (err, data) => {
            if (err) throw err;
            if (data.length > 0 ){
                res.redirect('main')
                res.end();
            }else {              
                res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>');    
            }            
        });
    } else {        
        res.send('<script type="text/javascript">alert("web_id과 web_password를 입력하세요!"); document.location.href="/login";</script>');    
        res.end();
    }
});



// 회원가입 관련 라우터
router.get('/join',(req,res)=>{
    res.render('join');
});
router.post('/new_user', function(req, res) {
    var web_id = req.body.web_id;
    var web_password = req.body.web_password;
    var web_password_check = req.body.web_password_check;
    var email = req.body.email;
    var user_name = req.body.user_name;
    console.log(web_id, web_password, email);
    if (web_id && web_password && email) {
        conn.query('SELECT * FROM user WHERE web_id = ? AND web_password = ? AND email = ?', [web_id, web_password, email], function(error, data, fields) {
            if (error) throw error;
            if (data.length <= 0 && web_password==web_password_check) {
                conn.query('INSERT INTO user (web_id, web_password, email, user_name) VALUES(?,?,?,?)', [web_id, web_password, email, user_name],
                function (error, data) {
                    if (error)
                    console.log(error);
                    else
                    console.log(data);
                });
                  res.send('<script type="text/javascript">alert("회원가입을 환영합니다!"); document.location.href="/login";</script>');    
            } else if(web_password!=web_password_check){                
                res.send('<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); document.location.href="/join";</script>');    
            }
            else {
                res.send('<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); document.location.href="/join";</script>');    
            }            
            res.end();
        });
    } else {
        res.send('<script type="text/javascript">alert("모든 정보를 입력하세요"); document.location.href="/join";</script>');    
        res.end();
    }
});

module.exports = router;