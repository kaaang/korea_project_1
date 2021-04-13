class Ene extends CharacterObj{
    constructor(container, src, x, y, velX, velY, hp,move,attack){
        super(container, src, x, y, velX, velY, hp,move,attack);

        this.cnt=0;
        this.attack_cnt=0;
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
    
        

        if(!this.attack_flag){
            this.velX=this.save_velX;
            for(var i=0;i<heroArr.length;i++){
                if(hitTest(this.box, heroArr[i].box)){
                    this.attack_flag=true;
                    this.i=i;
                    this.velX=0;
                    this.cnt=0;
                }
            }
        }else{
            this.attack_action(this.i);
        }
        


        








        // 나의 hp가 0이 되었을때 나를 삭제
        if(this.hpAr.length==0){
            removeObject(content,eneArr[eneArr.indexOf(this)].box,eneArr,eneArr.indexOf(this));
            content.removeChild(this.hpbox);
            for(var i=0;i<heroArr.length;i++){
                heroArr[i].attack_flag=false;
            }
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

    attack_action(i){

        if(this.attack_cnt >= this.attack.length){
            this.attack_cnt=0;
            removeObject(heroArr[i].hpbox,heroArr[i].hpAr[0], heroArr[i].hpAr,0);
            if(heroArr[i].hpAr.length==0){
                this.attack_flag=false;                
            }
        }

        
        this.width=parseInt(this.attack[this.attack_cnt].width);
        this.height=parseInt(this.attack[this.attack_cnt].height);
        this.bkp=this.attack[this.attack_cnt].pos;
        this.bkw=this.attack[this.attack_cnt].width;
        this.bkh=this.attack[this.attack_cnt].height;
        this.y=this.container_height-parseInt(this.height);
        this.attack_cnt++;
        
    }
    

}