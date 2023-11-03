const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16
canvas.height = 64 * 9

//blueprint of sprite//
var myMusic;

const audioObj = new Audio("dungeon.ogg");

audioObj.play();


class Sprite{
    constructor({position, imageSrc, frameRate = 1}){
        this.position = position
        this.image = new Image()
        this.image.onload =() =>{
            this.loaded = true
            this.width = this.image.width / this.frameRate
            this.height = this.image.height
        }
        this.image.src= imageSrc
        this.loaded = false
        this.frameRate = frameRate
        this.currentFrame = 0
        this.elapsedFrames = 0
        this.frameBuffer = 2
    }
    draw(){
        if(!this.loaded)return
        const cropbox = {
            position:{
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
    updateFrames(){
        this.elapsedFrames++

        if(this.elapsedFrames % this.frameBuffer === 0 ){
        if (this.currentFrame < this.frameRate - 1)this.currentFrame++
        else this.currentFrame = 0
        }
    }
}
//physics blueprint//
class Player extends Sprite{
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



//stored background image//
const backgroundLevel1 = new Sprite({
    position:{
        x:0,
        y:0,
    },
    imageSrc: 'NightForest/Reference (2).png',
})

//stored player image//
const player = new Player({
    imageSrc:'Sprites/01-King Human/Idle (78x58).png',
    frameRate: 11,
})
//stored tree images//
const tree =[
    new Sprite({
        position:{
            x:50,
            y:378,
        },
        imageSrc:"PNG/winter_conifer_tree_3.png",
    }),
    new Sprite({
        position:{
            x:500,
            y:357,
        },
        imageSrc:"PNG/birch_1.png",
    }),
    new Sprite({
        position:{
            x:700,
            y:342,
        },
        imageSrc:'PNG/winter_conifer_tree_2.png',
    }),
]
//stored npc images//
const pig =[
    new Sprite({
        frameRate: 11,
        position:{
            x:560,
            y:535,
        },
        imageSrc:'Sprites/03-Pig/Idle (34x28).png',
    }),
    new Sprite({
        frameRate:9,
        position:{
            x:790,
            y:535,
        },
        imageSrc:'Sprites/04-Pig Throwing a Box/Idle (26x30).png',
    })
]
//stored box image//

//stored door image//
const door =[
    new Sprite({
        position:{
            x:665,
            y:507,
        },
        imageSrc:'Sprites/11-Door/Idle.png',
    }),
]

const box=[
    new Sprite({
        position:{
            x:950,
            y:546,
        },
        imageSrc:'Sprites/08-Box/Idle.png'
    })
]

const keys = {
    w:{
        pressed: false,
    },
    a:{
        pressed: false,
    },
    d:{
        pressed: false,
    },
}


//invoking images//
function animate(){
    window.requestAnimationFrame(animate)

    backgroundLevel1.draw()

    tree.forEach((tree) =>{
        tree.draw()
    })

    pig.forEach((pig) =>{
        pig.draw()
    })

    door.forEach((door) => {
        door.draw()
    })

    box.forEach((box) => {
        box.draw()
    })


    player.velocity.x = 0
    if(keys.d.pressed) player.velocity.x = 5
    else if (keys.a.pressed) player.velocity.x = -5
    
    player.draw()
    player.update()
}
animate()
//invoking images//

//player movement//
window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'w':
            if(player.velocity.y === 0) player.velocity.y = -20
            
            break
        case'a':
        keys.a.pressed = true
        break
        case'd':
        keys.d.pressed = true
        break
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key){
        case'a':
        keys.a.pressed = false
        break
        case'd':
        keys.d.pressed = false
        break
    }
})
//player movement//