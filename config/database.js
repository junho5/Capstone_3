var mysql = require('mysql');
var db_info = {
    host: "plant-db.cjqrer98lofr.ap-northeast-2.rds.amazonaws.com",
    user: "admin",
    password: "capstone3",
    database: "plantDB",
    port: "3306"
}

module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}