// import modules
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// aws
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
module.exports = s3;

// db
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();

db_config.connect(conn);

// import routers
const loginRouter = require('./routes/index');


const app = express();
app.set('port', process.env.Port || 3000);
app.set('view engine', 'pug');
app.set('views',path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
// app.use(cookieParser(process.env.COOKIE_SECRET));

// app.use(
//     session({
//         resave: false,
//         saveUninitialized: false,
//         secret: process.env.COOKIE_SECRET,
//         cookie: {
//             httpOnly: true,
//             secure: false,
//             maxAge: 600000,
//         },
//         name: 'master_check-session-cookie',
//     })
// );

// 요청 경로에 따라 router 실행
app.use('/',loginRouter);


app.get('/aboutus',(req,res)=>{
    testQuery = "SELECT * FROM user";
    conn.query(testQuery, function (err, results, fields) {
    if (err) {
        console.log(err);
    }
    console.log(results);
});
    res.render('aboutUs');
});

app.get('/recommend',(req,res)=>{
    res.render('recommend');
});
app.get('/recommend/input',(req,res)=>{
    res.render('input');
});
app.post('/recommend/input',(req,res)=>{
    console.log(req.body);
    res.send(req.body);
    res.end();
});

app.get('/search',(req,res)=>{
    res.redirect('/pasing/' + 1)
});

// 404 에러처리 미들웨어 (사용자 요청이라서 500위에 작성)
app.use((req, res, next) => {
    res.status(404).send(`${req.method} ${req.path} is NOT FOUND`);
  });
  
  // 서버 에러처리 미들웨어
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
  });
  
  app.listen(app.get('port'), () => {
    console.log(`http://localhost:${app.get('port')}에서 대기중`);
  });

