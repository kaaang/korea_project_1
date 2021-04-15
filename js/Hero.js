class Hero extends CharacterObj{
    constructor(container, move_src,attack_src, x, container_height, velX, velY, hp,move,attack){
        super(container, move_src,attack_src, x, container_height, velX, velY, hp,move,attack);

        this.cnt=0;
        this.attack_cnt=0;
        this.attack_flag=false;
        this.castle_attack_flag=false;
        this.i;
    }



    tick(){

        
        

      
        //케릭터 이동부
        this.x += this.velX;
        if(this.cnt >= this.move.length){
            this.cnt=0;
        }
        this.width=parseInt(this.move[this.cnt].width);
        this.height=parseInt(this.move[this.cnt].height);
        this.bkp=this.move[this.cnt].pos;
        this.bkw=this.move[this.cnt].width;
        this.bkh=this.move[this.cnt].height;
        this.y=this.container_height-parseInt(this.height);

        this.cnt++;







        if(!this.attack_flag && !this.castle_attack_flag){
            this.velX=this.save_velX;
            for(var i=0;i<eneArr.length;i++){
                if(hitTest(this.box, eneArr[i].box)){
                    this.attack_flag=true;
                    this.i=i;
                    this.velX=0;
                    this.cnt=0;
                }
            }
            if(hitTest(this.box, ene_castle.box)){
                this.castle_attack_flag=true;
                this.velX=0;
                this.cnt=0;
            }
        }else{
            if(this.attack_flag){
                this.attack_action(this.i);
            }
            else if(this.castle_attack_flag){
                this.castle_attack_action();
            }
        }
        
        


        //나의 hp가 0이 되었을때 나를 삭제
        if(this.hpAr.length==0){
            removeObject(content,heroArr[heroArr.indexOf(this)].box,heroArr,heroArr.indexOf(this));
            content.removeChild(this.hpbox);
            for(var i=0;i<eneArr.length;i++){
                eneArr[i].attack_flag=false;
            }
        }
    }


    render(){
        this.box.style.left = this.x + "px";
        this.hpbox.style.left=this.x+"px";

        if(!(this.attack_flag) && !(this.castle_attack_flag)){
            this.box.style.background = "url("+this.move_src+")";
        }else if(this.attack_flag){
            this.box.style.background = "url("+this.attack_src+")";
        }else if(this.castle_attack_flag){
            console.log("test");
            this.box.style.background = "url("+this.attack_src+")";
        }
        this.box.style.backgroundPosition = this.bkp;
        this.box.style.backgroundWidth = this.bkw;
        this.box.style.backgroundHeight = this.bkh;
        this.box.style.width=this.width+"px";
        this.box.style.height=this.height+"px";
        this.box.style.top=this.y+"px";

       
    }

    attack_action(i){
        if(this.attack_cnt >= this.attack.length){
            this.attack_cnt=0;
            removeObject(eneArr[i].hpbox,eneArr[i].hpAr[0], eneArr[i].hpAr,0);
            if(eneArr[i].hpAr.length==0){
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

    castle_attack_action(){

        if(this.attack_cnt >= this.attack.length){
            this.attack_cnt=0;
            removeObject(ene_castle.hpbox,ene_castle.hpAr[0], ene_castle.hpAr,0);
            if(ene_castle.hpAr.length==0){
                this.castle_attack_flag=false;                
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