//画笔类
function Brush(){}
//sideLength为画的单位方块的边长
Brush.prototype.context = null;
Brush.prototype.sideLength = 10;
//Brush.prototype.backColor = "#999999";
Brush.prototype.backColor = "#666";

Brush.prototype.init = function(canvasId, sideLength, backColor){
	var canvas = document.getElementById(canvasId);
  if (!canvas.getContext) {
		return false;
  }
  //canvas is supported!
  this.context = canvas.getContext("2d");
	this.sideLength = sideLength;
	this.backColor = backColor;
	//this.context.shadowOffsetX = 0;
  //this.context.shadowOffsetY = 0;
  //this.context.shadowBlur = 1;
  //this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
  //this.context.globalAlpha = 0.8;
	return true;
};

//根据属性值（整数）设置属性，如颜色等
Brush.prototype.setProperty = function(property){
	//this.context.strokeStyle = this.backColor;
	
	switch(property){
		case 0:
			this.context.fillStyle = this.backColor;
			break;
/*    case 1:
			this.context.fillStyle = "#FF4719";
			break;
		case 2:
			this.context.fillStyle = "#FFE019";
			break;
		case 3:
			this.context.fillStyle = "#19A3FF";
			break;
		case 4:
			this.context.fillStyle = "#75D119";
			break;
		default:
			this.context.fillStyle = "#FF4719";*/
		case 1:
			this.context.fillStyle = "#DF5A37";
			break;
		case 2:
			this.context.fillStyle = "#F6C646";
			break;
		case 3:
			this.context.fillStyle = "#50B1B3";
			break;
		case 4:
			this.context.fillStyle = "#87C15E";
			break;
		default:
			this.context.fillStyle = "#DF5A37";
			break;
	}
};

Brush.prototype.draw = function(row, col, property){
	this.setProperty(property);
	this.context.beginPath();
	this.context.rect(col * (this.sideLength + 2) + 1, row * (this.sideLength + 2) + 1, this.sideLength, this.sideLength);
	this.context.closePath();
	this.context.fill();
};
