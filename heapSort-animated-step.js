// JavaScript Document

window.onload = function()
{
	var h = new Heapifier(100);
	h.start(function(){console.log(this.array)});
}

function Heapifier(delay)
{	
	SortAnimatable.call(this);

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

Heapifier.prototype = new SortAnimatable();
Heapifier.prototype.constructor = Heapifier;

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