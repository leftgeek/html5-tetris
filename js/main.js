function Main(){}
Main.prototype.brush = new Brush();//画主游戏方块区
Main.prototype.nextBrush = new Brush();//画下一个方块区
Main.prototype.letterBrush = new Brush();//画字母
Main.prototype.map = new Map();
Main.prototype.tetrisFactory = new TetrisFactory();
Main.prototype.letterFactory = new LetterFactory();
Main.prototype.currentLetter = 0;
Main.prototype.currentType = 0;//方块类型
Main.prototype.currentState = 0;//方块状态

Main.prototype.enableAI = false;
Main.prototype.isCalcAI = false;
Main.prototype.totalNumTetris = 0;//总共发出的方块数量
Main.prototype.AITargetTetrisState = 0;//AI计算的目标方块姿态
Main.prototype.AITargetX = 0;//AI计算的目标方块水平位置
Main.prototype.increaseBlocks = 0;
Main.prototype.reduceBadBlocks = 1;
Main.prototype.decreaseHeight = 2;
Main.prototype.badBlocksSensor = 4;//对坏块的敏感程度
Main.prototype.badBlocksRange = 1;//对坏块的敏感程度
//Main.prototype.lastRowDepth = 18;//上次的整体块深度

Main.prototype.cx = 0;//方块左上角x坐标
Main.prototype.cy = 0;//方块左上角y坐标
Main.prototype.nextType = 0;//下一个方块类型
Main.prototype.nextState = 0;//下一个方块状态
Main.prototype.currentColor = 0;//下一个方块颜色
Main.prototype.nextColor = 0;//下一个方块颜色
Main.prototype.speed = 1000;//方块速度
Main.prototype.gameStop = true;//游戏是否暂停/停止
Main.prototype.currentTetris = new Array();//当前方块
Main.prototype.nextTetris = new Array();//下一个方块
Main.prototype.timer = null;//定时器
Main.prototype.levelMark = 0;//分数
Main.prototype.totalMark = 0;//总分数
Main.prototype.totalClearedLines = 0;//总消去的行数
Main.prototype.totalElapsedTime = 0;//总时间
//Main.prototype.maxNumLines = 20;//最多1000行
Main.prototype.maxNumLines = 10000;//最多1000行

Main.prototype.init = function(){
	//注册键盘处理函数
	document.onkeydown = this.keyDown;
	//初始化画笔
	//this.brush = new Brush();//画主游戏方块区
	
	//if (!this.brush.init("board", 26, "#AAAAAA")){
	if (!this.brush.init("board", 26, "#CCC")){
		alert("HTML5 is not supported!");
		return false;
	}
	//this.nextBrush = new Brush();//画下一个方块区
	//this.nextBrush.init("preview", 26, "#AAAAAA");
	//this.letterBrush.init("paper", 18, "#AAAAAA")
	this.nextBrush.init("preview", 26, "#CCC");
	this.letterBrush.init("paper", 18, "#CCC")
	//初始化地图
	//this.map = new Map();
	this.map.init(18, 12);
	//this.map.init(36, 12);
	this.map.draw(this.brush);
	//初始化方块制造工厂
	//this.tetrisFactory = new TetrisFactory();
	this.tetrisFactory.init();
	//初始化字母工厂
	this.letterFactory.init();
	//设定方块参数
  Main.prototype.totalNumTetris = 0;
	Main.prototype.currentType = 0;//方块类型
	Main.prototype.currentState = 0;//方块状态
	Main.prototype.cx = 0;//方块左上角x坐标
	Main.prototype.cy = 0;//方块左上角y坐标
	Main.prototype.nextType = 0;//下一个方块类型
	Main.prototype.nextState = 0;//下一个方块状态
	Main.prototype.currentColor = 0;//下一个方块颜色
	Main.prototype.nextColor = 0;//下一个方块颜色
	Main.prototype.speed = 1000;//方块速度
	Main.prototype.gameStop = true;//游戏是否暂停/停止

	//初始化下一个方块
	this.makeNextTetris();
	this.tetrisFactory.drawNextTetris(this.nextTetris, this.nextBrush, 0, 0);
};
//创造下一个方块
Main.prototype.makeNextTetris = function(){
	Main.prototype.nextType = this.tetrisFactory.getRandomShape();
	Main.prototype.nextState = this.tetrisFactory.getRandomState();
	Main.prototype.nextTetris = this.tetrisFactory.getTetris(this.nextType, this.nextState);
	Main.prototype.nextColor = 1 + Math.round(Math.random() * 3);//随机改变方块颜色
	for (var i = 0; i < 16; i++){
		if (this.nextTetris[i] != 0){
			Main.prototype.nextTetris[i] = this.nextColor;
		}
	}
};

Main.prototype.keyDown = function(e){
	e = e || window.event;
	switch (e.keyCode){
		case 37://左键
			if (!Main.prototype.gameStop && Main.prototype.currentLetter < Main.prototype.maxNumLines){
				Main.prototype.moveLeft();
			}
			break;
		case 38://上键
			if (!Main.prototype.gameStop && Main.prototype.currentLetter < Main.prototype.maxNumLines){
				Main.prototype.switchState();
			}
			break;
		case 39://右键
			if (!Main.prototype.gameStop && Main.prototype.currentLetter < Main.prototype.maxNumLines){
				Main.prototype.moveRight();
			}
			break;
		case 40://下键
			if (!Main.prototype.gameStop && Main.prototype.currentLetter < Main.prototype.maxNumLines){
				Main.prototype.moveDown();
			}
			break;
		default:
			break;
	}
};

//Tetris-AI
//判断指定方块是否允许存在于(移动到)地图的指定x,y处
Main.prototype.canMove = function(tetris, x, y){
  var row, col;
  for (row = 0; row < 4; row++){
    for (col = 0; col < 4; col++){
      if ((this.map.getMapState(row + y, col + x) != 0)
          && (tetris[row * 4 + col] != 0)){
        return false;
      }
    }
  }
  return true;
};

//计算指定方块所在投影区间内的所有列的坏格子数量
//但是如果堆积的块高度太高后,再考虑压在底层的坏块就没意义了
//所以只考虑一定范围内的坏块数量
//这个范围就是方块的最下层不全不为的一行,到+range的这个范围
Main.prototype.countTetrisBadColBlocks = function(tetris, x, y, range){
  var numBadBlocks = 0;
  var col = this.tetrisFactory.countTetrisFirstColNotZero(tetris);
  var maxCol = this.tetrisFactory.countTetrisLastColNotZero(tetris);
  var maxTetrisDepth = this.tetrisFactory.countTetrisLastRowNotZero(tetris) + 1;
  var row;
  var maxDepth;
  for (; col <= maxCol; col++){
    row = 0;
    //跳过所有空白格子,找到第一个非空白的格子
    while (tetris[row * 4 + col] == 0){
      row++;
      if (row == 4){
        break;
      }
    }
    if (row == 4){//某一列全部为空的话,那么下方就没有坏块
      continue;
    }
    //从row+1表示的垂直位置开始,一直到地图底部,数其中的空白格子数量
    //这就是坏格子的数量
    //但是由于该方块还没到达指定地点,因此需要分开计算
    row++;
    maxDepth = maxTetrisDepth;
    while (row < maxDepth){
      //只计算由方块产生的坏格子
      if (this.map.getMapState(y + row, x + col) != 0){
        break;
      }
      if ((tetris[row * 4 + col] == 0)
        && (this.map.getMapState(y + row, x + col) == 0)){
        numBadBlocks++;
      }
      row++;
    }
    maxDepth = Math.min(maxDepth + range, this.map.getRowCount());
    //再计算方块下面的地图上的空位置
    //从方块产生的空档开始,到下面的地图上的第一个非空方块为止
    //期间的连续空白格子就是由放置方块所产生的坏格子数量
    while (row < maxDepth){
      if (this.map.getMapState(y + row, x + col) == 0){
        numBadBlocks++;
      }
      row++;
    }
  }
  return numBadBlocks;
};
//计算地图上某一列的全部坏块数量
Main.prototype.countBadColBlocks = function(col){
  var numBadBlocks = 0;
  var maxCol = Math.min(col + 4, this.map.getColCount()) - 1;
  if (col < 0){
    col = 0;
  }
  var row;
  for (; col <= maxCol; col++){
    row = 0;
    //跳过所有空白格子,找到第一个非空白的格子
    while (this.map.getMapState(row, col) == 0){
      row++;
    }
    
    //从row+1表示的垂直位置开始,一直到地图底部,数其中的空白格子数量
    //这就是坏格子的数量
    row++;
    while (row < this.map.getRowCount()){
      if (this.map.getMapState(row, col) == 0){
        numBadBlocks++;
      }
      row++;
    }
  }
  return numBadBlocks;
};
//计算当前的地图堆积块高度
Main.prototype.calcMapRowDepth = function(){
  var depth = 0;
  while (this.map.rowBlockCount[depth] == 0){
    depth++;
    if (depth == this.map.getRowCount()){
      break;
    }
  }
  return depth;
};

Main.prototype.evaluatePriority = function(){
  //var topPriority = Main.prototype.increaseBlocks;
  //var topPriority = Main.prototype.decreaseHeight;
  var topPriority = Main.prototype.reduceBadBlocks;
  var depth = this.calcMapRowDepth();
  //Main.prototype.badBlocksSensor = 3 + (depth / 12);
  //根据块的堆积高度来决定优先级
  //堆积高度每增长超过2,就调整优先级为填充间隙
  if (depth <= this.map.getRowCount() / 3){
    topPriority = Main.prototype.decreaseHeight;
    //Main.prototype.badBlocksRange = 1;
  } else if (depth <= this.map.getRowCount() * 2 / 3){
    //topPriority = Main.prototype.reduceBadBlocks;
    topPriority = Main.prototype.increaseBlocks;
  }
  
  return topPriority;
};


//计算某个方块在指定行的非空格子数量
Main.prototype.countRowBlockofTetris = function(tetris, row){
  var numRowBlock = 0;
  var col;
  for (col = 0; col < 4; col++){
    if (tetris[row * 4 + col] != 0){
      numRowBlock++;
    }
  }
  return numRowBlock;
};

//计算某个方块落到指定位置后,计算可清除的行数
Main.prototype.countRows2Clear = function(tetris, y){
  var numRowsCanClear = 0;
  var numRowBlock;
  var row;
  for (row = 0; row < 4 && (y + row < this.map.getRowCount()); row++){
    //既然方块能够到达此处,说明它能够填补上此处的间隙
    //那么直接根据填补后的总数量来判断该行是否被填满
    numRowBlock = this.map.rowBlockCount[y + row]
      + Main.prototype.countRowBlockofTetris(tetris, row);
    if (numRowBlock == this.map.getColCount()){
      numRowsCanClear++;
    }
  }
  return numRowsCanClear;
};

Main.prototype.countTetrisRowBlocks = function(tetris, y){
  var numRowBlock = 0;
  var row = this.tetrisFactory.countTetrisFirstRowNotZero(tetris);
  var maxRow = this.tetrisFactory.countTetrisLastRowNotZero(tetris);
  var numRows = maxRow - row + 1;
  for (; row <= maxRow; row++){
    if (y + row >= this.map.getRowCount()){
      break;
    }
    //既然方块能够到达此处,说明它能够填补上此处的间隙
    //那么直接根据填补后的总数量来判断该行是否被填满
    numRowBlock += this.map.rowBlockCount[y + row]
      + this.countRowBlockofTetris(tetris, row);
  }
  //采用平均的填补数量会导致方块尽量平放,而忽略了增加的坏块数量
  //而不采用平均会导致方块尽量竖着放,容易增加高度
  //除非我们在计算方块所在行的总格子数时考虑坏块数量
  //这里采用折衷的办法,把numRows加入进去
  //return (numRowBlock / numRows);
  return ((numRowBlock + (numRows / 2)) / numRows);
};

Main.prototype.TetrisAI = function(){
  Main.prototype.isCalcAI = true;
  var targetTetrisState = this.currentState;  //目标方块的姿态
  var targetX = 0; //目标方块的水平下落位置
  //var targetTetrisArray = new Array();//目标的方块存放在这里
  //var targetXArray = new Array();//每个目标方块的水平下落位置
  //var maxRowCanClear = 0;//能够清除的最大行数
  var maxRowBlock = 0;//最大的非空格子数量
  var targetBadBlocks = 1000;  //由方块产生的坏格子数量
  var targetDepth = 0; //目标方块在指定水平位置产生的整体深度(距离顶部的高度)
  var targetRows2Clear = 0;
  var targetTotalBadBlocks = 0;//方块所在下方的全部坏格子数量

  //对于给定的方块,它有4种形态
  /*var tetris0 = this.tetrisFactory.getTetris(this.currentType, 0);
    var tetris1 = this.tetrisFactory.getTetris(this.currentType, 1);
    var tetris2 = this.tetrisFactory.getTetris(this.currentType, 2);
    var tetris3 = this.tetrisFactory.getTetris(this.currentType, 3);*/
    //从左到右考察所有落地地点
  //对于指定落地地点的col,看它的最高点row位置,以判断方块的落地地点row
  var x, y; //考察的方块水平和垂直位置
  var tetrisState;
  var row, col, i;
  /*var allTetris = new Array(4);
  for (i = 0; i < 4; i++){
    allTetris[i] = this.tetrisFactory.getTetris(this.currentType,
        (this.currentState + i) % 4);
  }*/

  //考察每一种方块,在每种水平位置的收益
  var tetris;
  //Main.prototype.showMessage("ai1:" + this.currentType + ", " + this.currentState);
  for (i = 0; i < 4; i++){
    tetrisState = (this.currentState + i) % 4;
    tetris = this.tetrisFactory.getTetris(this.currentType, tetrisState);
    //先按x(水平位置)考察,从方块的第一列不为0的开始

    //奇数个从左到右扫描,偶数个从右到左扫描
    /*var xRange;
    var xStep;
    if (Main.prototype.totalNumTetris % 2 == 0){
      x = -3;
      xRange = this.map.getColCount() - 1;
      xStep = 1;
    } else {
      x = this.map.getColCount() - 1;
      xRange = -4;
      xStep = -1;
    }*/
    for (x = -3; x < this.map.getColCount(); x++){
    //for (; x != xRange; x += xStep){
      //再判断方块能够下落到的y(垂直位置)
      y = this.cy;  //方块一直在下落
      if (y < 0){
        y = 0;
      }
      //if (!Main.prototype.canMove(allTetris[i], x, y)){
      if (!Main.prototype.canMove(tetris, x, y)){
        continue;
      }
      //方块最大宽度为4,判断这块空间是不是全空,如果全空就可以一直往下掉
      //方块下方开始,所以得y+4
      while (((y + 4) < this.map.getRowCount())){
        var px = x;
        if (x < 0){
          px = 0;
        }
        while (px < x + 4){
          if (!this.map.getMapState(y + 4, px)){
            px++;
          } else {
            break;
          }
        }
        if (px == x + 4){
          y++;
        } else {
          break;
        }
      }
      /*while (((y + 4) < this.map.getRowCount())
        && (this.map.getMapState(y + 4, x) == 0)
        && (this.map.getMapState(y + 4, x + 1) == 0)
        && (this.map.getMapState(y + 4, x + 2) == 0)
        && (this.map.getMapState(y + 4, x + 3) == 0)){
        y++;
      }*/
      //此时地图的垂直位置y开始的地方已经存在非空的格子了
      //需要做更加精细的判断
      while ((y < this.map.getRowCount())
          //&& Main.prototype.canMove(allTetris[i], x, y)){
          && Main.prototype.canMove(tetris, x, y + 1)){//这是看是否能够往下移动(下落)
        y++;
      }

      //此时的y就是方块在x处最终能够下落到的垂直位置
      //记录到此时的x和y
      //评估某个姿态的方块落在某个位置时能够产生的收益
      //包括能够消除的行数量,产生的坏格子数量(根据水平投影范围),等效方块增量,整体的高度
      //(1)先计算能够消除的行数量
      /*var numRowBlockArray = Main.prototype.countRowBlock(allTetris[i], y);
      var numRowCanClear = 0;
      for (row = 0; row < 4; row++){
        if (numRowBlockArray[row] == this.map.getColCount()){
          numRowCanClear++;
        }
      }*/
      //简化版:直接选择方块所在的所有行的总格子数最多的
      //因为这意味着产生的消除行的数量也可能是最多的
      //var numTetrisRowBlock = Main.prototype.countTetrisRowBlocks(allTetris[i], y);
      var rows2Clear = this.countRows2Clear(tetris, y);  
      var numTetrisRowBlock = this.countTetrisRowBlocks(tetris, y);
      var numBadBlocks = this.countTetrisBadColBlocks(tetris, x, y,
        Main.prototype.badBlocksRange);
      var depth = y + this.tetrisFactory.countTetrisFirstRowNotZero(tetris);
      rows2Clear -= numBadBlocks / 2;//FIXME
      if (rows2Clear < 0){
        rows2Clear = 0;
      }
      numTetrisRowBlock -= numBadBlocks * Main.prototype.badBlocksSensor;//FIXME:等效填充的格子数量
      if (numTetrisRowBlock < 0){
        numTetrisRowBlock = 0;
      }
      depth -= numBadBlocks / 2;//FIXME

      var updateTetris = false;//是否替换方块方案
      //优先选择能够消除的行数最多的
      if (rows2Clear > targetRows2Clear){
        updateTetris = true;
      } else if (rows2Clear == targetRows2Clear){
        //其次选择能够填补最多格子的
        if (numTetrisRowBlock >= maxRowBlock){
          var numTotalBadBlocks = this.countTetrisBadColBlocks(tetris, x, y,
                  this.map.getRowCount());
          var topPriority = this.evaluatePriority();
          if ((topPriority == Main.prototype.decreaseHeight)
              && (depth >= targetDepth)){
            if (depth > targetDepth){
              updateTetris = true;
            } else if (numBadBlocks < targetBadBlocks){
              updateTetris = true;
            } else if (numTetrisRowBlock > maxRowBlock){
              updateTetris = true;
            } else if (numTotalBadBlocks < targetTotalBadBlocks){
              updateTetris = true;
            }
          } else if ((topPriority == Main.prototype.reduceBadBlocks)
              && (numBadBlocks <= targetBadBlocks)){
            if (numBadBlocks < targetBadBlocks){
              updateTetris = true;
            } else if (depth > targetDepth){
              updateTetris = true;
            } else if (numTetrisRowBlock > maxRowBlock){
              updateTetris = true;
            } else if (numTotalBadBlocks < targetTotalBadBlocks){
              updateTetris = true;
            }
          } else if (topPriority == Main.prototype.increaseBlocks){
            if (numTetrisRowBlock > maxRowBlock){
              updateTetris = true;
            } else if (numBadBlocks < targetBadBlocks){
              updateTetris = true;
            } else if (depth > targetDepth){
              updateTetris = true;
            } else if (numTotalBadBlocks < targetTotalBadBlocks){
              updateTetris = true;
            }
          }
        }
      }

      if (updateTetris){
        targetRows2Clear = rows2Clear;
        maxRowBlock = numTetrisRowBlock;
        targetX = x;
        targetTetrisState = tetrisState;
        targetBadBlocks = numBadBlocks;
        targetDepth = depth;
        targetTotalBadBlocks = numTotalBadBlocks;
      }
    }
  }
  Main.prototype.AITargetTetrisState = targetTetrisState;
  Main.prototype.AITargetX = targetX;
  /*Main.prototype.appendMessage("<br/>@rows2Clear=" + targetRows2Clear
      + ", rowBlock="+ maxRowBlock
      + ", lastRowDepth=" + Main.prototype.lastRowDepth
      + ", badBlocks=" + targetBadBlocks);
      //+ ", depth=" + targetDepth);
      //+ ", X=" + targetX);
 */ 
  Main.prototype.isCalcAI = false;
};

Main.prototype.AIChangeTetrisState = function(){
  var i;
  //至此已经获取到了targetX和targetTetrisState
  //开始对当前的方块进行姿势调整和移动
  for (i = Main.prototype.currentState; i != Main.prototype.AITargetTetrisState; i = (i + 1) % 4){
		Main.prototype.switchState();
  }
};

Main.prototype.AIMoveTetris = function(){
  var x;
  if (Main.prototype.cx < Main.prototype.AITargetX){
    //往右移动
    for (x = Main.prototype.cx; x < Main.prototype.AITargetX; x++){
      Main.prototype.moveRight();
    }
  } else if (Main.prototype.cx > Main.prototype.AITargetX){
    //往左移动
    for (x = Main.prototype.cx; x > Main.prototype.AITargetX; x--){
      Main.prototype.moveLeft();
    }
  }
};
//AI end


Main.prototype.moveLeft = function(){
	if (this.cx > -4){
		var row, col;
		for (row = 0; row < 4; row++){
			for (col = 0; col < Math.min(4, this.map.getColCount() - this.cx); col++){
				if ((this.map.getMapState(row + this.cy, col + this.cx - 1) != 0)
					&& (this.currentTetris[row * 4 + col] != 0)){//can not move
					return false;
				}
			}
		}
		
		this.tetrisFactory.clearTetris(this.currentTetris,
			this.brush, this.cx, this.cy);
		Main.prototype.cx--;
		this.tetrisFactory.drawTetris(this.currentTetris,
			this.brush, this.cx, this.cy);
	}	
	Main.prototype.playMove();
};

Main.prototype.switchState = function(){
	var state = (this.currentState + 1) % 4;
	var tetris = this.tetrisFactory.getTetris(this.currentType, state);
	for (var i = 0; i < 16; i++){
		if (tetris[i] != 0){
			tetris[i] = this.currentColor;
		}
	}
	var row, col;
	for (row = 0; row < 4; row++){
		for (col = 0; col < 4; col++){
			if ((this.map.getMapState(row + this.cy, col + this.cx) != 0)
				&& (tetris[row * 4 + col] != 0)){//can not rotate
				return false;
			}
		}
	}
	
	Main.prototype.tetrisFactory.clearTetris(Main.prototype.currentTetris,
		Main.prototype.brush, Main.prototype.cx, Main.prototype.cy);
	Main.prototype.currentState = state;
	for (var i = 0; i < 16; i++){
		Main.prototype.currentTetris[i] = tetris[i];
	}
	Main.prototype.tetrisFactory.drawTetris(Main.prototype.currentTetris,
		Main.prototype.brush, Main.prototype.cx, Main.prototype.cy);
		
	Main.prototype.playMove();
};
Main.prototype.moveRight = function(){
	if (this.cx < this.map.getColCount() + 3){
		var row, col;
		for (row = 0; row < 4; row++){
			for (col = Math.max(0, 0 - this.cx); col < 4; col++){
				if ((this.map.getMapState(row + this.cy, col + this.cx + 1) != 0)
					&& (this.currentTetris[row * 4 + col] != 0)){//can not move
					return false;
				}
			}
		}
		
		this.tetrisFactory.clearTetris(this.currentTetris,
			this.brush, this.cx, this.cy);
		Main.prototype.cx++;
		this.tetrisFactory.drawTetris(this.currentTetris,
			this.brush, this.cx, this.cy);
	}
	Main.prototype.playMove();
};
	
Main.prototype.moveDown = function(){
	if (this.canDrop()){
		this.tetrisFactory.clearTetris(this.currentTetris,
			this.brush, this.cx, this.cy);
		this.cy++;
		this.tetrisFactory.drawTetris(Main.prototype.currentTetris,
			this.brush, this.cx, this.cy);
	} else {
		//再次判断gameStop
		if ((!Main.prototype.gameStop) && this.cy <= 0){//dead
			Main.prototype.gameStop = true;
			//show dead message
			this.playDead();
			this.showMessage("很遗憾，游戏失败了。生日快乐，又长大了一岁，必须要比之前更加努力才行啊！(玩游戏也是，亚哈哈！)");
			clearInterval(Main.prototype.timer);
		} else {
			//将该方块画到地图中并判断消行、创建新块
			this.drawMap();
			this.checkClear();
			this.newTetris();
		}
	}
	Main.prototype.playMove();
};
//判断能否下落
Main.prototype.canDrop = function(){
	if (this.cy < this.map.getRowCount()){
		var row, col;
		for (row = Math.max(0, 0 - this.cy); row < 4; row++){
			for (col = 0; col < 4; col++){
				if ((this.map.getMapState(row + this.cy + 1, col + this.cx) != 0)
					&& (this.currentTetris[row * 4 + col] != 0)){//can not move
					return false;
				}
			}
		}
		return true;
	} else {
		return false;	
	}
};
//方块下落
Main.prototype.drop = function(){
	if (!Main.prototype.gameStop){
    Main.prototype.totalElapsedTime++;
    this.document.getElementById("elapsed_time").innerHTML = Main.prototype.totalElapsedTime;
    if (Main.prototype.enableAI){
      if (!Main.prototype.isCalcAI){//防止AI的计算过程中块下落
        var hasMoved = false;
        if (Main.prototype.cy >= 0){
          if (Main.prototype.currentState != Main.prototype.AITargetTetrisState){
            Main.prototype.AIChangeTetrisState();
          }
          if (Main.prototype.cx != Main.prototype.AITargetX){
            Main.prototype.AIMoveTetris();
          }
          //speedup
          var i = Main.prototype.cy;
          while ((i < Main.prototype.map.getRowCount() - 4)
              && (Main.prototype.map.rowBlockCount[i++] == 0)){
            Main.prototype.moveDown();
            hasMoved = true;
          }
          if (!hasMoved){
            Main.prototype.moveDown();
          }
        } else {
          //speedup
          for (var i = Main.prototype.cy; i < 0; i++){
            Main.prototype.moveDown();
          }
        }
      }
    } else {
      Main.prototype.moveDown();
    }
	}	
};
//检查是否可以消行
Main.prototype.checkClear = function(){
	var row, col;
	var result = true;
	for (row = 0; row < 4; row++){
    this.map.rowBlockCount[this.cy + row] += 
      Main.prototype.countRowBlockofTetris(this.currentTetris, row);
    if (this.map.rowBlockCount[this.cy + row] == this.map.getColCount()){
      result = true;
      //消除了某一行后,数组记录的行格子数量数据都得往下移动
      var i;
      for (i = this.cy + row; i > 0; i--){
        this.map.rowBlockCount[i] = this.map.rowBlockCount[i - 1];
        if (this.map.rowBlockCount[i] == 0){
          break;
        }
      }
    } else {
      result = false;
    }
		/*result = true;
		for (col = 0; col < this.map.getColCount(); col++){
			if (this.map.getMapState(row + this.cy, col) == 0){//this line isn't full
				result = false;
				break;
			}
		}*/
		if (result && (!Main.prototype.gameStop)){//超过20行（通关后）就停止判定
			if (this.map.clearRow(this.brush, row + this.cy)){
        Main.prototype.totalClearedLines++;
				this.playClear();
				this.showMessage("干得漂亮！时间" + Main.prototype.totalElapsedTime
            + "得分为:" + Main.prototype.totalClearedLines);
				//Main.prototype.levelMark++;//get a mark
				//this.checkLevelUp();
        document.getElementById("cleared_lines").innerHTML = Main.prototype.totalClearedLines;
			}
		}
	}
  //Main.prototype.lastRowDepth = this.calcMapRowDepth();
};
//level up?
Main.prototype.checkLevelUp = function(){
	if (this.levelMark == 1){//消了4行就升一级，因为每次最多只能同时消除４行
		Main.prototype.totalMark += this.levelMark;
		this.levelMark = 0;
		//show a message
		this.playLevelUp();
		this.showMessage("恭喜你升级！");
		//show a letter
		if (this.currentLetter < Main.prototype.maxNumLines){//letter length is 20
			this.letterFactory.showLetter(this.letterBrush, this.currentLetter);
			Main.prototype.currentLetter++;
			if (this.currentLetter == Main.prototype.maxNumLines){//end of words
				//通关
				this.gamePass();
			}
		}
	}
};
//把方块映射到地图上的地上并重绘地图
Main.prototype.drawMap = function(){
	var row, col, value;
	var result = false;
	for (row = 0; row < 4; row++){
		result = false;
		for (col = 0; col < 4; col++){
			value = this.currentTetris[row * 4 + col];
			if (value != 0){
				this.map.setMapState(row + this.cy, col + this.cx, value);
				result = true;
			}
		}
		if (result){
			this.map.drawRow(this.brush, row + this.cy);
		}
	}
};

//新方块落下
Main.prototype.newTetris = function(){
	//关掉下落
	Main.prototype.gameStop = true;
	Main.prototype.currentType = this.nextType;
	Main.prototype.currentState = this.nextState;
	Main.prototype.currentColor = this.nextColor;
	for (var i = 0; i < 16; i++){
		Main.prototype.currentTetris[i] = this.nextTetris[i];
	}
	Main.prototype.cx = 4;
	Main.prototype.cy = -3;
  Main.prototype.totalNumTetris++;
	//打开下落
	Main.prototype.gameStop = false;
	//初始化下一个方块	
	this.makeNextTetris();
	this.tetrisFactory.drawNextTetris(this.nextTetris, this.nextBrush, 0, 0);

  if (Main.prototype.enableAI){
    //启动AI,计算方块姿态与下落位置
    Main.prototype.TetrisAI();
  }
};
//开始游戏
Main.prototype.gameStart = function(enable_ai){
  if (enable_ai == 1){
    Main.prototype.enableAI = true;
  } else {
    Main.prototype.enableAI = false;
  }
	//clear mark
	Main.prototype.levelMark = 0;
	Main.prototype.totalMark = 0;
  Main.prototype.totalClearedLines = 0;
  Main.prototype.totalElapsedTime = 0;
	//clear the message and letters
	this.newTetris();
	Main.prototype.timer = setInterval(this.drop, this.speed);
};
//暂停游戏
Main.prototype.gamePause = function(){
	Main.prototype.gameStop = true;
};
//继续游戏
Main.prototype.gameResume = function(){
	Main.prototype.gameStop = false;
};
//结束游戏
Main.prototype.gameEnd = function(){
	//clearInterval(Main.prototype.timer);
	//this.init();
	location.reload();
};
//游戏通关
Main.prototype.gamePass = function(){
	clearInterval(Main.prototype.timer);
	//this.init();
	Main.prototype.gameStop = true;
	this.playPass();
	this.showMessage("生日快乐！");
};
Main.prototype.showMessage = function(message){
	var obj = document.getElementById("message");
	obj.innerHTML = message;	
};
Main.prototype.appendMessage = function(message){
	var obj = document.getElementById("message");
	obj.innerHTML = obj.innerHTML + message;	
};
//各种游戏音效
//菜单点击
Main.prototype.playClick = function(){
	var obj = document.getElementById("click");
	obj.play();
};
//移动
Main.prototype.playMove = function(){
	var obj = document.getElementById("move");
	obj.play();
};
//升级
Main.prototype.playLevelUp = function(){
	var obj = document.getElementById("level_up");
	obj.play();
};
//挂了
Main.prototype.playDead = function(){
	var obj = document.getElementById("dead");
	obj.play();
};
//继续
Main.prototype.playResume = function(){
	var obj = document.getElementById("resume");
	obj.play();
};
//消行
Main.prototype.playClear = function(){
	var obj = document.getElementById("clear");
	obj.play();
};
//通关
Main.prototype.playPass = function(){
	var obj = document.getElementById("game_pass");
	obj.play();
};
