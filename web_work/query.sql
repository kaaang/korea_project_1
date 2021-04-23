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

drop table game_data;

create table game_data(
gamedata_id int primary key auto_increment
,user_id varchar(20)
,score int
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


create  table comments(
    comments_id int  primary key auto_increment 
    , community_id int  
   , author varchar(20)
   , msg text 
   , regi_date  timestamp  default now()
   ,constraint fk_coco foreign key (community_id)  references community(community_id)
) default  character set  utf8;



create table customer(
    customer_key int  primary key auto_increment,
    customer_id varchar(20),
    title varchar(100),
    content text,
    regdate timestamp default now(),
    hit int default 0

)default character set utf8;





insert into game_data(user_id, score) values('tlsgur',543);
insert into game_data(user_id, score) values('gkdys',600);
insert into game_data(user_id, score) values('dbs',321);
insert into game_data(user_id, score) values('wlsdk',484);
insert into game_data(user_id, score) values('wlsdk',782);
insert into game_data(user_id, score) values('wlsdk',152);
insert into game_data(user_id, score) values('gkdus',276);
insert into game_data(user_id, score) values('gkdus',975);
insert into game_data(user_id, score) values('dbs',125);
insert into game_data(user_id, score) values('dbs',945);
insert into game_data(user_id, score) values('tlsgur',765);
insert into game_data(user_id, score) values('tlsgur',546);
insert into game_data(user_id, score) values('gkdus',243);
insert into game_data(user_id, score) values('gkdus',151);