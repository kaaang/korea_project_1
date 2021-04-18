/*------------------------------------------------------------
앞으로 졸업할때까지 유용하고 재사용성이 높은 코드는 모아두자
나만의 라이브러리
--------------------------------------------------------------*/




/*------------------------------------------------------------
매개변수 n : 0~n미만 까지의 랜덤한 수를 반환하는 함수
--------------------------------------------------------------*/
function getRandom(n){
    var r=parseInt(Math.random()*n);
    return r;
}


/*------------------------------------------------------------
메모리 제거 및 화면상의 제거를 담당할 함수
container : 어떤 부모 요소에서 지울지 결정
child : 어떤 요소를 지울지
arr : 어떤 배열에 있는지
index : 해당 배열의 몇번째 요소를 지울지
--------------------------------------------------------------*/
function removeObject(container,child,arr,index){
    //화면에서 삭제
    container.removeChild(child);
    //메모리에서 삭제(배열에서 삭제)
    arr.splice(index,1);
}



/*------------------------------------------------------------
충돌 여부를 판단해주는 함수
--------------------------------------------------------------*/
function hitTest(me, target) {
    //두물체간 충돌 여부 판단 
    me_x= parseInt(me.style.left);
    me_y= parseInt(me.style.top);
    me_width=parseInt(me.style.width);
    me_height=parseInt(me.style.height);

    target_x= parseInt(target.style.left);
    target_y= parseInt(target.style.top);
    target_width=parseInt(target.style.width);
    target_height=parseInt(target.style.height);


    var result1=(me_x >= target_x) && (me_x <= (target_x+target_width));//나의 x좌표위치가 타겟의 x range 내에 있는지 판단 
    var result2=(me_x+me_width >= target_x) && (me_x+me_width <= (target_x+target_width));  //나의 가로폭이 타겟의 가로폭 내에 있는지 판단
    var result3=(me_y >= target_y) && (me_y <= (target_y+target_height));//나의 y좌표위치가 타겟의 세로폭 내에 있는지 판단
    var result4=(me_y+me_height >= target_y) && (me_y+me_height <= (target_y+target_height));//나의 y폭이 타겟의 세로폭 내에 있는지 판단
    
    return (result1 || result2) && (result3 || result4);
}

/*------------------------------------------------------------
충돌 여부를 위아래좌우 판단
좌 : 1
위 : 2
우 : 3
아래 : 4
--------------------------------------------------------------*/
function hitTestAll(me, target) {
    //두물체간 충돌 여부 판단 
    me_x= parseInt(me.style.left);
    me_y= parseInt(me.style.top);
    me_width=parseInt(me.style.width);
    me_height=parseInt(me.style.height);

    target_x= parseInt(target.style.left);
    target_y= parseInt(target.style.top);
    target_width=parseInt(target.style.width);
    target_height=parseInt(target.style.height);

    var result;

    // if(((me_x+me_width)<=(target_x+target_width)) && (me_y >= target_y) && ((me_y+me_height)<=(target_y+target_height)) ){
    //     result = 1;
    // }else if((me_x>=target_x) && ((me_x+me_width)<=(target_x+target_width)) && (me_y+me_height)<(target_y+target_height)       ){
    //     result = 2;
    // }else if(((me_x)>(target_x)) && (me_y >= target_y) && ((me_y+me_height)<=(target_y+target_height)) ){
    //     result = 3;
    // }else if((me_x>=target_x) && ((me_x+me_width)<=(target_x+target_width))  && me_y >target_y){
    //     result = 4;
    // }

    if( (me_x+me_width) >= target_x && (me_x+me_width) < (target_x+target_width) && me_y>=target_y  && (me_y+me_height) <= (target_y+target_height)     ){
        result=1;
    }else if(  (me_y+me_height)>=target_y && (me_y+me_height) <(target_y+target_height) && me_x >= target_x && (me_x+me_width)<=(target_x+target_width)       ){
        result=2;
    }else if(   me_x <= (target_x+target_width)  && me_x > target_x     && me_y>=target_y  && (me_y+me_height) <= (target_y+target_height)    ){
        result=3;
    }else if(    me_y<=  (target_y+target_height) && me_y >target_y  && me_x >= target_x && (me_x+me_width)<=(target_x+target_width)        ){
        result=4;
    }
    
    
    return result;
}





/*------------------------------------------------------------
rgb값을 랜덤으로 가져오는 함수
--------------------------------------------------------------*/
function rgbRandom(){
    var r = parseInt(Math.random()*256);
    var g = parseInt(Math.random()*256);
    var b = parseInt(Math.random()*256);
    return rgb(r+","+g+","+b);
}





/*------------------------------------------------------------
자리수 처리 함수
한자리수의 경우 앞에 0 붙이기
--------------------------------------------------------------*/
function getZeroString(n){
    var result = (n>=10)? n:"0"+n ;
    return result;
}