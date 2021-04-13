class Ene extends CharacterObj{
    constructor(container, src, x, y, velX, velY, hp,move,attack){
        super(container, src, x, y, velX, velY, hp,move,attack);

        this.cnt=0;
        this.hit_cnt=0;
        this.attack_flag=false;
        this.i;
    }

    tick(){



        this.x -= this.velX;
        if(this.cnt >= this.move.length){
            this.cnt=0;
        }
        this.width=parseInt(this.move[this.cnt].width);
        this.height=parseInt(this.move[this.cnt].height);
        this.bkp=this.move[this.cnt].pos;
        this.bkw=this.move[this.cnt].width;
        this.bkh=this.move[this.cnt].height;
        this.cnt++;
    
        

        for(var i=0;i<heroArr.length;i++){
            if(hitTest(this.box, heroArr[i].box)){
                this.velX=0;
            }
        }
        


        








        // 나의 hp가 0이 되었을때 나를 삭제
        if(this.hpAr.length==0){
            removeObject(content,eneArr[eneArr.indexOf(this)].box,eneArr,eneArr.indexOf(this));
            content.removeChild(this.hpbox);
            // for(var i=0;i<heroArr.length;i++){
            //     heroArr[i].
            // }
        }
        
    }
    render(){
        this.box.style.left = this.x + "px";
        this.hpbox.style.left=this.x+"px";

        this.box.style.backgroundPosition = this.bkp;
        this.box.style.backgroundWidth = this.bkw;
        this.box.style.backgroundHeight = this.bkh;
        this.box.style.width=this.width+"px";
        this.box.style.height=this.height+"px";
    }

    
    

}