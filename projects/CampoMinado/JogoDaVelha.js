function Matrix(row, col, value) {  //Cria uma array bidimensional e preenche com o que estiver no value
    var arr = [];

    for(var i=0; i<row; i++){
        var column = [];

        for(var j=0; j<col; j++){
            column[j] = new value.constructor();
        }
        arr[i] = column;
    }

    return arr;
}

class Cell {    //representa cada célula do jogo

    constructor(bomb=false, mines=0, hidden=true, exposed=false) {
        this.bomb = bomb;
        this.mines = mines;
        this.hidden = hidden;
        this.exposed = exposed
    }
}

class Game {    //A engine do jogo

    constructor(canvasId, scoreId, rows=10, cols=10) {
        this.COLOR_DEFAULT = '#b3b3cc';
        this.COLOR_NOTHING = '#AAAAAA';
        this.COLOR_BOMB = '#FF0000';

        this.canvas = document.getElementById(canvasId);
        this.c = this.canvas.getContext('2d');

        //this.score = document.getElementById("table1").getElementsByTagName("td")[1];
        this.score = document.getElementById("score1");

        this.rows;
        this.cols;
        this.xSSize;
        this.ySSize;
        this.map = [];
        this.bombs;
        this.point;
        this.set(rows, cols);
        this.setScore(0);

        this.canvas.addEventListener('mousedown', (e) => {this.getClick();});
    }

    set(rows, cols) {   //Configura o jogo
        this.rows = rows;
        this.cols = cols;
        this.xSSize = this.canvas.height / this.rows;
        this.ySSize = this.canvas.width / this.cols;
        this.map = Matrix(this.rows, this.cols, new Cell());
        this.bombs = 0;
        this.point = 0;
    }

    clear() {   //Reseta o jogo
        this.bombs = 0;
        this.point = 0;
        this.setScore(this.point);

        for(var i=0; i<this.rows; i++){
            for(var j=0; j<this.cols; j++){
                this.map[i][j] = new Cell(false, 0, true, false);
            }
        }
    }

    putBomb(amount) {   //Adiciona bombas ao jogo

        if(this.bombs+amount > this.mapSize){
            amount = this.mapSize-this.bombs-1;
        }
        
        this.bombs += amount;

        for(var i=0; i<amount; i++){
            var ready = false;

            while(!ready){
                var r = parseInt(Math.random()*this.rows);
                var c = parseInt(Math.random()*this.cols);

                if(this.map[r][c].bomb == false){
                    this.map[r][c].bomb = true;
                    ready = true;
                }
            }
        }

        this.countMines();
    }

    setScore(points) {
        this.score.innerHTML = points;
    }

    countMines() {  //Coloca em todas as células, quantas bombas tem ao redor de cada uma
        for(var i=0; i<this.rows; i++){
            for(var j=0; j<this.cols; j++){
                this.map[i][j].mines = this.aroundMines(i, j);
            }
        }
    }

    aroundMines(row, col) { //Calcula e retorna quantas bombas tem ao redor da célula
        var mines = 0;

        for(var i=-1; i<2; i++){
            for(var j=-1; j<2; j++){
                if(0 <= row+i && row+i < this.rows && 0 <= col+j && col+j < this.cols){
                    if(this.map[row+i][col+j].bomb)
                        mines++;
                }
            }
        }

        return mines;
    }

    getClick() {    //Função executada quando clicar no canvas e tem a função de descobrir qual celula foi clicada
        const cv = this.canvas.getBoundingClientRect();
        const x = event.clientX - cv.left;
        const y = event.clientY - cv.top;

        const row = parseInt(x/this.xSSize);
        const col = parseInt(y/this.ySSize);

        //console.log("Clicked in canvas on X " + x + " y " + y + " row " + row + " col " + col);

        this.select(row, col);
    }

    select(row, col) {  //Executa as ações na célula clicada com o mouse
        var cell = this.map[row][col];

        if(cell.bomb){
            this.gameOver();
            return;
        } else {
            this.discover(row, col);
        }

        this.setScore(this.point);
        this.draw();

        if(this.point >= this.mapSize-this.bombs)
            this.youWin();
    }

    discover(row, col) {    //Função recursiva para revelar todas as células sem bombas ao redor de uma vez
        var h = this.map[row][col].hidden;
        this.map[row][col].hidden = false;

        if(h)
            this.point++;

        if(this.map[row][col].mines != 0 || !h)
            return;

        for(var i=-1; i<2; i++){
            for(var j=-1; j<2; j++){
                if(0 <= row+i && row+i < this.rows && 0 <= col+j && col+j < this.cols){
                    this.discover(row+i, col+j);
                }
            }
        }
    }

    youWin() {
        for(var i=0; i<this.rows; i++){
            for(var j=0; j<this.cols; j++){
                this.map[i][j].hidden = false;
            }
        }

        this.draw();

        this.drawText(5,10, 'Você ganhou!', '40', 'Arial', '#00ff00');
    }

    gameOver() {    //É executada quando clica em uma bomba e então o jogo acaba
        for(var i=0; i<this.rows; i++){
            for(var j=0; j<this.cols; j++){
                this.map[i][j].hidden = false;
            }
        }

        this.draw();

        this.drawText(5,10, 'Você perdeu!', '40', 'Arial', '#000000');
    }

    get mapSize() { return this.rows*this.cols; }

    drawRect(x=0, y=0, width=0, height=0, color='#000000'){ //desenha retângulos no canvas
        this.c.fillStyle = color;
        this.c.fillRect(x, y, width, height);
    }

    drawText(x=0, y=0, text='', size='10', font='Arial', color='#000000') {  //desenha textos no canvas
        y += this.ySSize;
        this.c.font = size + "px " + font;
        this.c.fillStyle = color;
        this.c.fillText(text, x, y);
    }

    drawCell(x=0, y=0, bombs=0, color=this.COLOR_DEFAULT) { //desenha uma célula (retângulo + texto) no canvas
        this.drawRect(x, y, this.xSSize, this.ySSize, color);
        if(bombs > 0)
            this.drawText(x, y, parseInt(bombs), this.ySSize*0.8);

    }

    clearScreen() { //Limpa a tela (canvas)
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {    //Desenha a tela do jogo
        this.clearScreen();

        for(var i=0; i<this.rows; i++){
            for(var j=0; j<this.cols; j++){
                var X = i*this.xSSize;
                var Y = j*this.ySSize;

                if(this.map[i][j].hidden === true)
                    this.drawCell(X, Y, this.COLOR_DEFAULT);
                else{
                    if(this.map[i][j].bomb == true)
                        this.drawCell(X, Y, 0, this.COLOR_BOMB);
                    else
                        this.drawCell(X, Y, this.map[i][j].mines, this.COLOR_NOTHING);
                }
            }
        }
    }
}

function configureGame() {
    var itB = document.getElementById('it_bomb');
    var itR = document.getElementById('it_row');
    var itC = document.getElementById('it_column');
    
    if(itR.value == '' || itC.value == '')
        g = new Game('canvas1', 'score1', 10, 10);
    else
        g = new Game('canvas1', 'score1', itC.value, itR.value);
        
    if(itB.value == '')
        g.putBomb(10);
    else
        g.putBomb(itB.value);
    g.draw();
}

function main() {
    var button1 = document.getElementById('b1');
    button1.firstChild.data = 'Recomeçar';
    button1.onclick = restart;

    configureGame();
}

function restart() {
    configureGame();
}