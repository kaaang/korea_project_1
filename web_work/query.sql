/*------------------------------------------------------------
테이블 생성
--------------------------------------------------------------*/
create table user_list(
user_list_id int primary key auto_increment
,user_id varchar(20)
,user_pass varchar(20)
,user_name varchar(20)
,user_phone varchar(20)
,user_email varchar(30)
) default character set utf8;


create table game_data(
gamedata_id int primary key auto_increment
,user_list_id int
,score int
,playcount int
,constraint fk_usergame foreign key (user_list_id)  references user_list(user_list_id)
)default character set utf8;

create  table community(
    community_id int  primary key auto_increment 
   , title varchar(100)    
   , writer varchar(20)
   , content text 
   , regdate  timestamp  default now()
   , hit int default 0 
   , filename varchar(30)
) default  character set  utf8;