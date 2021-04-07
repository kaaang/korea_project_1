class Ene extends Obj{
    constructor(container, src, width, height, x, y, velX, velY){
        super(container, src, width, height, x, y, velX, velY);

        this.hpdiv = document.createElement("div");
        this.hpdiv.style.width = this.width + "px";
        this.hpdiv.style.height = 20 + "px";
        this.hpdiv.style.boxSizing = "border-box";
        this.hpdiv.style.border = "1px solid black"
        this.hpdiv.style.backgroundColor = "red";
        this.hpdiv.style.position = "absolute";
        this.hpdiv.style.top = this.y - 20 + "px";
        this.hpdiv.style.left = x + "px";
        this.container.appendChild(this.hpdiv);
    }
    tick(){
        this.velX = eneX;
        this.x -= this.velX;
    }
    render(){
        this.img.style.left = this.x + "px";
        this.hpdiv.style.left = this.x + "px";
    }
}