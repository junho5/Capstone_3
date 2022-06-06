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

// aws
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
module.exports = s3;

// upload
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'plant-imageset',
      acl: 'public-read-write',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        var sql = "select AUTO_INCREMENT as id_num from information_schema.tables where table_name = 'plant' AND table_schema = DATABASE()"
        conn.query(sql,function(err,data){
            if (err){
                console.log("실패")
              }else{
                const ext = path.extname(file.originalname);//업로드 파일이름을 원본 파일이름 +시간+확장자로 저장
                console.log(data[0].id_num);
                cb(null, data[0].id_num+ext);
        }
        }
    )},
    }),
});

// db
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
db_config.connect(conn);

// import routers
const loginRouter = require('./routes/index');
const { text } = require('express');


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


// app.get('/aboutus',(req,res)=>{
//     res.render('aboutUs');
// });

app.get('/recommend',(req,res)=>{
    res.render('recommend');
});
app.get('/recommend/input',(req,res)=>{
    res.render('input');
});
app.get('/recommend/output',(req,res)=>{
    console.log(req.body);
    var inputQuery = req.query
    var sql = "SELECT * FROM plant"
    conn.query(sql, function (err, inputData) {
        if (err) {
            console.log(err +"mysql 조회 실패");
            return
        }else{
            var options = {
                mode: 'text',
                pythonPath: '',
                pythonOptions: ['-u'],
                scriptPath: 'public/',
                args: ['value1', JSON.stringify({inputQuery}), JSON.stringify({inputData})]
              };
            //   console.log(inputData)
            PythonShell.PythonShell.run('test.py', options, function (err, results) {
                if (err) {
                    console.log(err);
                }else {
                    res.render('output',{
                        Data: JSON.parse(results)});
                    console.log(JSON.parse(results));
                }
          });

        }
    });    
});

app.post('/recommend/output',(req,res)=>{
    // backURL=req.header()
    console.log(req.body);
    //평가점수 db 처리 할 부분.
    res.send(`<script type="text/javascript">alert("평가 완료!"); window.location = document.referrer;; </script>`);
    
});

app.get('/search',(req,res)=>{
    res.redirect('/pasing/' + 1)
    
    // res.redirect('/search/1');
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

app.get('/detail/:id',(req,res)=>{
    console.log(req.params.id);
    var queryString = 'select * from plant where plant_num = ?';
    conn.query(queryString,[req.params.id],(error,result)=>{
        console.log(result);
        res.render('detail',{
            data:result[0]
        });
    });

});
// comment 부분 추가 예정


//--------------------------------------------------------
app.get('/admin', (req,res)=>{
    var sql = "select AUTO_INCREMENT as id_num from information_schema.tables where table_name = 'plant' AND table_schema = DATABASE()"
    conn.query(sql, function(err, id_num){
        if (err) {
            console.log(err +"mysql 조회 실패");
            return
        }else{
            var sql = "select * from plant"
            conn.query(sql, function(err, data){
                if (err) {
                    console.log('mysql 조회 실패');

                }else{
                    res.render('admin',{id_num: id_num, data: data});
                    // console.log(data);

                }
            })

        }
    });
});
app.post('/admin',upload.single('file'),(req,res)=>{
    console.log(req.body);
    console.log(req.file,req.body);
    var sql = "INSERT INTO plant(plant_num,cluster_num,plant_name,light,temp,water,height,width,poison,image,comment) VALUES(null,1,?,?,?,?,?,?,?,?,'comment')"
    conn.query(sql,[req.body.name,parseInt(req.body.light),parseInt(req.body.temp),parseInt(req.body.water),parseInt(req.body.height),parseInt(req.body.width), parseInt(req.body.poison),req.body.image],function(err,rows){
      if(err){
        console.log("upload 실패");
      } else{
        console.log(rows.insertId);
        res.redirect('/upload');

      }
      
    })
})

// app.post('/admin', upload.single('image'));


// app.post('/admin', (req,res)=>{
//     res.send(req.body);
//     console.log(req.body);
//     // res.redirect('/admin')
// });
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

