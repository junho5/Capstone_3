const express = require('express');
const router = express.Router();

//--------------------------------------------------------
const session = require('express-session')
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
//--------------------------------------------------------

var db_config = require('../config/database.js');
var conn = db_config.init();
//--------------------------------------------------------
router.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "capstone",
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: 'login_maintain',
    })
);
router.use(passport.initialize());
router.use(passport.session());
//--------------------------------------------------------
router.use((req, res, next) =>{
    res.locals.user = req.user;
    next();
});
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

router.get('/logout', (req, res) => {
    req.logout(() => {
      req.session.destroy();
      res.redirect('/login');
    });
});

router.get('/aboutUs',(req,res)=>{
    console.log(req.isAuthenticated())
    res.render('aboutUs');
});

//--------------------------------------------------------
passport.serializeUser(function(user, done) {
    console.log("serializeUser ", user)
    done(null, user.web_id);
  });
  
passport.deserializeUser(function(id, done) {
    console.log("deserializeUser id ", id)
    var userinfo;
    var sql = 'SELECT * FROM user WHERE web_id=?';
    conn.query(sql , [id], function (err, result) {
    if(err) console.log('mysql 에러');     
    
    console.log("deserializeUser mysql result : " , result);
    var json = JSON.stringify(result[0]);
    userinfo = JSON.parse(json);
    done(null, userinfo);
    })    
});

passport.use(new LocalStrategy({
    usernameField: 'web_id',
    passwordField: 'web_password'
  },
  function(username, password, done) {
    var sql = 'SELECT * FROM user WHERE web_id=? AND web_password=?';
    conn.query(sql , [username, password], function (err, result) {
      if(err) console.log('mysql 에러');  

      // 입력받은 ID와 비밀번호에 일치하는 회원정보가 없는 경우   
      if(result.length === 0){
        console.log("결과 없음");
        return done(null, false, { message: 'Incorrect' });
      }else{
        console.log(result);
        var json = JSON.stringify(result[0]);
        var userinfo = JSON.parse(json);
        console.log("userinfo " + userinfo);
        return done(null, userinfo);  // result값으로 받아진 회원정보를 return해줌
      }
    })
  }
));
router.post('/admit',passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/join'
    })
);


// 회원가입 관련 라우터
router.get('/join',(req,res)=>{
    res.render('join');
});
router.post('/new_user', function(req, res) {
    var user_name = req.body.user_name;
    var web_id = req.body.web_id;
    var web_password = req.body.web_password;
    var web_password_check = req.body.web_password_check;
    var email = req.body.email;
    console.log(user_name, web_id, web_password, web_password_check, email);
    if (web_id && web_password && email) {
    conn.query('SELECT * FROM user WHERE user_name = ? AND web_id = ? AND web_password = ? AND email = ?', 
    [user_name, web_id, web_password, email], function(err, data, fields) {
        if (err) throw err;
        if (data.length <= 0 && web_password==web_password_check) {
            conn.query('INSERT INTO user (user_name, web_id, web_password, email) VALUES(?,?,?,?)', 
            [user_name, web_id, web_password, email],
            function (err, data) {
                if (err)
                console.log(err);
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