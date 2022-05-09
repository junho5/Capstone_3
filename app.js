const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');

app.set('port', process.env.Port || 3000);
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/',(req,res)=>{
    res.render('main');
});
app.get('/aboutus',(req,res)=>{
    res.render('aboutUs');
});
app.get('/recommend',(req,res)=>{
    res.render('recommend');
});

app.listen(app.get('port'),()=>{
    console.log(`http://localhost:${app.get('port')}에서 대기중`);
});

var mysql = require("mysql"); // mysql 모듈을 불러옵니다.

// 커넥션을 정의합니다.
// RDS Console 에서 본인이 설정한 값을 입력해주세요.
var connection = mysql.createConnection({
  host: "plant-db.cjqrer98lofr.ap-northeast-2.rds.amazonaws.com",
  user: "admin",
  password: "capstone3",
  database: "plantDB"
});

// RDS에 접속합니다.
connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
});
connection.query("SELECT * FROM user", function(err, rows, fields) {
    console.log(rows); // 결과를 출력합니다!
});
connection.end();

