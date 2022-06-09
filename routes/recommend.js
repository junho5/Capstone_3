const express = require('express');
const router = express.Router();
const PythonShell = require('python-shell');

var db_config = require('../config/database.js');
var conn = db_config.init();
//--------------------------------------------------------

// recommend 부분 -----------------------------------------
router.get('/',(req,res)=>{
    res.render('recommend');
});
router.get('/input',(req,res)=>{
    res.render('input');
});
router.get('/output',(req,res)=>{
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

router.post('/output',(req,res)=>{
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()){
        console.log(req.body);
        //평가점수 db 처리 할 부분.
        res.send(`<script type="text/javascript">alert("평가 완료!"); window.location = document.referrer;; </script>`);
    }else{
        res.send('<script type="text/javascript">alert("로그인이 필요한 항목입니다."); window.location = document.referrer;; </script>');  
    }
    
});
//--------------------------------------------------------


module.exports = router;