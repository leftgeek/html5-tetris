function TetrisFactory(){}
TetrisFactory.prototype.shapes = new Array(
       [[0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],//I形
        [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0]],

       [[0,1,0,0,0,1,0,0,0,1,1,0,0,0,0,0],//L型
        [0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,1,0,0,0,1,0],
        [0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0]],

       [[0,0,1,0,0,0,1,0,0,1,1,0,0,0,0,0],//J型
        [0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,1,0,0,0,1,0,0],
        [0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0]],

       [[0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0],//T型
        [0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0]],

       [[0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0],//S型
        [0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0],
        [0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0]],

       [[0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0],//Z型
        [0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0],
        [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0]],

       [[0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],//O型
        [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0]]);
TetrisFactory.prototype.init = function(){
	
};

TetrisFactory.prototype.getTetris = function(shape, state){
	var tetris = new Array(16);
	for (var i = 0; i < 16; i++){
		tetris[i] = TetrisFactory.prototype.shapes[shape][state][i];
	}
	return tetris;
};

TetrisFactory.prototype.getRandomShape = function(){
	var shape = Math.round(Math.random() * 6);
	return shape;
}

TetrisFactory.prototype.getRandomState = function(){
	var state = Math.round(Math.random() * 3);	
	return state;
}

//以cx,cy为起点画方块画方块（不包括背景）
TetrisFactory.prototype.drawTetris = function(tetris, brush, cx, cy){
	var row, col;
	for (row = 0; row < 4; row++){
		for (col = 0; col < 4; col++){
			if (tetris[row * 4 + col] != 0){
				brush.draw(row + cy, col + cx, tetris[row * 4 + col]);
			}
		}
	}
};
//清除某一个方块，与drawTetris相反，画上背景色（不包括背景）
TetrisFactory.prototype.clearTetris = function(tetris, brush, cx, cy){
	var row, col;
	for (row = 0; row < 4; row++){
		for (col = 0; col < 4; col++){
			if (tetris[row * 4 + col] != 0){
				brush.draw(row + cy, col + cx, 0);
			}
		}
	}
};

//以cx,cy为起点画方块画方块（包括背景）
TetrisFactory.prototype.drawNextTetris = function(tetris, brush, cx, cy){
	var row, col;
	for (row = 0; row < 4; row++){
		for (col = 0; col < 4; col++){
			brush.draw(row + cy, col + cx, tetris[row * 4 + col]);
		}
	}
};
