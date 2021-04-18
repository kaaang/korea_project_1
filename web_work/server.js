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



// 세션 체크하는법
// app.get("주소",function(request, response){
//     if(request.session.admin==undefined){
//         response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
//         response.end(mymodule.getMsgBack("로그인이 필요합니다.."));
//     }else{
        
//     }

// });





app.get("/doublekj/main",function(request, response){
    response.render("index");
});



//회원가입 폼 요청
app.get("/doublekj/joinform", function(request, response){
    console.log("회원가입 페이지");
    response.render("doublekj/join");
});

//회원가입 요청처리
app.post("/doublekj/join", function(request, response){
    console.log("회원가입 하는중");
    var user_id=request.body.user_id;
    var user_pass=request.body.user_pass;
    var user_name=request.body.user_name;
    var user_phone=request.body.user_phone;
    var user_email=request.body.user_email;

    var sql="insert into user_list(user_id, user_pass, user_name, user_phone, user_email)";
    sql+=" values(?,?,?,?,?)";
    var con=mysql.createConnection(conStr);

    con.query(sql, [user_id, user_pass, user_name, user_phone, user_email], function(err, fields){
        if(err){
            console.log("등록 중 에러", err);
        }else{
            response.redirect("/doublekj/main"); //클라이언트로 하여금 지정한 url로 재접속을 유도함
        }
        con.end();
    });
});


//로그인 폼 요청
app.get("/doublekj/loginform", function(request, response){
    response.render("doublekj/login");
});

//로그인 요청처리
app.post("/doublekj/login", function(request, response){
    var user_id=request.body.user_id;
    var user_pass=request.body.user_pass;
    console.log(user_id);
    console.log(user_pass);

    var sql="select * from user_list where user_id=? and user_pass=?";

    var con=mysql.createConnection(conStr);
    con.query(sql, [user_id, user_pass], function(err, result, fields){
        if(err){
            console.log("조회실패", err);
        }else{
            if(result.length<1){
                console.log("로그인실패");
                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(mymodule.getMsgBack("로그인 정보가 올바르지 않습니다."));
            }else{
                request.session.user_list={
                    user_list_id:result[0].user_list_id,
                    user_id:result[0].user_id,
                    user_pass:result[0].user_pass,
                    user_name:result[0].user_name
                };
                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(mymodule.getMsgUrl("로그인성공","/doublekj/main"));
            }
        }
        con.end();
    });
});























































var server = http.createServer(app);
server.listen(7777,function(){
    console.log("Game site is running at 7777 port...");
});