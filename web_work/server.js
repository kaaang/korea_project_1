var http = require("http");
var express = require("express");
var static=require("serve-static");
var ejs=require("ejs");
var lib=require("./lib/library.js");
var path=require("path");
var fs=require("fs");



var app=express();
app.use(static(__dirname+"/static"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");




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



var expressSession=require("express-session"); 
const { stringify } = require("qs");
app.use(expressSession({
    secret:"key secret",
    resave:true,
    saveUninitialized:true
}));





app.get("/doublekj/main",function(request, response){
    var con=mysql.createConnection(conStr);
    var sql="select * from community order by community_id desc";
    con.query(sql,function(error,result,fields){
        if(error){
            console.log("홈페이지 메인 조회중 오류 : ",error);
        }else{
            var sql="select * from customer order by customer_key desc";
            con.query(sql,function(error,result_1,fields){
                if(error){
                    console.log("홈페이지 메인 2 오류",error);
                }else{
                    response.render("index",{
                        result:result,
                        result_1:result_1
                    });
                }
            });

        }
        con.end();
    });
});

app.get("/doublekj/game",function(request, response){
    if(request.session.user_list==undefined){
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end(lib.getMsgBack("로그인이 필요합니다.."));
    }else{
        
        response.render("game/game",{
            result : request.session.user_list
        });
    }

});


app.get("/doublekj/logout",function(request, response){
    if(request.session.user_list==undefined){
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end(lib.getMsgBack("로그인상태가 아닙니다.."));
    }else{
        request.session.destroy(function(){
            request.session;
        })
        response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
        response.end(lib.getMsgUrl("로그아웃성공","/doublekj/main"));
    }

});




app.post("/doublekj/gameset",function(request, response){
    var score = request.body.send_score;
    var id = request.session.user_list.user_id;

    var sql="insert into game_data(user_id, score) values(?,?)";
    var con=mysql.createConnection(conStr);
    con.query(sql,[id,score],function(err,fields){
        if(err){
            console.log("게임 랭킹 입력 중 오류 : ",err);
        }else{
            response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
            response.end(lib.getMsgUrl("랭킹 등록 완료","/doublekj/ranking"));
        }
    });
});

app.get("/doublekj/ranking",function(request,response){
    

    var con=mysql.createConnection(conStr);
    var sql="select * from game_data order by score desc";
    con.query(sql,function(err,result,fields){
        if(err){
            console.log("랭킹 페이지 불러오기 오류",err);
        }else{
            response.render("ranking",{
                ranking:result
            })
        }
        con.end();
    })
});







/*-----------------------------------------------------------------------------
하연씨
-----------------------------------------------------------------------------*/

//회원가입 폼 요청
app.get("/doublekj/joinform", function(request, response){
    response.render("doublekj/join");
});

//회원가입 요청처리
app.post("/doublekj/join", function(request, response){
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
            response.redirect("/doublekj/main");
        }
        con.end();
    });
});

///중복 체크 
app.get("/doublekj/logincheck", function(request, response){
    var user_id=request.query.user_id;

    // var sql=""select * from user_list where user_id='"+user_id+"'"";
    var sql="select * from user_list where user_id=";
    sql+="'"+user_id+"'";
    // console.log(sql);
    var con=mysql.createConnection(conStr);
    con.query(sql, function(err, result, fields){
        if(err){
            console.log("중복 체크 오류 : ", err);
        }else{

            if(result.length==0 ){
                var re = "no";
            }else{
                var re = result[0].user_id;
            }
            response.end(re);
        }
        con.end();
    });
});


//로그인 폼 요청
app.get("/doublekj/loginform", function(request, response){
    response.render("doublekj/login2");
});

//로그인 요청처리
app.post("/doublekj/login", function(request, response){
    var user_id=request.body.user_id;
    var user_pass=request.body.user_pass;
    

    var sql="select * from user_list where user_id=? and user_pass=?";

    var con=mysql.createConnection(conStr);
    con.query(sql, [user_id, user_pass], function(err, result, fields){
        if(err){
            console.log("조회실패", err);
        }else{
            if(result.length<1){
                console.log("로그인실패");
                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(lib.getMsgBack("로그인 정보가 올바르지 않습니다."));
            }else{
                request.session.user_list={
                    user_list_id:result[0].user_list_id,
                    user_id:result[0].user_id,
                    user_pass:result[0].user_pass,
                    user_name:result[0].user_name
                };
                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(lib.getMsgUrl("로그인성공","/doublekj/main"));
            }
        }
        con.end();
    });
});
/*-----------------------------------------------------------------------------
하연씨
-----------------------------------------------------------------------------*/





/*-----------------------------------------------------------------------------
                                진아씨
-----------------------------------------------------------------------------*/
// --------------------------게시글 등록----------------------------------------

// 목록
app. get("/community/list",function(req,res){
    // 페이징
    var currentPage= 1;
    if(req.query.currentPage!=undefined){
       currentPage =req.query.currentPage;
    }
    // mysql 접속
    var con= mysql.createConnection(conStr);
    var sql= "select * from community order by community_id desc";
    con.query(sql,function(err,result,fields){
        if(err){
            console.log("리스트를 불러오지 못했습니다.",err);
        }else{
            res.render("community/list",{
                param:{
                    communityList:result,
                    currentPage:currentPage,
                    lib:lib
                }
            });
        }
        con.end(); // mysql 접속 종료
    });
    
});

// 검색
app.get("/community/search",function(req,res){
    var currentPage= 1;
    if(req.query.currentPage!=undefined){
       currentPage =req.query.currentPage;
    }
    var search= req.query.search;
    // mysql 접속
    var con= mysql.createConnection(conStr);
    var sql= "select * from community where title like '%"+search+"%'";
    con.query(sql,function(err,result,fileds){
        if(err){
            console.log("검색 쿼리문 수행 실패",err);
        }else{
            var submit = JSON.stringify(result);
            res.end(submit);
        }
        con.end(); // mysql 접속 종료
    });
});

// 글 등록
app.post("/community/write",upload.single("pic"),function(req,res){
    if(req.session.user_list==undefined){
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        res.end(lib.getMsgBack("로그인 필요한 페이지입니다."));
    }else{
        // console.log(req.session.user_list);
        // parameter
        var title=req.body.title;
        var writer=req.session.user_list.user_id;
        var content=req.body.content;
        var filename=req.body.filename; // multer 이용하여 기존 req객체에 추가된 것 

        if(req.file != undefined){
            var filename=req.file.filename
            var con = mysql.createConnection(conStr);
            var sql = "insert into community(title, writer, content,filename) values(?,?,?,?)";
            con.query(sql,[title,writer,content,filename],function(error, fields){
                if(error){
                    console.log(error);
                }else{
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    res.end(lib.getMsgUrl("등록완료","/community/list"));
                }
                con.end();
            });
        }else{
            var sql="insert into community(title, writer, content) values(?,?,?)";
            var con= mysql.createConnection(conStr);
            con.query(sql,[title, writer, content],function(err0r,fields){
                if(err0r){
                    console.log("수정 실패", err0r);
                }else{
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    res.end(lib.getMsgUrl("등록 완료","/community/list"));
                }
                con.end(); // mysql 종료
            });
        }
    }

    
});

// 상세보기
app.get("/community/detail",function(req,res){
    if(req.session.user_list==undefined){
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        res.end(lib.getMsgBack("로그인 필요한 페이지입니다."));
    }else{
        // mysql 접속
        var con= mysql.createConnection(conStr);
        var community_id= req.query.community_id;
        var sql= "select * from community where community_id="+community_id;
        con.query(sql,function(err,result,fields){
            if(err){
                console.log("상세보기에 실패하였습니다.",err);
            }else{
                sql= "update community set hit=hit+1 where community_id="+community_id;
                con.query(sql,function(error,result2,fields){
                    if(error){
                        console.log("조회수 쿼리문 실패",error);
                    }else{
                        // 댓글도 같이 뜨게 처리
                        sql= "select * from comments where community_id=?";
                        con.query(sql,[community_id],function(error,result1,fileds){
                            if(error){
                                console.log("상세보기 내 댓글 불러오는 쿼리문 실패",error);
                            }else{
                                // console.log(result[0].writer);
                                // console.log(req.session.user_list.user_id);
                                res.render("community/detail",{
                                    community:result[0],
                                    commentsList:result1,
                                    lib:lib,
                                    id_check1:req.session.user_list.user_id,
                                    id_check2:result[0].writer
                                });
    
                            }
                        });
                    }
                    con.end(); // mysql 접속 종료
                });
               
            }
        });
    }
});

// 수정
app.post("/community/edit",upload.single("pic"),function(req,res){
    if(req.session.user_list==undefined){
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        res.end(lib.getMsgBack("로그인 필요한 페이지입니다."));
    }else{
        // parameter
        var title=req.body.title;
        var writer=req.body.writer;
        var content=req.body.content;
        var filename=req.body.filename;
        var community_id=req.body.community_id;
        
        if(req.file != undefined && filename != ""){ // pic+db 수정
            fs.unlink(__dirname+"/static/upload/"+filename,function(err){
                if(err){
                    console.log("접근 실패",err)
                }else{
                    filename= req.file.filename; // 새롭게 수정 된 파일의 이름 부여
                    // mysql 접속
                    var sql= "update community set title=?, writer=?, content=?, filename=? where community_id=?";
                    var con= mysql.createConnection(conStr);
                    con.query(sql,[title,writer,content,filename,community_id],function(error,fields){
                        if(error){
                            console.log("사진 수정 실패",error);
                        }else{
                            res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                            res.end(lib.getMsgUrl("수정 완료","/community/detail?community_id="+community_id));
                        }
                        con.end(); // mysql 접속 종료
                    });
                }
            });
            
        }else if(req.file != undefined && filename == ""){
            filename= req.file.filename; // 새롭게 수정 된 파일의 이름 부여
            // mysql 접속
            var sql= "update community set title=?, writer=?, content=?, filename=? where community_id=?";
            var con= mysql.createConnection(conStr);
            con.query(sql,[title,writer,content,filename,community_id],function(error,fields){
                if(error){
                    console.log("사진 수정 실패",error);
                }else{
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    res.end(lib.getMsgUrl("수정 완료","/community/detail?community_id="+community_id));
                }
                con.end(); // mysql 접속 종료
            });
        }
        else if(req.file == undefined){
        
            // mysql 접속
            var sql= "update community set title=?, writer=?, content=? where community_id=?";
            var con= mysql.createConnection(conStr);
            con.query(sql,[title,writer,content,community_id],function(error,fields){
                if(error){
                    console.log("사진 수정 실패",error);
                }else{
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    res.end(lib.getMsgUrl("수정 완료","/community/detail?community_id="+community_id));
                }
                con.end(); // mysql 접속 종료
            });
        }else{ // only db수정
            var sql= "update community set title=?, writer=?, content=? where community_id=?";
            var con= mysql.createConnection(conStr);
            con.query(sql,[title,writer,content,community_id],function(error1,field){
                if(error1){
                    console.log("DB 수정 실패",error1)
                }else{
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    res.end(lib.getMsgUrl("수정 완료","/community/detail?community_id="+community_id));
                }
                con.end(); // mysql 접속 종료
            });
        }
    }
});

// 삭제
app.post("/community/delete",upload.single("pic"),function(req,res){
    if(req.session.user_list==undefined){
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        res.end(lib.getMsgBack("로그인 필요한 페이지입니다."));
    }else{
        var community_id= req.body.community_id;
        var filename= req.body.filename;
        if(req.file != undefined){
            fs.unlink(__dirname+"/static/upload"+filename,function(err){
                if(err){
                    console.log("접근 실패",err)
                }else{
                    filename= req.file.fieldname; // 새롭게 수정 된 파일의 이름 부여
                    // mysql 접속
                    var sql= "delete from community set title=?, writer=?, content=?, filename=? where community_id="+community_id;
                    var con= mysql.createConnection(conStr);
                    con.query(sql,[title,writer,content,filename,community_id],function(error,fields){
                        if(error){
                            console.log("사진 수정 실패",error);
                        }else{
                            res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                            res.end(lib.getMsgUrl("수정 완료","/community/detail?community_id="+community_id));
                        }
                        con.end(); // mysql 접속 종료
                    });
                }
            });
            
        }else{
            // mysql 접속
            var sql= "delete from comments where community_id="+community_id;
            var con= mysql.createConnection(conStr);
            con.query(sql,function(error,fields){
                if(error){
                    console.log("삭제 실패",error)
                }else{
                    sql= "delete from community where community_id="+community_id;
                    con.query(sql,function(err0r,fileds){
                        if(err0r){
                            console.log("게시글과 댓글삭제 실패",err0r);
                        }else{
                            res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                            res.end(lib.getMsgUrl("삭제 완료","/community/list"));
                        }
                    });
                }
                con.end(); // mysql 접속 종료
            });
        }
    }
});

// --------------------------댓글 등록-----------------------------------------
app.post("/comments/regi",function(req,res){
    var community_id= req.body.community_id;
    var msg= req.body.msg;
    var author= req.body.author;

    var con= mysql.createConnection(conStr);
    var sql= "insert into comments(community_id,author,msg) values(?,?,?)";
    con.query(sql,[community_id,author,msg],function(err,result,fields){
        if(err){
            console.log("댓글 등록 쿼리문 실패",err);
            res.writeHead(200,{"Content-Type":"text/json;charset=utf-8"});
            var str="";
            str+="{";
            str+= "\"result\":0";
            str+= "}";
            res.end(str); 
        }else{
            res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            var str="";
            str+="{";
            str+= "\"result\":1";
            str+= "}";
            res.end(str);
        }
        con.end(); // mysql 접속 종료
    });
});
// 코멘트 목록가져오기
app.get("/comments/list",function(req,res){
    var con= mysql.createConnection(conStr);
    var community_id= req.query.community_id;
    var sql= "select * from comments where community_id="+community_id;
    con.query(sql,function(err,result,fields){
        if(err){
            console.log("sql문 작동 중 실패",err);
        }else{
            var com= JSON.stringify(result);
            res.writeHead(200,{"Content-Type":"text/json;charset=utf-8"});
            res.end(com);
        }
        con.end(); // mysql 접속 종료
    });
        
    
});
/*-----------------------------------------------------------------------------
                                진아씨
-----------------------------------------------------------------------------*/




/*-----------------------------------------------------------------------------
주윤씨
-----------------------------------------------------------------------------*/

app.get("/customer/home",function(request, response){
    if(request.session.user_list==undefined){
         response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
         response.end(lib.getMsgBack("로그인이 필요합니다.."));
    }else{
        var con = mysql.createConnection(conStr);
        
        con.query("select * from customer  ", function(error, result, fields){
            if(error){
                console.log("에러1",error);
            }else{
                response.render("customer/home",{
                    customerList:result,
                    lib:lib,
                    user_id:request.session.user_list
                });
            }
            con.end();//mysql 접속 끊기
        });
    }

 });


//문의페이지

app.get("/customer/regist", function(request ,response){
    if(request.session.user_list==undefined){
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end(lib.getMsgBack("로그인 필요한 페이지입니다."));
    }else{
        // console.log(request.session.user_list);
        response.render("customer/detail",{
            result:request.session.user_list
        });
    }
});



//등록 시 저장
app.post("/customer/registsubmit", function(request ,response){

    
    var customer_id=request.body.customer_id;
    var title=request.body.title;
    var content=request.body.content;
    

    // //2) mysql 접속 후  connection객체 반환
    var con=mysql.createConnection(conStr);
    var sql="insert into customer(customer_id, title, content) values(?,?,?)";

    con.query(sql, [customer_id,  title, content], function(err, fields){
        if(err){
            console.log("에러2",err);
        }else{
            response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
            response.end(lib.getMsgUrl("등록 완료","/customer/home"));
        }
        con.end();//mysql 접속 끊기
    });
});





//title 누르면 문의내용 출력
app.get("/customer/detail", function(request, response){
    var customer_key=request.query.customer_key;
    
    var sql="select * from customer where customer_key=?";

    var con=mysql.createConnection(conStr);//접속
    con.query(sql, [customer_key] , function(err, result, fields){
        if(err){
            console.log("에러3",err);
        }else{
            
            con.query("update customer set hit=hit+1 where customer_key=?",[customer_key], function(error2, fields){
                if(error2){
                    console.log(error2);                        
                }else{
                   
                    response.render("customer/detailcheck",{
                        record:result[0],
                        content: (result[0].content),
                        result:request.session.user_list,
                        comment:(result[0]).comment
                    });                       
                }
                con.end(); //mysql 접속 끊기
            });
        }
    });
});








/*------------------------ 세션 체크 ------------------------*/
function checkAdminSession(req,url,res){
    
   if(req.session.user_list){ // request.session.user!=undefined라면
    res.render(url,{
        adminUser:req.session.user_list
    });
    }else{
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        // 이전 화면으로 강제로 돌리기 history.back()
        res.end(lib.getMsgUrl("로그인 필요한 페이지입니다..","/doublekj/main"))
    }
}




var server = http.createServer(app);
server.listen(7777,function(){
    console.log("Game site is running at 7777 port...");
});