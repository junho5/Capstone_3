// routes/login.js
// 로그인을 처리하는 라우터
// cookileParser 실습

const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/',(req, res) => {
    console.log(req.signedCookies);
    if (req.signedCookies.admit) res.send('<h1> Login Success </h1>');
    else res.redirect('/login')
});

router.get('/login',(req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
});

// 입력한 login과 password가 guest, 7777이면
// res.cookie로 admit를 true로 전달 후 /로 redirect
router.post('/admit', (req, res) => {
    const {login, password} = req.body;
    console.log(req.body);
    console.log(login, password);

    if (login == 'guest' && password == '7777'){
        res.cookie('admit', true, {
            //expires: new Date(Date.now() + 3000),
            maxAge: 600000, // 시간 설정 (1시간)
            httpOnly: true, // 자바스크립트에선 cookie 조작 불가
            secure: false, // true로 하면 http 전달 x https만 가능
            path: '/', // 모든 path cookie 전달
            signed: true, // 서명 쿠키 설정
        });
        // 동일하게 설정
        // res.clearCookie('admit',true,{
        //     httpOnly:true,
        //     path:'/',
        // });
        res.redirect('/');
    }else{
        res.redirect('/login');
    }
});

module.exports = router;



