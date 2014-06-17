// JavaScript Document

function SortBarAnimator(prefix, length)
{
	var STAGE_BAR_ID = prefix+"-stage-bars";
	var MAIN_ARROW_ID = prefix+"-main-arrow";
	var COMPARE_ARROW_ID = prefix+"-compare-arrow";
	
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

SortBarAnimator.prototype.setMainArrow = function(index)
{
	var arrow = this.arrows.mainArrow;
	var top = this.calculateArrowTop(index);
	arrow.style.top = top + "px";
}

SortBarAnimator.prototype.setCompareArrow = function(index)
{
	var arrow = this.arrows.compareArrow;
	var top = this.calculateArrowTop(index);
	arrow.style.top = top + "px";
}

SortBarAnimator.prototype.calculateArrowTop = function(index)
{
	var bar_height = this.getBarHeight(this.length);
	return 45 + (index * bar_height);
	
	//20+i*(height + margin)+"px";
}

SortBarAnimator.prototype.buildBars = function(array)
{
	var STAGE_WIDTH = 400;
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

SortBarAnimator.prototype.getBarHeight = function(length)
{
	var STAGE_HEIGHT = 480;
	var bar_height = STAGE_HEIGHT/length;
	
	return bar_height;
}

SortBarAnimator.prototype.swapBar = function(bigger, smaller)
{
	var smallBar = this.bars[smaller];
	var bigBar = this.bars[bigger];
	
	var smallTop = smallBar.style.top;
	var bigTop = bigBar.style.top;
	
	smallBar.style.top = bigTop;
	bigBar.style.top = smallTop;
	
	this.bars[smaller] = bigBar;
	this.bars[bigger] = smallBar;	
}


function Bar(i, width, height, margin, className)
{
	var div = document.createElement("div");
	div.className = className;
	
	div.style.width = width+"px";
	div.style.height = height+"px";
	div.style.top = 50+i*(height + margin)+"px";
	return div;	
}
