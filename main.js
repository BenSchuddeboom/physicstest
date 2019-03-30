
const ctx = document.getElementById('gameCanvas').getContext("2d")

const cube = {
    x: 0,
    y: 450,
    v: {
        x: 0,
        y: 0,
    },
    color: "green",
    w: 100,
    h: 100,
    jump: false,
    draw: () => {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, 800, 600)
        ctx.fillStyle = cube.color
        ctx.fillRect(cube.x, cube.y, cube.w, cube.h)   
    }
    
}   

class Bullet {
    constructor() {
        this.x = cube.x - 50;
        this.y = cube.y + 50;
        this.v = {x: -30, y: -30};
        this.color = "red";
        this.r = 10;
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.fill()
    }
}

const activeBullets = [];

const keyPress = {
    up: false,
    right: false,
    left: false,
    space: false,
    listener: (event) => {
  
      let keyActive = (event.type == "keydown") ? true : false;
  
      switch(event.keyCode) {
        //left
        case 37:
            keyPress.left = keyActive; 
        break;
        //up
        case 38:
            keyPress.up = keyActive;
        break;
        //right
        case 39:
            keyPress.right = keyActive;
        break;
        //spacebar
        case 32:
            keyPress.space = keyActive;
        break;
      } 
    }
}

function createBullet() {
    const bullet = new Bullet(50, 50)
    activeBullets.push(bullet)
    console.log(activeBullets)
    if(activeBullets.length > 5) {
        activeBullets.shift()
    }

}


window.addEventListener("keydown", keyPress.listener)
window.addEventListener("keyup", keyPress.listener)

function loop() {
    cube.draw()
    if(activeBullets[0]) {
        activeBullets.forEach((bullet) => {
            bullet.draw()
            bullet.x += bullet.v.x
            bullet.y += bullet.v.y
            bullet.v.y *= 0.97
            bullet.v.x *= 0.97
            bullet.v.y += 2

            if(bullet.y + bullet.r > 600 || bullet.y - bullet.r < 0) {
                bullet.v.y = -bullet.v.y * 0.9
            } else if (bullet.x - bullet.r < 0 || bullet.x + bullet.r > 800) {
                bullet.v.x = -bullet.v.x
            }

        })
    }
    //detecting keypresses
    if(keyPress.right && keyPress.up && cube.jump === false) {
        cube.v.x += 5
        cube.v.y -= 50
        cube.jump = true;
    } else if (keyPress.left && keyPress.up && cube.jump === false) {
        cube.v.x -= 5
        cube.v.y -= 50
        cube.jump = true;
    } else if(keyPress.up && cube.jump === false) {
        cube.v.y -= 50
        cube.jump = true;
    } else if(keyPress.left) {
        cube.v.x -= 5
    } else if(keyPress.right) {
        cube.v.x += 5
    } else if(keyPress.space && !cube.firing) {
        cube.firing = true;
        createBullet()
        setTimeout(() => cube.firing = false, 500)
    }

    //updating velocity     
    cube.v.x *= 0.9
    cube.x += cube.v.x

    cube.y += cube.v.y       
    cube.v.y *= 0.9
    cube.v.y += 2

    //simple collision detection
    if(cube.y + cube.h > 600) {
        cube.jump = false
        cube.v.y = 0
        cube.y = 600 - cube.h
    } else if (cube.x <= 0) {
        cube.x = 0
        cube.v.x = 2
    } else if(cube.x + cube.w >= 800) {
        cube.x = 800 - cube.w
        cube.v.x = -2
    }

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)