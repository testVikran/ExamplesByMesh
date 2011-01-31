
//canvas element
var canvas;

//canvas context
var context;

//img element we will copy canvas png to
var canvasImage;

var offsetLeft;
var offsetTop;

window.onload = function(e)
{
	var container = document.getElementById("container");
	
	//check is canvas is supported
	if(!hasCanvasSupport())
	{
		container.innerHTML = "It appears you are using a browser that does not " +
								"support the HTML5 Canvas element.";
		
		return;
	}
	
	
	canvas = document.getElementById("canvas");
	
	//listen for when the user clicks on the canvas
	canvas.onclick = onCanvasClick;
	context = canvas.getContext("2d");
	
	offsetLeft = container.offsetLeft;
	offsetTop = container.offsetTop;
	
	//add a click event to all of the backgroundLink
	var bgLinks = document.querySelectorAll(".backgroundLink");
	var len = bgLinks.length;
	
	for(var i = 0; i < len; i++)
	{
		bgLinks[i].onclick = onLinksClick;
	}
	
	canvasImage = document.getElementById("canvasImage");
}

//called when the create image links are clicked
function onLinksClick(e)
{
	//get the background color specified in the element
	var backgroundColor = e.target.getAttribute("data-color");
	
	//check if it is null, or an empty string
	if(!backgroundColor)
	{
		color = null;
	}
	
	//create a png dataurl from the canvas contents, and display in the
	//image element on the page
	canvasImage.src = canvasToImage(backgroundColor);
	
	return false;
}

//Returns contents of a canvas as a png based data url, with the specified
//background color
function canvasToImage(backgroundColor)
{
	//cache height and width		
	var w = canvas.width;
	var h = canvas.height;

	//get the ImageData for the canvas
	var data = context.getImageData(0, 0, w, h);		

	if(backgroundColor)
	{
		//store the current globalCompositeOperation
		var compositeOperation = context.globalCompositeOperation;

		//set to draw behind current content
		context.globalCompositeOperation = "destination-over";

		//set background color
		context.fillStyle = backgroundColor;

		//draw background / rect on entire canvas
		context.fillRect(0,0,w,h);
	}

	//get the image data from the canvas
	var imageData = this.canvas.toDataURL("image/png");

	if(backgroundColor)
	{
		//clear the canvas
		context.clearRect (0,0,w,h);

		//restore it with original / cached ImageData
		context.putImageData(data, 0,0);		

		//reset the globalCompositeOperation to what it was
		context.globalCompositeOperation = compositeOperation;
	}

	//return the Base64 encoded data url string
	return imageData;
}


//called when the user clicks the mouse on the canvas
function onCanvasClick(e)
{
	
	var x = e.pageX - offsetTop;
	var y = e.pageY - offsetLeft;
	
	context.fillStyle = getColor();
	
	context.beginPath();
	context.fillRect(x, y, 20, 20);
	context.closePath();
}

//array of colors to use when draw rects on canvas
var colors = [
	"rgba(255,0,0,0.5)",
	"rgba(0,255,0,0.5)",
	"rgba(0,0,255,0.5)",
	"rgba(0,0,0,0.5)",
	"rgba(255,255,255,0.5)",
];

//color array index
var colorIndex = 0;
function getColor()
{
	//check if we have passed the last color
	if(colorIndex == colors.length)
	{
		//if so, go to beginning
		colorIndex = 0;
	}
	
	//get the color
	var color = colors[colorIndex];
	
	//increment the color index
	colorIndex++;
	
	return color;
}

function hasCanvasSupport()
{
	return !!document.createElement('canvas').getContext;
}