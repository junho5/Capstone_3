// routes/login.js
// 로그인을 처리하는 라우터
// urllencoded 실습

const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/',(req, res) => {
    res.redirect('/login')
});

router.get('/login',(req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
});

router
    .route('/admit')
    .get((req, res) => {
        console.log(req.query);
        console.log(req.body);
        res.send(`username: ${req.query.login}<br>
                password: ${req.query.password}`);
    })
    .post((req, res) => {
        console.log(req.query);
        console.log(req.body);
        res.send(`username: ${req.body.login}<br>
                password: ${req.body.password}`);
    })

module.exports = router;



