// JavaScript Document

window.onload = function()
{
	var h = new Heapifier(100);
	h.start(function(){console.log(this.array)});
}

function Animator(length)
{
	var STAGE_BAR_ID = "stage-bars";
	var MAIN_ARROW_ID = "main-arrow";
	var COMPARE_ARROW_ID = "compare-arrow";
	
	this.length = length;
	
	this.stageBars = document.getElementById(STAGE_BAR_ID);
	this.bars = new Array();
	
	var mainArrow = document.getElementById(MAIN_ARROW_ID);
	var compareArrow = document.getElementById(COMPARE_ARROW_ID);
	this.arrows = {
			mainArrow : mainArrow,
			compareArrow : compareArrow
		};
}

Animator.prototype.setMainArrow = function(index)
{
	var arrow = this.arrows.mainArrow;
	var top = this.calculateArrowTop(index);
	arrow.style.top = top + "px";
}

Animator.prototype.setCompareArrow = function(index)
{
	var arrow = this.arrows.compareArrow;
	var top = this.calculateArrowTop(index);
	arrow.style.top = top + "px";
}

Animator.prototype.calculateArrowTop = function(index)
{
	var bar_height = this.getBarHeight(this.length);
	return 15 + (index * bar_height);
	
	//20+i*(height + margin)+"px";
}

Animator.prototype.buildBars = function(array)
{
	var STAGE_WIDTH = 500;
	var CLASSNAME = 'bar';
	var MARGIN = 2;
	
	var length = this.length;
	var max_value = array[array.length - 1];
	
	var bar_height = this.getBarHeight(length) - MARGIN;
	
	for(var i =0; i<length; i++)
	{
		var bar_value = array[i];
		var bar_width = bar_value/max_value*STAGE_WIDTH;
		var bar = Bar(i, bar_width, bar_height, MARGIN, CLASSNAME);
		bar.innerHTML = "<p>"+bar_value+"<p>";
		
		this.bars.push(bar);
		this.stageBars.appendChild(bar);
	}
}

Animator.prototype.getBarHeight = function(length)
{
	var STAGE_HEIGHT = 480;
	var bar_height = STAGE_HEIGHT/length;
	
	return bar_height;
}


function Bar(i, width, height, margin, className)
{
	var div = document.createElement("div");
	div.className = className;
	
	div.style.width = width+"px";
	div.style.height = height+"px";
	div.style.top = 20+i*(height + margin)+"px";
	return div;	
}

function RandomGenerator()
{
	
}

RandomGenerator.generate = function(maxNumber, minNumber, quantity)
{
	var numbers = new Array();
	for( var i = 0; i<quantity; i++)
	{
		var number = Math.floor(Math.random()*(maxNumber - minNumber) + minNumber);
		numbers.push(number);
	}
	
	numbers.push(maxNumber);
	return numbers;
	
}

function Heapifier(delay)
{	
	var biggestNumber = 100;
	var quantity = 20;
	
	this.array = RandomGenerator.generate(biggestNumber, 0, quantity); //last number: biggest possible number
	this.delay = delay;
	
	this.length = this.array.length - 2;
	this.maxHeapifyLength = Math.floor(this.length / 2);
	this.sortingLength = this.length;
	
	this.animator = new Animator(this.length + 1);
	this.animator.buildBars(this.array);
	
	this.toCall;
	this.heapifyComplete;
}

Heapifier.prototype.start = function(complete)
{
	var args = 
	{
		start:this.maxHeapifyLength,
		biggest:null	
	}
	
	this.heapifyComplete = complete;
	this.startHeaping(args);
}

Heapifier.prototype.startHeaping = function(args)
{
	this.animator.setMainArrow(args.start);
	this.startTimeout(this.compareLeft, args);
}

Heapifier.prototype.compareLeft = function(args)
{
	var biggest = args.biggest;
	var i = args.start;
	var node = this.array[i];
	var left = this.leftOf(i);
	this.animator.setCompareArrow(left);
	
	if(node<this.array[left] && left <= this.sortingLength)
		args.biggest = left;
	else args.biggest = i;
	
	this.startTimeout(this.compareRight, args);
}

Heapifier.prototype.compareRight = function(args)
{
	
	var biggest = args.biggest;
	var right = this.rightOf(args.start);
	this.animator.setCompareArrow(right);
	
	if(this.array[right]>this.array[biggest] && right <= this.sortingLength)
		args.biggest = right;
	
	this.startTimeout(this.compareBiggest, args);
}

Heapifier.prototype.compareBiggest = function(args)
{
	if(args.biggest !== args.start)
	{
		//given that i moved its position
		var swapArgs = {
				bigger : args.biggest,
				smaller : args.start,
				shouldDecrement : false
			};
			
		this.startTimeout(this.swap, swapArgs);	
	}
	else
	{
		this.maxHeapifyLength--;
		
		if(this.maxHeapifyLength < 0 && this.sortingLength > 0)
		{
			var swapArgs = {
				bigger : 0,
				smaller : this.sortingLength,
				shouldDecrement : true
			};
			
			this.startTimeout(this.swap, swapArgs);	
		}
		else if(this.maxHeapifyLength >= 0)
		{
			args.start = this.maxHeapifyLength;
			args.biggest = null;
			this.startHeaping(args);
		}
		else
		{
			this.heapifyComplete();	
		}
	}
}

Heapifier.prototype.swap = function(args)
{
	var bigger = args.bigger;
	var smaller = args.smaller;
	
	var smallerValue = this.array[smaller];
	var biggerValue = this.array[bigger];
	
	this.array[smaller] = biggerValue;
	this.array[bigger] = smallerValue;
	
	var smallBar = this.animator.bars[smaller];
	var bigBar = this.animator.bars[bigger];
	
	var smallTop = smallBar.style.top;
	var bigTop = bigBar.style.top;
	
	smallBar.style.top = bigTop;
	bigBar.style.top = smallTop;
	
	this.animator.bars[smaller] = bigBar;
	this.animator.bars[bigger] = smallBar;
	
	if(args.shouldDecrement)
		this.sortingLength--;
		
	var args = {
		start: bigger,
		biggest: null
	};
	
	this.startTimeout(this.startHeaping, args);
}



Heapifier.prototype.setToCall = function(toCall)
{
	this.toCall = toCall;
}

Heapifier.prototype.startTimeout = function()
{
	_this = this;
	setTimeout(function(){ _this.toCall() }, this.delay);	
}

Heapifier.prototype.startTimeout = function(toCall)
{
	this.setToCall(toCall);
	var _this = this;
	setTimeout(function(){ _this.toCall() }, this.delay);	
}

Heapifier.prototype.startTimeout = function(toCall, args)
{
	this.setToCall(toCall);
	var _this = this;
	setTimeout(function(){ _this.toCall(args) }, this.delay);	
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