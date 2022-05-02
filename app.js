

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
