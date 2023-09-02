const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;


const BALL_RADIUS = 30;

// _______________---___classes

class Ball {

    constructor({color, radius, position}){
        this.color = color;
        this.radius = radius;
        this.position = {
            x: position.x,
            y: position.y
        }
    }

    
}