

const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const mysql = require('mysql');  // mysql 모듈 로드
const conn = {  // mysql 접속 설정
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '12341234',
    database: 'ex'
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
    var sql = 'SELECT count(*) as cnt FROM user';   
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

        var queryString = 'select * from user order by id limit ?,?';
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
    var queryString = 'select * from user where id = ?';
    connection.query(queryString,[req.params.id],(error,result)=>{
        console.log(req.params.id);
        res.render('detail',{
            data:result[0]
        });
    });

});
// router.get('/search/:page', function(req, res, next){ // board/list/page숫자 형식으로 받을거
//     var page = req.params.page; // :page 로 맵핑할 req 값을 가져온다
//     var sql = "SELECT id,name from user";
//         connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
//         if(err) console.error("err : " + err);
//         res.render('list.ejs', {title : '게시판 리스트', rows:rows});
//     });
// });


app.listen(app.get('port'),()=>{
    console.log(`http://localhost:${app.get('port')}에서 대기중`);
});




// app.get('/', (req, res) => {
//     const pageNum = Number(req.query.pageNum) || 1; // NOTE: 쿼리스트링으로 받을 페이지 번호 값, 기본값은 1
//     const contentSize = 10; // NOTE: 페이지에서 보여줄 컨텐츠 수.
//     const pnSize = 10; // NOTE: 페이지네이션 개수 설정.
//     const skipSize = (pageNum - 1) * contentSize; // NOTE: 다음 페이지 갈 때 건너뛸 리스트 개수.
  
//     connection.query('SELECT count(*) as `count` FROM `articles`', (countQueryErr, countQueryResult) => {
//       if (countQueryErr) throw countQueryErr;
//       const totalCount = Number(countQueryResult[0].count); // NOTE: 전체 글 개수.
//       const pnTotal = Math.ceil(totalCount / contentSize); // NOTE: 페이지네이션의 전체 카운트
//       const pnStart = ((Math.ceil(pageNum / pnSize) - 1) * pnSize) + 1; // NOTE: 현재 페이지의 페이지네이션 시작 번호.
//       let pnEnd = (pnStart + pnSize) - 1; // NOTE: 현재 페이지의 페이지네이션 끝 번호.
//       connection.query('SELECT * FROM `articles` ORDER BY id DESC LIMIT ?, ?', [skipSize, contentSize], (contentQueryErr, contentQueryResult) => {
//         if (contentQueryErr) throw contentQueryErr;
//         if (pnEnd > pnTotal) pnEnd = pnTotal; // NOTE: 페이지네이션의 끝 번호가 페이지네이션 전체 카운트보다 높을 경우.
//         const result = {
//           pageNum,
//           pnStart,
//           pnEnd,
//           pnTotal,
//           contents: contentQueryResult,
//         };
//         res.render('index', {
//           articles: result,
//         });
//       });
//     });
//   });
  
//   app.get('/view/:id', (req, res) => {
//     const { id } = req.params;
//     connection.query('SELECT * FROM `articles` WHERE id = ?', [id], (err, results) => {
//       if (err) throw err;
//       res.render('view', {
//         article: results[0],
//       });
//     });
//   });