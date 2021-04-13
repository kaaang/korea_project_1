class HeroObj{
    constructor(container, src, width, height, x, y, velX, velY, hp,move){
        this.container = container;
        this.src = src;
        this.x=x;
        this.y=y;
        this.velX=velX;
        this.velY=velY;
        this.hp=hp;
        this.move=move;
        this.hpAr=[];

        this.cnt=0;
        
        
        this.width=parseInt(move[0].width);
        this.height=parseInt(move[0].height);
        this.bkp=this.move[0].pos;
        this.bkw=this.move[0].width;
        this.bkh=this.move[0].height;


        this.box=document.createElement("div");

        //이미지를 백그라운드로
        this.box.style.background = "url("+src+")";

        //-----------------------------------------------
        this.box.style.backgroundPosition = this.bkp;
        this.box.style.backgroundWidth = this.bkw;
        this.box.style.backgroundHeight = this.bkh;

        //---------------------------------------------
        this.box.style.width=this.width+"px";
        this.box.style.height=this.height+"px";


        this.box.style.position="absolute";
        this.box.style.left=this.x+"px";
        this.box.style.top=this.y+"px";
        this.box.style.boxSizing="border-box";
        //임시 테두리
        // this.box.style.border="3px solid black";

        this.container.appendChild(this.box);
        
        
        //hp 바 생성부분
        this.hpbox=document.createElement("div");

        //----------------------------------------
        this.hpbox.style.width=this.width+"px";
        this.hpbox.style.height=20+"px";
        // this.hpbox.style.boxSizing="border-box"
        this.hpbox.style.border="1px solid black"
        this.hpbox.style.position="absolute"
        this.hpbox.style.left=this.x+"px";
        this.hpbox.style.top=this.y-20+"px";

        this.createHp();
        
        this.container.appendChild(this.hpbox);
    }



    createHp(){
        for(var i=0;i<this.hp;i++){
            var bar=document.createElement("div");
            bar.style.width=(this.width/this.hp)+"px";
            bar.style.height=20+"px";
            bar.style.boxSizing="border-box"
            bar.style.backgroundColor="red";
            bar.style.float="left";
            this.hpbox.appendChild(bar);
            this.hpAr.push(bar);
        }
    }

    
    tick(){
        this.x += this.velX;



        this.cnt++;
        if(this.cnt >= this.move.length-1){
            this.cnt=0;
        }
        this.width=parseInt(this.move[this.cnt].width);
        this.height=parseInt(this.move[this.cnt].height);
        this.bkp=this.move[this.cnt].pos;
        this.bkw=this.move[this.cnt].width;
        this.bkh=this.move[this.cnt].height;
        
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