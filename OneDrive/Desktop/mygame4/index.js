const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16
canvas.height = 64 * 9


class Sprite{
    constructor({
        position, 
        imageSrc, 
        frameRate= 1, 
        animations, 
        frameBuffer = 2,
        loop = true,
        autoplay = true,
    }) {
        this.position = position
        this.image = new Image()
        this.image.onload = () => {
            this.loaded = true
            this.width = this.image.width / this.frameRate
            this.height = this.image.height
        }
        this.image.src = imageSrc
        this.loaded = false
        this.frameRate = frameRate
        this.currentFrame = 0
        this.elapsedFrames = 0
        this.frameBuffer = frameBuffer
        this.animations = this.animations
        this.loop = loop
        this.autoplay = autoplay

        if (this.animations){
            for(let key in this.animations){
                const image = new Image()
                image.src = this.animations[key].imageSrc
                this.animations[key].image = image
            }
            console.log(this.animations)
        }
    }
    draw(){
        if(!this.loaded)return
        const cropbox = {
            position: {
                x: this.width * this.currentFrame,
                y:0,
            },
            width: this.width,
            height: this.height,
        }
        c.drawImage(
            this.image, 
            cropbox.position.x, 
            cropbox.position.y, 
            cropbox.width, 
            cropbox.height, 
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        )

         this.updateFrames()
        }

        play(){
            this.autoplay = true
        }

        updateFrames(){
            if(!this.autoplay) return

            this.elapsedFrames++


            if(this.elapsedFrames % this.frameBuffer === 0)
            if(this.currentFrame < this.frameRate - 1) this.currentFrame++
              else if(this.loop) this.currentFrame = 0
    }
}

class Player extends Sprite{
    constructor({ imageSrc, frameRate, animations}){
        super({imageSrc, frameRate, animations})
        this.position = {
            x:100,
            y:100
        }
    
        this.velocity ={
            x:0,
            y:0,
        }

        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1
    }

    update(){
        //c.fillStyle = 'rgba(0,0,225,0.5)'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        this.hitbox = {
            position:{
                x: this.position.x,
                y: this.position.y 
            },
            width: 50,
            height: 50,
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.sides.bottom = this.position.y + this.height 

        //above bottom of canvas
        if(this.sides.bottom + this.velocity.y < canvas.height){
            this.velocity.y += this.gravity 
        } else this.velocity.y = 0
        
    }

}
const player = new Player({
    imageSrc:'Sprites/01-King Human/Idle (78x58).png',
    frameRate: 11,
    animations: {
        idleRight:{
            frameRate: 11,
            frameBuffer: 2,
            loop:true,
            imageSrc:'Sprites/01-King Human/Idle (78x58).png',
        },
        idleLeft:{
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc:'Sprites/01-King Human/Idle (78x58).png',
        },
        runLeft:{
            frameRate: 8,
            frameBuffer: 2,
            loop: true,
            imageSrc: 'Sprites/01-King Human/Run (78x58).png',
        },
        runRight:{
            frameRate: 8,
            frameBuffer: 2,
            loop: true,
            imageSrc: 'Sprites/01-King Human/Run (78x58).png',
        },
        enterDoor:{
            frameRate: 8,
            frameBuffer: 4,
            loop: false,
            imageSrc:'Sprites/01-King Human/Door In (78x58).png'
        }
    }
})
const doors =[
    new Sprite({
        position:{
            x: 800,
            y: 507,
        },
        imageSrc:'Sprites/11-Door/Opening (46x56).png',
        frameRate:5,
        frameBuffer:5,
        loop: false,
        autoplay: false,
    }),
]

const backgroundLevel1 = new Sprite({
    position:{
        x:0,
        y:0,
    },
    imageSrc: 'NightForest/Reference (2).png',
})


const keys ={
    w:{
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d:{
        pressed: false,
    },

}

function animate(){
    window.requestAnimationFrame(animate)

    backgroundLevel1.draw()

    doors.forEach((door) => {
        door.draw()
    })
    player.handleInput(keys)
    player.this
    player.update()

}
animate()

window.addEventListener('keydown',(event)=>{
    switch(event.key){
        case "w":
            for(let i = 0; i < doors.length; i++){
                const door = doors[i]

                if(
                    player.hitbox.position.x <= door.position.x + door.width &&
                    player.hitbox.position.x + player.hitbox.width >= door.position.x &&
                    player.hitbox.position.y + player.hitbox.height >= door.position.y &&
                    player.hitbox.position.y <= door.position.y + door.height
                ) {
                    player.velocity.x = 0
                    player.velocity.y = 0
                    player.preventInput = true
                    player.switchSprite('enterDoor')
                    return
                }    

            }
            if(player.velocity.y ===0)player.velocity.y = -20

        break
        case 'a':
            keys.a.pressed = true
        break
        case 'd':
            keys.d.pressed = 4
        break

    }

})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'a':
            keys.a.pressed = false
        break
        case 'd':
            keys.d.pressed = false
        break

    }

})