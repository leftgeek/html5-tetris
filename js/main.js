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

Main.prototype.init = function(){
	//注册键盘处理函数
	document.onkeydown = this.keyDown;
	//初始化画笔
	//this.brush = new Brush();//画主游戏方块区
	
	if (!this.brush.init("board", 26, "#AAAAAA")){
		alert("HTML5 is not supported!");
		return false;
	}
	//this.nextBrush = new Brush();//画下一个方块区
	this.nextBrush.init("preview", 26, "#AAAAAA");
	this.letterBrush.init("paper", 18, "#AAAAAA")
	//初始化地图
	//this.map = new Map();
	this.map.init(18, 12);
	this.map.draw(this.brush);
	//初始化方块制造工厂
	//this.tetrisFactory = new TetrisFactory();
	this.tetrisFactory.init();
	//初始化字母工厂
	this.letterFactory.init();
	//设定方块参数
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
			if (!Main.prototype.gameStop && Main.prototype.currentLetter < 20){
				Main.prototype.moveLeft();
			}
			break;
		case 38://上键
			if (!Main.prototype.gameStop && Main.prototype.currentLetter < 20){
				Main.prototype.switchState();
			}
			break;
		case 39://右键
			if (!Main.prototype.gameStop && Main.prototype.currentLetter < 20){
				Main.prototype.moveRight();
			}
			break;
		case 40://下键
			if (!Main.prototype.gameStop && Main.prototype.currentLetter < 20){
				Main.prototype.moveDown();
			}
			break;
		default:
			break;
	}
};

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
			this.showMessage("很遗憾，游戏失败了。生日快乐，再接再厉!");
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
		Main.prototype.moveDown();
	}	
};
//检查是否可以消行
Main.prototype.checkClear = function(){
	var row, col;
	var result = true;
	for (row = 0; row < 4; row++){
		result = true;
		for (col = 0; col < this.map.getColCount(); col++){
			if (this.map.getMapState(row + this.cy, col) == 0){//this line isn't full
				result = false;
				break;
			}
		}
		if (result && (!Main.prototype.gameStop)){//超过20行（通关后）就停止判定
			if (this.map.clearRow(this.brush, row + this.cy)){
				this.playClear();
				this.showMessage("干得漂亮！");
				Main.prototype.levelMark++;//get a mark
				this.checkLevelUp();
			}
		}
	}
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
		if (this.currentLetter < 20){//letter length is 20
			this.letterFactory.showLetter(this.letterBrush, this.currentLetter);
			Main.prototype.currentLetter++;
			if (this.currentLetter == 20){//end of words
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
	//打开下落
	Main.prototype.gameStop = false;
	//初始化下一个方块	
	this.makeNextTetris();
	this.tetrisFactory.drawNextTetris(this.nextTetris, this.nextBrush, 0, 0);
};
//开始游戏
Main.prototype.gameStart = function(){
	//clear mark
	Main.prototype.levelMark = 0;
	Main.prototype.totalMark = 0;
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
