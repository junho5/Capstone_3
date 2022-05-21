

const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const mysql = require('mysql');  // mysql 모듈 로드
const conn = {  // mysql 접속 설정
    host: "plant-db.cjqrer98lofr.ap-northeast-2.rds.amazonaws.com",
    user: "admin",
    password: "capstone3",
    database: "plantDB",
    port: "3306"
};
const connection = mysql.createConnection(conn); // DB 커넥션 생성
connection.connect();   // DB 접속

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
app.get('/recommend/input',(req,res)=>{
    res.render('input');
});
app.post('/recommend/input',(req,res)=>{
    console.log(req.body);
    res.send(req.body);
    res.end();
    
});
app.get('/login',(req,res)=>{
    res.render('login');
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
    connection.query(sql, function (err, data) {
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
            connection.query(queryString, [no, page_size], function (error, result) {
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
    connection.query(queryString,[req.params.id],(error,result)=>{
        console.log(result);
        res.render('detail',{
            data:result[0]
        });
    });

});



app.listen(app.get('port'),()=>{
    console.log(`http://localhost:${app.get('port')}에서 대기중`);
});

