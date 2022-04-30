// routes/upload.js
// 파일 업로드를 처리하는 라우터

const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, '../public/upload.html'))
})

module.exports = router;



