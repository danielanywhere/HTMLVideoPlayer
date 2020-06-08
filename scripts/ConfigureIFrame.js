//	ConfigureIFrame.js
//	Functionality for helping the user configure their IFrame commands
//	on HTMLVideoPlayer control.

//	Copyright (c). 2020 Daniel Patterson, MCSD (danielanywhere)
//	Released for public access under the MIT License.
//	http://www.opensource.org/licenses/mit-license.php

var ClipImage = null;
var LinkHeight = 0.0;
var LinkLeft = 0.0;
var LinkTop = 0.0;
var LinkWidth = 10.0;

$(document).ready(function()
{
	ClipImage = new ClipboardInterface("workingImage", false);

	slideLeftInput();
	slideTopInput();
	slideWidthInput();
	slideHeightInput();
});


/**
 * Interface of Clipboard to Canvas.
 * 
 * @param {string} canvasId - The ID of the canvas to allow paste.
 * @param {boolean} autosize - Value indicating whether the canvas will
	* be resized on paste.
 */
function ClipboardInterface(canvasId, autosize)
{
	var self = this;
	console.log(`Loading canvas ${canvasId}...`);
	var canvas = document.getElementById(canvasId);
	var ctx = document.getElementById(canvasId).getContext("2d");

	//	Handlers
	document.addEventListener('paste',
		function(e)
		{
			self.paste_auto(e);
		},
		false);

	//	on paste
	this.paste_auto = function(e)
	{
		if(e.clipboardData)
		{
			var items = e.clipboardData.items;
			if(!items)
			{
				return;
			}
			
			//	Access data directly
			var is_image = false;
			for(var i = 0; i < items.length; i++)
			{
				if(items[i].type.indexOf("image") !== -1)
				{
					//	Image.
					var blob = items[i].getAsFile();
					var URLObj = window.URL || window.webkitURL;
					var source = URLObj.createObjectURL(blob);
					this.paste_createImage(source);
					is_image = true;
				}
			}
			if(is_image == true)
			{
				e.preventDefault();
			}
		}
	};
	//	Draw the pasted image to canvas.
	this.paste_createImage = function(source)
	{
		var pastedImage = new Image();
		pastedImage.onload = function()
		{
			if(autosize == true)
			{
				//	Resize the canvas.
				canvas.width = pastedImage.width;
				canvas.height = pastedImage.height;
			}
			else
			{
				//	Clear the canvas.
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			ctx.drawImage(pastedImage, 0, 0, canvas.width, canvas.height);
		};
		pastedImage.src = source;
	};
}

function generateIFrame()
{
	var height = parseFloat($("#slideHeight").val());
	var left = parseFloat($("#slideLeft").val());
	var player = $("#txtPlayer").val();
	var target = encodeURIComponent($("#txtTarget").val());
	var time = parseInt($("#txtTime").val());
	var top = parseFloat($("#slideTop").val());
	var value = "";
	var vheight = parseInt($("#txtViewHeight").val());
	var video = encodeURIComponent($("#txtVideo").val());
	var vwidth = parseInt($("#txtViewWidth").val());
	var width = parseFloat($("#slideWidth").val());

	console.log(`Video name: ${video}`);
	value = `<iframe width="${vwidth}" height="${vheight}" src="` +
		`${player}?showHotspot=0&video=${video}&` +
		`buttonTime=${time}&buttonLeft=${left}&buttonTop=${top}&` +
		`buttonWidth=${width}&buttonHeight=${height}&` +
		`target=${target}"></iframe>`;
	$("#srcIFrame").val(value);
}

function slideHeightInput()
{
	var value = $("#slideHeight").val();
	$("#divLink").css("height", `${value}%`);
}

function slideLeftInput()
{
	var value = $("#slideLeft").val();
	$("#divLink").css("left", `${value}%`);
}

function slideTopInput()
{
	var value = $("#slideTop").val();
	$("#divLink").css("top", `${value}%`);
}

function slideWidthInput()
{
	var value = $("#slideWidth").val();
	$("#divLink").css("width", `${value}%`);
}
