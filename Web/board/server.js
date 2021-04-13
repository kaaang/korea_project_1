/* --------------- [게시판 서버] --------------- */ 
//  내장 모듈
var http= require("http");
var fs= require("fs"); // 파일 읽기
var ejs= require("ejs"); // 랜더링 위해
var path= require("path"); // 파일 경로 관련하여 확장자 추출위해(사진)
// 외부 모듈
var express= require("express");
var app= express(); // express 객체 생성
var mysql= require("mysql"); // mysql로 db관리
var multer= require("multer"); // 사진때문에 멀터 이용
var server= http.createServer(app);
// 스크립트
var lib= require("./library.js");
// 각종 미들웨어 적용
app.use(express.static(__dirname+"/static")); // 정적자원 위치

// mysql
var conStr={
    url:"localhost:3306",
    user:"root",
    password:"1234",
    database:"project1"
};
// 사진 업로드
var upload= multer({
    storage:multer.diskStorage({
        destination: function(req,file,upImg){
            upImg(null,__dirname+"/static/upload");
        },
        filename: function(req,file,upImg){
            // 파일 확장자 추출후 이미지 명 중복되지 않게 업로드 한 시간날짜로 저장
            upImg(null,new Date().valueOf()+path.extname(file.originalname)); 
        }

    }),
});

// 리스트
app. get("/community/list",function(req,res){
    // mysql 접속
    var con= mysql.createConnection(conStr);
    var sql= "select * from community order by community_id desc";
    con.query(sql,function(err,result,fields){
        if(err){
            console.log("리스트를 불러오지 못했습니다.",err);
        }else{
            fs.readFile("./community/list.ejs","utf8",function(error,data){
                if(error){
                    console.log(error);
                }else{
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    res.end(ejs.render(data,{
                        communityList:result,
                        lib:lib
                    }));
                }
            });
        }
        con.end();
    });
});

// 글 등록
app.post("/community/write",upload.single("pic"),function(req,res){
    // parameter
    var title=req.body.title;
    var writer=req.body.writer;
    var content=req.body.content;
    var filename=req.body.filename; // multer 이용하여 기존 req객체에 추가된 것 
    if(req.file != undefined){
        fs.unlink(__dirname+"/static/upload/"+filename,function(error){
            if(error){
                console.log(error);
            }else{
                filename= request.file.filename;
                // mysql 접속
                var con= mysql.createConnection(conStr);
                var sql= "insert into community(title, writer, content, filename) values(?,?,?,?)";
                con.query(sql,[title,writer,content,filename],function(err,fields){
                    if(err){
                        console.log("글 등록에 실패하였습니다.",err);
                    }else{
                        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                        res.end(lib.getMsgUrl("등록 완료","/community/list"));
                    }
                    con.end(); // mysql 접속 종료
                });
                
            }
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

});

// 상세보기
app.get("/community/detail",function(req,res){
    // mysql 접속
    var con= mysql.createConnection(conStr);
    var community_id= req.query.community_id;
    var sql= "select * from community where community_id="+community_id;
    con.query(sql,function(err,result,fields){
        if(err){
            console.log("상세보기에 실패하였습니다.",err);
        }else{
            fs.readFile("./community/detail.ejs","utf8",function(error,data){
                if(error){
                    console.log("상세보기 읽어드리기에 실패하였습니다.",error);
                }else{
                    var renderResult=ejs.render(data,{
                        community:result[0]
                    });
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    res.end(renderResult);
                }
            });
        }
        con.end(); // mysql 접속 종료
    });
});

// 수정
app.post("/community/edit",upload.single("pic"),function(req,res){
    // parameter
    var title=req.body.title;
    var writer=req.body.writer;
    var content=req.body.content;
    var filename=req.body.filename;
    var community_id=req.body.community_id;
    if(req.file != undefined){ // pic+db 수정
        fs.unlink(__dirname+"/static/upload"+filename,function(err){
            if(err){
                console.log("접근 실패",err)
            }else{
                filename= req.file.fieldname; // 새롭게 수정 된 파일의 이름 부여
                // mysql 접속
                var sql= "update community set title=?, writer=?, content=?, filename=? where community_id";
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
});

// 삭제
app.post("/community/delete",upload.single("pic"),function(req,res){
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
        var sql= "delete from community where community_id="+community_id;
        var con= mysql.createConnection(conStr);
        con.query(sql,function(error,fields){
            if(error){
                console.log("삭제 실패",error)
            }else{
                res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                res.end(lib.getMsgUrl("삭제 완료","/community/list"));
            }
            con.end(); // mysql 접속 종료
        });
    }
});

// 서버 가동
server.listen(9999,function(){
    console.log("Community server is running at 9999 port");
});