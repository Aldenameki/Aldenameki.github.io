sgTools = {

    v2Equal(vector1, vector2) {
        return (vector1.x == vector2.x && vector1.y == vector2.y);
    },

    vec2(vector) {
        return {x: vector.x, y: vector.y};
    }
}

class Joystick {

    constructor() {

    }
    
    instance() {
        
        document.onclick = function(event) {
            
            let pos = {x: event.clientX, y: event.clientY};
            let size = {x: document.body.offsetWidth, y: document.body.offsetHeight};
            let third = {x: size.x/3, y: size.y/3};

            let flagMove = false;

            This.key = [256];

            if(third.x < pos.x && pos.x < 2*third.x) {

                if(pos.y < third.y) {
                    This.setKey('w'.charCodeAt(), true);
                    flagMove = true;
                }

                else if(2*third.y < pos.y) {
                    This.setKey('s'.charCodeAt(), true);
                    flagMove = true;
                }
            }

            else if(third.y < pos.y && pos.y < 2*third.y) {

                if(pos.x < third.x) {
                    This.setKey('a'.charCodeAt(), true);
                    flagMove = true;
                }

                else if(2*third.x < pos.x) {
                    This.setKey('d'.charCodeAt(), true);
                    flagMove = true;
                }
            }

            if(flagMove)
                This2.event();
        }
    }
}

class Keyboard {

    constructor() {
        this.key = [256];
    }

    instance(This) {

        document.onkeydown = function(event){
            This.updateKey(event, true);
            This2.event();
        }
    
        document.onkeyup = function(event){
            This.updateKey(event, false);
        }
    }

    updateKey(event, down=true) {
        this.setKey(event.key.charCodeAt(), down);
    }
    
    setKey(key, state) {
        this.key[key] = state;
    }

    keyPressed(key) {
        return this.key[key.charCodeAt()];
    }
}

class Canvas {

    constructor(canvasId) {

        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    drawRect(x, y, color='#000000', width=10, height=10) {
        
        let sizeX = this.canvas.width/width;
        let sizeY = this.canvas.height/height;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x*sizeX, y*sizeY, sizeX, sizeY);
    }

    clear(color='#ffffff') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Snake {

    constructor(x, y) {

        this.body = [];
        this.back = {x:x, y:y};
        this.direction = 1 // 1-right 2-bottom 3-left 4-right

        this.score = 0;

        this.body.push({x, y});
    }

    get length() {
        return this.body.length;
    }

    get head() {
        return this.body[0];
    }

    get tail() {
        return this.body[this.length-1]
    }

    updateBody() {
        
        this.back = sgTools.vec2(this.tail);

        for(let i=this.body.length-1; i>0; i--)
            this.body[i] = sgTools.vec2(this.body[i-1]);
    }

    grow() {

        this.body.push( sgTools.vec2(this.back));
        this.score++;
    }

    headStep() {

        let step = 1;

        switch (this.direction) {
            case 1:
                this.head.x += step;
                break;
        
            case 2:
                this.head.y += step;
                break;

            case 3:
                this.head.x -= step;
                break;

            case 4:
                this.head.y -= step;
                break;

            default:
                break;
        }
    }

    move() {

        this.updateBody();
        this.headStep();
    }

    moveFix(x1, x2, y1, y2) {
        
        if(this.head.x < x1)
            this.head.x = x2-1;

        else if(this.head.x >= x2)
            this.head.x = x1;
        
        if(this.head.y < y1)
            this.head.y = y2-1;

        else if(this.head.y >= y2)
            this.head.y = y1;
    }

    get selfCollision() {

        for(let i=1; i<this.length; i++) {
            
            if(sgTools.v2Equal(this.head, this.body[i]))
                return true;
        }

        return false;
    }

    bodyCollision(snake) {

        this.body.forEach( function(e) {

            if(this.head == e)
                return true;
        })

        return false;
    }
}

class SnakeGame {

    constructor(canvasId, scoreboardId, size=10, Interval=1000) {

        this.Keyboard = new Keyboard();
        this.Joystick = new Joystick();
        this.canvas = new Canvas(canvasId);
        this.scoreboard = document.getElementById(scoreboardId);
        this.size = size;

        this.initInterval = Interval;
        this.interval = 1*this.initInterval;
        this.lastTime = new Date();

        this.snake = null;
        this.fruit = [];

        this.spawSnake();
        this.addFruit();

        This = this.Keyboard;
        This2 = this;
        this.Keyboard.instance(This);
        this.Joystick.instance();

        this.render();
        this.appCycle();
    }

    spawSnake(x = parseInt(this.size/2), y = parseInt(this.size/2)) {

        this.snake = new Snake(x, y);
    }

    addFruit() {

        let pos = this.rand2d;

        for(let i=0; i<this.fruits; i++) {

            if(sgTools.v2Equal(this.fruit[i], pos)) {
                
                pos = this.rand2d;
                i=0;
            }
        }

        for(let i=0; i<this.snake.length; i++) {

            if(sgTools.v2Equal(this.snake.body[i], pos)) {
                
                pos = this.rand2d;
                i=0;
            }
        }

        this.fruit.push(pos);
    }

    get rand2d() {
        return {x: parseInt(Math.random()*this.size), y: parseInt(Math.random()*this.size)}
    }

    get fruits() {
        return this.fruit.length;
    }

    event() {
    
        let moveFlag = false;

        //action
        if(this.Keyboard.keyPressed('d') && this.snake.direction != 3) {
            this.snake.direction = 1;
            moveFlag = true;
        }

        if(this.Keyboard.keyPressed('s') && this.snake.direction != 4) {
            this.snake.direction = 2;
            moveFlag = true;
        }

        if(this.Keyboard.keyPressed('a') && this.snake.direction != 1) {
            this.snake.direction = 3;
            moveFlag = true;
        }

        if(this.Keyboard.keyPressed('w') && this.snake.direction != 2) {
            this.snake.direction = 4;
            moveFlag = true;
        }

        if(moveFlag)
            this.update();
    }

    update() {

        this.lastTime = new Date();
        
        this.snake.move();
        this.snake.moveFix(0, this.size, 0, this.size);

        if(this.snake.selfCollision)
            this.restart();

        for(let i=0; i<this.fruits; i++) {
            
            if(sgTools.v2Equal(this.snake.head, this.fruit[i])) {

                this.fruit.splice(i, 1);
                this.addFruit();
                this.snake.grow();
                this.scoreboard.textContent = "Score: " + this.snake.score;

                this.interval = (0.1+0.9*(1-this.snake.score/(this.size*this.size)))*this.initInterval;

                if(this.snake.score >= this.size*this.size) {
                    this.interval = 60000;
                    this.scoreboard.textContent = "Congratulations, you won!";
                }

                break;
            }
        }

        this.render();
    }

    render() {

        this.canvas.clear();

        //Snake Body
        for(let i=1; i<this.snake.length; i++) {
            
            this.canvas.drawRect(
                this.snake.body[i].x,
                this.snake.body[i].y,
                '#CCFF2B',
                this.size, this.size);
            }

        //Snake Head
        this.canvas.drawRect(
            this.snake.head.x,
            this.snake.head.y,
            '#89D038',
            this.size, this.size);
        
        for(let i=0; i<this.fruits; i++) {

            this.canvas.drawRect(
                this.fruit[i].x,
                this.fruit[i].y,
                '#FF3E00',
                this.size, this.size);
        }
    }

    appCycle() {

        let time = new Date();
        let elapsedTime = time - this.lastTime;

        if(elapsedTime >= this.interval)
            this.update();

        requestAnimationFrame(()=>this.appCycle());
    }

    restart() {

        this.fruit = [];
        this.spawSnake();
        this.addFruit();
        this.interval = 1*this.initInterval;
        this.scoreboard.textContent = "Score: 0";
    }
}

function startGame() {
    This = null;
    This2 = null;
    game = new SnakeGame("canvas1", "scoreboard1", 10, 1000);
}