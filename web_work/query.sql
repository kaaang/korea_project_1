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