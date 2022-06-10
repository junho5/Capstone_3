// import modules
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const dotenv = require('dotenv');
const PythonShell = require('python-shell');
const multer = require('multer')
const multerS3 = require('multer-s3');
dotenv.config();

// db
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
db_config.connect(conn);

// import routers
const loginRouter = require('./routes/index');
// const aboutusRouter = require('./routes/aboutus');
const recommendRouter = require('./routes/recommend');
const detailRouter = require('./routes/detail');
const adminRouter = require('./routes/admin');

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
app.use(cookieParser(process.env.COOKIE_SECRET));

// 요청 경로에 따라 router 실행
app.use('/',loginRouter);
// app.use('/aboutus',aboutusRouter);
app.use('/recommend',recommendRouter);
app.use('/detail',detailRouter);
app.use('/admin',adminRouter);


// search 부분 -------------------------------------------
app.get('/search',(req,res)=>{
    res.redirect('/pasing/' + 1)
});
app.get('/pasing/:cur',(req,res)=>{
    var page_size = 15;
    var page_list_size =10;
    var no = "";
    var totalPageCount =0;
    var sql = 'SELECT count(*) as cnt FROM plant';   
    conn.query(sql, function (err, data) {
        if (err) {
            console.log(err +"mysql 조회 실패");
            return
        }
        totalPageCount = data[0].cnt

        var curPage=req.params.cur;
        console.log("현재페이지: " +curPage,"전체 페이지:" +totalPageCount);
        if (totalPageCount<0){
            totalPageCount =0
        }
       
        var totalPage = Math.ceil(totalPageCount/page_size);
        var totalSet = Math.ceil(totalPage/ page_list_size);
        var curSet = Math.ceil(curPage / page_list_size);
        var startPage = ((curSet-1)*10)+1;
        var endPage = (startPage+page_list_size)-1;

        if (curPage<0){
            no =0
        } else{
            no = (curPage-1) *15
        }
        console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };
        console.log("몇번부터 몇번까지냐~~~~~~~" + no);

        var queryString = 'select * from plant order by plant_num limit ?,?';
            conn.query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                console.log(no,page_size);
                console.log(result2);
                console.log(result);
                res.render('search',{
                    data: result,
                    pasing: result2
                });
        });
    });
});
//--------------------------------------------------------

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

