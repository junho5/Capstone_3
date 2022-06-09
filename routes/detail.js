const express = require('express');
const router = express.Router();

var db_config = require('../config/database.js');
var conn = db_config.init();
//--------------------------------------------------------

// detail 부분 -------------------------------------------
router.get('/:id',(req,res)=>{
    console.log(req.params.id);
    var queryString = 'select * from plant where plant_num = ?';
    conn.query(queryString,[req.params.id],(error,result)=>{
        console.log(result);
        var sql = "select * from comment where plant_num = ? "
        conn.query(sql,[parseInt(req.params.id)], (err,comments)=>{
            console.log(comments);
            res.render('detail',{
                data:result[0],
                comments:comments
            });
        })
        
    });

});
//--------------------------------------------------------


module.exports = router;