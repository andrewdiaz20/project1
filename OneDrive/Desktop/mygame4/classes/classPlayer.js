//physics blueprint//
export class Player extends Sprite{
    constructor({imageSrc, frameRate}){
        super({imageSrc, frameRate})
        this.position = {
            x: 100,
            y: 100,
        }
        this.velocity = {
            x:0,
            y:0,
        }
        this.sides ={
            bottom: this.position.y + this.height
        }
        this.gravity = 1
    }
    update(){
        this.position.x += this.velocity.x

        this.position.y += this.velocity.y
        this.sides.bottom = this.position.y + this.height

        if(this.sides.bottom + this.velocity.y < canvas.height){
            this.velocity.y += this.gravity
        }else this.velocity.y = 0
    }
}