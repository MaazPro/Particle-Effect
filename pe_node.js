const canvas = document.getElementById("canvas1");

// canvas width and height to current window size
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.width = window.innerHeight;

// stores randomized particles
let particlesArray;

// mouse position and the size of the area around the mouse
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

// targeting mouse position every time it moves
window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

//Create randomized particle object
class Particle {
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    //Each particle's x and y coordinates and they're not the same as mouse's x and y coordinates
    // This method also draws the particles 
    draw() {
        //ctx is the canvas1 object
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#800080';
        ctx.fill();
    }
    // This method will check particle's position, mouse position, movement and it will draw the particle   
    update(){
        // if statements checks if the particle is still within canvas
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.width || this.y < 0){
            this.directionY = -this.directionY;
        }

        // Check for collision detection including mouse position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                this.x += 10;
            }
            if(mouse.x > this.x && this.x > this.size * 10){
                this.x -= 10;
            }
            if(mouse.y > this.y && this.y < canvas.height - this.size * 10){
                this.y += 10;
            }
            if(mouse.y > this.y && this.y > this.size * 10){
                this.y -= 10;
            }
        }    
        // moving the particles that are not colliding with the mouse on x or y axis
        this.x += this.directionX;
        this.y += this.directionY;

        // this method will draw the particle and will run over and over again
        this.draw();
    }
}

// This method will randomize value for each particles and will push it in to our particleArray
function init (){
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for(let i = 0; i < numberOfParticles * 5; i++){
        let size = (Math.random() * 5) + 1 ;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = "#8C5523";

        particlesArray.push(new Particle (x, y, directionX, directionY, size, color ));
    }
}

// check if particles are close enough to draw a line between them
function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++){
        for(let b = a; b < particlesArray.length; b++){
            let distance = ((particlesArray[a].x - particlesArray[b].x)
            * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * 
            (particlesArray[a].y - particlesArray[b].y));
            if(distance < (canvas.width/7) * (canvas.height/7)){
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = "rgba(140,85,31," + opacityValue + ")";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.moveTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}


// animation loop
function animate (){
    // using request frame API for smooth
    requestAnimationFrame(animate);

    // Clear Rectangle or clearReact clears the old canvas paint
    ctx.clearRect(0,0, innerWidth, innerHeight);
    
    // for loop calls the update method for each particle
    for(let i = 0; i < particlesArray.length; i++){
        // update method is the same method that checks if the particle has collided with the wall. It updates particle's position accordingly and draws it.
        particlesArray[i].update();
    }
    connect();
}

// resize event
window.addEventListener('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    }
);

// mouse out event
window.addEventListener('mouseout',
function (){
    mouse.x = undefined;
    mouse.x = undefined;

}
);

init();
animate();
