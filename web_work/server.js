var http = require("http");
var express = require("express");
var static=require("serve-static");
var ejs=require("ejs");
var mymodule=require("./lib/library.js");
var path=require("path");

var multer=require("multer");
var upload = multer({
    storage:multer.diskStorage({
        destination:function(request, file, cb){
            cb(null,__dirname+"/static/upload");
        },
        filename:function(request, file, cb){
            cb(null,new Date().valueOf()+path.extname(file.originalname));
        }
    })
});


var mysql=require("mysql");
const conStr={
    url:"localhost",
    user:"root",
    password:"1234",
    database:"project1"
}


var app=express();
app.use(static(__dirname+"/static"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");

var expressSession=require("express-session"); //서버측의 세션을 관리하는 모듈
//세션 설정   -> use : 미들웨어
app.use(expressSession({
    secret:"key secret",
    resave:true,
    saveUninitialized:true
}));



































































var server = http.createServer(app);
server.listen(7777,function(){
    console.log("Game site is running at 9999 port...");
});