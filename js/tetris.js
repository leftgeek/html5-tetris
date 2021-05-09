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
/*
myrand = (function(){
  var today = new Date();
  var seed = today.getTime();
  function rnd(){
    seed = (seed * 9301 + 49297) % 233280;
    return seed / (233280.0);
  };
  return function rand(number){
    return Math.ceil(rnd() * number);
  };
})();*/
TetrisFactory.prototype.getRandomShape = function(){
	var shape = Math.round(Math.random() * 6);
	//var shape = Math.round(myrand(6));
	return shape;
}

TetrisFactory.prototype.getRandomState = function(){
	var state = Math.round(Math.random() * 3);	
	//var state = Math.round(myrand(3));
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

//方块第一个不是全0的行,用来计算它占用的高度
TetrisFactory.prototype.countTetrisFirstRowNotZero = function(tetris){
  var row = 0;
  while ((tetris[row * 4] == 0)
      && (tetris[row * 4 + 1] == 0)
      && (tetris[row * 4 + 2] == 0)
      && (tetris[row * 4 + 3] == 0)){
    if (row == 3){
      break;
    }
    row++;
  }
  return row;
};
//方块最后一个不是全0的行,用来计算它占用的高度
TetrisFactory.prototype.countTetrisLastRowNotZero = function(tetris){
  var row = 3;
  while ((tetris[row * 4] == 0)
      && (tetris[row * 4 + 1] == 0)
      && (tetris[row * 4 + 2] == 0)
      && (tetris[row * 4 + 3] == 0)){
    if (row == 0){
      break;
    }
    row--;
  }
  
  return row;
};
//方块第一个不是全0的列,用来计算它的起点
TetrisFactory.prototype.countTetrisFirstColNotZero = function(tetris){
  var col = 0;
  while ((tetris[col] == 0)
      && (tetris[4 + col] == 0)
      && (tetris[2 * 4 + col] == 0)
      && (tetris[3 * 4 + col] == 0)){
    if (col == 3){
      break;
    }
    col++;
  }
  return col;
};
TetrisFactory.prototype.countTetrisLastColNotZero = function(tetris){
  var col = 3;
  while ((tetris[col] == 0)
      && (tetris[4 + col] == 0)
      && (tetris[2 * 4 + col] == 0)
      && (tetris[3 * 4 + col] == 0)){
    if (col == 0){
      break;
    }
    col--;
  }
  return col;
};
