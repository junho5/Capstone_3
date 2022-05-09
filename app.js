const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();

db_config.connect(conn);

app.set('port', process.env.Port || 3000);
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/',(req,res)=>{
    res.render('main');
});
// sql 테스트 부분 
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

app.listen(app.get('port'),()=>{
    console.log(`http://localhost:${app.get('port')}에서 대기중`);
});

