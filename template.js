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



function main() {
    canvas_context.clearRect(0, 0, canvas.width, canvas.height)


}