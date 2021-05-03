function Map(){}
Map.prototype.rowCount = 0;
Map.prototype.colCount = 0;
Map.prototype.matrix = new Array();

Map.prototype.getRowCount = function(){
	return this.rowCount;	
};
Map.prototype.getColCount = function(){
	return this.colCount;	
};
//获取地图上某一点处的值
Map.prototype.getMapState = function(prow, pcol){
	var row = prow;
	var col = pcol;
	var value = -1;
	if (row >= 0 && row < this.rowCount
		&& col >=0 && col < this.colCount){
		value = this.matrix[row][col];
	}
	return value;
};
//设置地图上某一点处的值
Map.prototype.setMapState = function(prow, pcol, value){
	var row = prow;
	var col = pcol;
	if (row >= 0 && row < this.rowCount
		&& col >=0 && col < this.colCount){
		Map.prototype.matrix[row][col] = value;
	}
};
Map.prototype.init = function(rowCount, colCount){
	this.rowCount = rowCount;
	this.colCount = colCount;
	var row, col;
	//this.matrix = new Array(this.rowCount);
	for (row = 0; row < this.rowCount; row++){
		Map.prototype.matrix[row] = new Array(this.colCount);
		for (col = 0; col < this.colCount; col++){
			Map.prototype.matrix[row][col] = 0;
		}
	}
};

Map.prototype.clean = function(){
	var row, col;
	for (row = 0; row < this.rowCount; row++){
		for (col = 0; col < this.colCount; col++){
			Map.prototype.matrix[row][col] = 0;
		}
	}
};
//画整个地图
Map.prototype.draw = function(brush){
	var row, col;
	for (row = 0; row < this.rowCount; row++){
		for (col = 0; col < this.colCount; col++){
			brush.draw(row, col, this.matrix[row][col]);
		}
	}
};
//画行
Map.prototype.drawRow = function(brush, prow){
	var row = prow;
	var col;	
	if (row >= 0 && row < this.rowCount){
		for (col = 0; col < this.colCount; col++){
			brush.draw(row, col, this.matrix[row][col]);
		}
	}
};
//清除某一行，并把某上所有行向下移动一行
Map.prototype.clearRow = function(brush, prow){
	var row = prow;
	if (row >= 0 && row < this.rowCount){
		var col;
		for (; row > 0; row--){
			for (col = 0; col < this.colCount; col++){
				Map.prototype.matrix[row][col] = this.matrix[row - 1][col];
			}
			this.drawRow(brush, row);
		}
		for (col = 0; col < this.colCount; col++){
			Map.prototype.matrix[0][col] = 0;	
		}
		this.drawRow(brush, 0);
		return true;
	} else {
		return false;	
	}
}