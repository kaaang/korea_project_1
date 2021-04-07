class Ene extends Obj{
    constructor(container, src, width, height, x, y, velX, velY,hp){
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
        this.velX = eneX;
        this.x -= this.velX;
    }
    render(){
        this.img.style.left = this.x + "px";
        for(var i=0;i<this.hpAr.length;i++){
            this.hpAr[i].style.left = parseInt(this.hpAr[i].style.left) - eneX + "px";
        }
    }
}