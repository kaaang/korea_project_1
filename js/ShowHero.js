class ShowHero extends Obj{
    constructor(container, src, width, height, x, y, velX, velY, hp){
        super(container, src, width, height, x, y, velX, velY);

        this.hpAr = [];
        for(var i=0;i<hp;i++){
            this.hpdiv = document.createElement("div");
            this.hpdiv.style.width = parseFloat(this.width/hp) + "px";
            this.hpdiv.style.height = 20 + "px";
            this.hpdiv.style.boxSizing = "border-box";
            this.hpdiv.style.border = "1px solid black"
            this.hpdiv.style.backgroundColor = "red";
            this.hpdiv.style.position = "absolute";
            this.hpdiv.style.top = this.y - 20 + "px";
            this.hpdiv.style.left = x+(parseFloat(this.hpdiv.style.width)*i) + "px";
            this.container.appendChild(this.hpdiv);
            this.hpAr.push(this.hpdiv);
            
        }

    }

    tick(){
        for(var i=0;i<heroShowArr.length;i++){
            if(hitTest(heroShowArr[i].img, ene.img)){
                heroShowArr[i].velX =0;
                eneX=0;
            }else{
                heroShowArr[i].img.style.left =parseInt(heroShowArr[i].img.style.left)+ this.velX +"px";
                for(var j=0;j<heroShowArr[i].hpAr.length;j++){
                    heroShowArr[i].hpAr[j].style.left =parseFloat(heroShowArr[i].hpAr[j].style.left)+ this.velX +"px";
                }
            }
        }
    }

    render(){
        
    }
}