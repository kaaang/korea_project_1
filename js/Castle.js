class Castle extends GameObj{
    constructor(container, src, width, height, x, y, velX, velY, hp){
        super(container, src, width, height, x, y, velX, velY, hp);
    }

    tick(){
        if(this.hpAr.length==0){
            alert("게임종료");
        }
    }
}