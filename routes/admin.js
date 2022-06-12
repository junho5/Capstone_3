const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer')
const multerS3 = require('multer-s3');
const path = require('path');


var db_config = require('../config/database.js');
var conn = db_config.init();

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
        })
      },
    }),
});
//--------------------------------------------------------

// 관리자 부분 ----------------------------------------------
router.get('/', (req,res)=>{
    if (req.isAuthenticated()){
        if (req.user.web_id =="master" && req.user.web_password=="0000"){
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
        }else{
            res.send('<script type="text/javascript">alert("관리자만 접근할수있습니다."); document.location.href="/main";</script>');
        }
    }else{
        res.send('<script type="text/javascript">alert("관리자만 접근할수있습니다."); document.location.href="/main";</script>');
    }
});
router.post('/',upload.single('file'),(req,res)=>{
    console.log(req.body);
    console.log(req.file,req.body);
    var sql = "INSERT INTO plant(plant_num,cluster_num,plant_name,light,temp,water,height,width,poison,image,comment) VALUES(null,1,?,?,?,?,?,?,?,?,'comment')"
    conn.query(sql,[req.body.name,parseInt(req.body.light),parseInt(req.body.temp),parseInt(req.body.water),parseInt(req.body.height),parseInt(req.body.width), parseInt(req.body.poison),req.body.image],function(err,rows){
      if(err){
        console.log(err)
        console.log("upload 실패");
      } else{
        console.log(rows.insertId);
        // res.redirect('/upload');
        res.redirect('/admin')

      }
      
    })
})
//--------------------------------------------------------


module.exports = router;