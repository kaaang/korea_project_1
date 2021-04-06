class ShowHero extends Obj{
    constructor(container, src, width, height, x, y, velX, velY){
        super(container, src, width, height, x, y, velX, velY);
    }

    tick(){
        for(var i=0;i<heroShowArr.length;i++){
            heroShowArr[i].img.style.left =parseInt(heroShowArr[i].img.style.left)+ this.velX +"px";
        }
    }

    render(){
        
    }
}