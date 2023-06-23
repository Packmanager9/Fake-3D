let canvas
let canvas_context
let keysPressed = {}
let FLEX_engine
let TIP_engine = {}
let XS_engine
let YS_engine
class LineOP {
    constructor(object, target, color, width) {
        this.object = object
        this.target = target
        this.color = color
        this.width = width
    }
    squareDistance() {
        let xdif = this.object.x - this.target.x
        let ydif = this.object.y - this.target.y
        let squareDistance = (xdif * xdif) + (ydif * ydif)
        return squareDistance
    }
    hypotenuse() {
        let xdif = this.object.x - this.target.x
        let ydif = this.object.y - this.target.y
        let hypotenuse = (xdif * xdif) + (ydif * ydif)
        return Math.sqrt(hypotenuse)
    }
    hypotenuseZ() {
        let xdif = this.object.x - this.target.x
        let ydif = this.object.z - this.target.z
        let hypotenuse = (xdif * xdif) + (ydif * ydif)
        return Math.sqrt(hypotenuse)
    }
    angle() {
        return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
    }
    angleZ() {
        return Math.atan2(this.object.z - this.target.z, this.object.x - this.target.x)
    }
}
class Circle {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw() {
        canvas_context.lineWidth = this.strokeWidth
        canvas_context.strokeStyle = this.color
        canvas_context.beginPath();
        canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
        canvas_context.fillStyle = this.color
        canvas_context.fill()
    }
    isPointInside(point) {
        this.areaY = point.y - this.y
        this.areaX = point.x - this.x
        if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
            return true
        }
        return false
    }
    doesPerimeterTouch(point) {
        this.areaY = point.y - this.y
        this.areaX = point.x - this.x
        if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
            return true
        }
        return false
    }
}
function setUp(canvas_pass, style = "#000000") {
    canvas = canvas_pass
    canvas_context = canvas.getContext('2d');
    canvas.style.background = style
    window.setInterval(function () {
        main()
    }, 20)
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });
    document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
    });
    window.addEventListener('pointerdown', e => {
        FLEX_engine = canvas.getBoundingClientRect();
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        TIP_engine.x = XS_engine
        TIP_engine.y = YS_engine
        TIP_engine.body = TIP_engine
        window.addEventListener('pointermove', continued_stimuli);
    });
    window.addEventListener('pointerup', e => {
        window.removeEventListener('pointermove', continued_stimuli);
    })
    function continued_stimuli(e) {
        FLEX_engine = canvas.getBoundingClientRect();
        TIP_engine.lastx = TIP_engine.x
        TIP_engine.lasty = TIP_engine.y
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        TIP_engine.x = XS_engine
        TIP_engine.y = YS_engine
        TIP_engine.body = TIP_engine
    }
}

let setup_canvas = document.getElementById('canvas')
setUp(setup_canvas)

class Point3D {
    constructor(x,y,z, color){
        this.x = x
        this.y = y
        this.z = z
        this.color = color // don't include the # because of the value shift function
    }
    valueShift(mag){
        let endstring = "#"

        let number = parseInt(this.color, 16)

        let r = (number >> 16) + mag
        if(r > 255){
            r = 255
        }else if(r < 16){
            r = 16
        }
        let b = (number >> 8) + mag
        if(b > 255){
            b = 255
        }else if(r < 16){
            b = 16
        }
        let g = (number >> 1) + mag
        if(g > 255){
            g = 255
        }else if(r < 16){
            g = 16
        }

        return endstring + (g | (b<<8) | (r << 16)).toString(16)

    }
    draw(){
        let circ = new Circle((this.x*120)+350, (this.y*120)+350, 10, this.valueShift(100-(255*(this.z*2/3))))
        circ.draw()
    }
}

class ThreeDeeObject{
    constructor(){
        this.center = new Point3D(0, 0, 0, "00FF00")
        this.dots = []
        this.links = []
        for(let k = 0;k<16;k++){
            for(let t = 0;t<50;t++){
                let dis = .63-((k/17)*.63)
                let a = (t/50)*6.28
                let r = k*(t/2)
                let g = k*k
                let b = t*5
                let strng =   (g | (b<<8) | (r << 16)).toString(16)
                let point = new Point3D(Math.sin(a)*dis, k/10, Math.cos(a)*dis, "#FF0000")
                this.dots.push(point)
                this.links.push(new LineOP(this.center, point))
            }
        }
    }
    draw(){

        let pairs = []
        for(let t = 0 ;t<this.dots.length;t++){
            pairs.push([this.dots[t], this.links[t]])
        }
        pairs.sort((a,b) => a[0].z > b[0].z ? -1:1)

        this.links = []
        for(let t = 0;t<pairs.length;t++){
            this.dots[t] = pairs[t][0]
            this.links.push(new LineOP(this.center, this.dots[t]))
        }

        if(keysPressed['a']){
            this.rotateZ(.01)
        }
        if(keysPressed['d']){
            this.rotateZ(-.01)
        }
        
        if(keysPressed['w']){
            this.rotateY(.011)
        }
        if(keysPressed['s']){
            this.rotateY(-.011)
        }
        for(let t = 0 ;t<this.dots.length;t++){
            this.dots[t].draw()
        }

    }
    rotateZ(angle){
        for(let t = 0 ;t<this.dots.length;t++){
            let ang = this.links[t].angleZ()
            let length = this.links[t].hypotenuseZ()
            this.dots[t].x = (-Math.cos(ang-angle)) * length
            this.dots[t].z = (-Math.sin(ang-angle)) * length
        }
    }
    rotateY(angle){
        for(let t = 0 ;t<this.dots.length;t++){
            let ang = this.links[t].angle()
            let length = this.links[t].hypotenuse()
            this.dots[t].x = (-Math.cos(ang-angle)) * length
            this.dots[t].y = (-Math.sin(ang-angle)) * length
        }
    }
}

let flooble = new ThreeDeeObject()

function main() {
    canvas_context.clearRect(0, 0, canvas.width, canvas.height)
    flooble.draw()

}