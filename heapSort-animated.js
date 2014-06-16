// JavaScript Document

var STAGE_BAR_ID = "stage-bars";
	
window.onload = function()
{
	console.log("Start Heapify!");
	var biggestNumber = 100;
	
	var array = [13,42,35,66,91,23,17,43,8,43,7,biggestNumber]; //last number: biggest possible number
	var length = array.length - 2;
	var stageBars = document.getElementById(STAGE_BAR_ID);
	
	var heapifier = new Heapifier(array, length, stageBars);
	heapifier.start(biggestNumber, heapifierDidEnd);
		
}

function heapifierDidEnd(array)
{
	console.log(array);	
}

function Bar(i, width, height, className)
{
	var margin = 2;
	var div = document.createElement("div");
	div.className = className;
	div.style.width = width+"px";
	div.style.height = height+"px";
	div.style.top = 5+i*(height+margin)+"px";
	return div;	
}

function Heapifier(array, length, animateObj)
{
	this.array = array;
	this.bars = new Array();
	this.length = length;
	this.animateObj = animateObj;
}

Heapifier.prototype.start = function(biggestNumber, end)
{
	this.buildBars(this.length+1);
	
	this.array = this.buildMaxHeapify();
	
	for(var i = this.length; i >= 0; i--)
	{
		this.array = this.swap(0, i);
		this.array = this.maxHeapify(0, --this.length);
	}
	
	end(this.array);
}

Heapifier.prototype.buildBars = function(length)
{
	var STAGE_HEIGHT = 480;
	var STAGE_WIDTH = 500;
	var CLASSNAME = 'bar';
	
	var max_value = this.array[this.array.length - 1];
	var bar_height = STAGE_HEIGHT/length;
	
	for(var i =0; i<length; i++)
	{
		var bar_value = this.array[i];
		var bar_width = bar_value/max_value*STAGE_WIDTH;
		var bar = Bar(i, bar_width, bar_height, CLASSNAME);
		
		this.bars.push(bar);
		this.animateObj.appendChild(bar);
	}
}

Heapifier.prototype.buildMaxHeapify = function()
{
	for(var i=this.length; i>=0; i--)
	{
		this.array = this.maxHeapify(i, this.length);
	}
	
	return this.array;
}

Heapifier.prototype.maxHeapify = function(i, length)
{
	var node = this.array[i];
	
	var left = this.leftOf(i);
	var right = this.rightOf(i);
	var biggest;
	
	//perform first comparision, 
	//current node and left and assign which ever is the biggest
	
	//compare(i, left);
	if(node<this.array[left] && left <= length)
		biggest = left;
	else biggest = i;
	
	//compare(i,right);
	if(this.array[right]>this.array[biggest] && right <= length)
		biggest = right;
	
	
	if(biggest !== i)
	{
		//given that i moved its position
		this.array = this.swap(i, biggest);
		this.maxHeapify(biggest, length);	
	}
		
	return this.array;
}

Heapifier.prototype.swap = function(bigger, smaller)
{	
	var smallerValue = this.array[smaller];
	var biggerValue = this.array[bigger];
	
	this.array[smaller] = biggerValue;
	this.array[bigger] = smallerValue;
	
	var smallBar = this.bars[smaller];
	var bigBar = this.bars[bigger];
	
	var smallTop = smallBar.style.top;
	var bigTop = bigBar.style.top;
	
	smallBar.style.top = bigTop;
	bigBar.style.top = smallTop;
	
	this.bars[smaller] = bigBar;
	this.bars[bigger] = smallBar;
	
	//arrowSwap(smaller, bigger);
	return this.array;	
}

Heapifier.prototype.leftOf = function(index)
{
	//returns the left child's index
	return index*2;	
}

Heapifier.prototype.rightOf = function(index)
{
	//returns the right child's index
	return (index*2) + 1;
}