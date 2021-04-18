class Coin{
    constructor(container, src, width, height, x, y, move){
        this.container = container;
        this.src = src;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.move=move;

        this.width=parseInt(move[0].width);
        this.height=parseInt(move[0].height);
        this.bkp=this.move[0].pos;
        this.bkw=this.move[0].width;
        this.bkh=this.move[0].height;

        this.cnt=0;

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
        
    }
    tick(){
        if(this.cnt >= this.move.length){
            this.cnt=0;
        }
        this.width=parseInt(this.move[this.cnt].width);
        this.height=parseInt(this.move[this.cnt].height);
        this.bkp=this.move[this.cnt].pos;
        this.bkw=this.move[this.cnt].width;
        this.bkh=this.move[this.cnt].height;
        this.cnt++;
    }
    render(){
       
        this.box.style.backgroundPosition = this.bkp;
        this.box.style.backgroundWidth = this.bkw;
        this.box.style.backgroundHeight = this.bkh;
        this.box.style.width=this.width+"px";
        this.box.style.height=this.height+"px";
    }
}
