//	VideoPlayer.js
//	HTML video player with YouTube-style button overlay,
//	usable within any templated webpage that supports
//	IFRAME, such as WordPress, Wix, Sites, etc.

//	Copyright (c). 2020 Daniel Patterson, MCSD (danielanywhere)
//	Released for public access under the MIT License.
//	http://www.opensource.org/licenses/mit-license.php

//	URL Parameters.

//	buttonTop - Distance of the button from the top of the video,
//		as a percentage. This parameter is mutually exclusive with
//		buttonBottom.

//	buttonBottom - Distance of the button from the bottom of the
//		video, as a percentage. This parameter is mutually exclusive
//		with buttonTop.

//	buttonLeft - Distance of the button from the left side of the
//		video, as a percentage. This parameter is mutually exclusive
//		with buttonRight.

//	buttonRight - Distance of the button from the right side of
//		the video, as a percentage. This parameter is mutually
//		exclusive with buttonLeft.

//	buttonWidth - The width of the button, as a percentage.
//	buttonHeight - The height of the button, as a percentage.

//	buttonTime -
//		Total number of seconds at which the button becomes available.

//	showHotspot - 1 to show a box where the hotspot where the click
//		will be expected. Otherwise, 0.

//	target - The url of the target page to load when the overlay
//		button has been clicked. This value must be URL encoded.
//		To manually encode the click target link,
//		visit https://www.urlencoder.org/ and click Encode.

//	video - Filename of the video. In this version, the
//		video is expected to be located in the videos subfolder, and
//		the parameter name is specified without any folder names.

var buttonAT = 0;		//	Button available at time.
var buttonH = 0.0;	//	Height.
var buttonS = false;	//	Value indicating whether to show hotspot.
var buttonV = true;	//	Button visible.
var buttonW = 0.0;	//	Width.
var buttonX = 0.0;	//	X coordinate.	Right align if negative.
var buttonY = 0.0;	//	Y coordinate.	Bottom align if negative.
var target = "";			//	Target URL.
var videoFilename = "";	//	Name of the file to load.

//----------
// getQueryValue
//----------
/**
	* Return the value of the specified query.
	* @param {string} name Name of the query parameter to return.
	* @returns {string} Value of the specified query, if found. Otherwise,
	* empty string.
	*/
function getQueryValue(name)
{
	var queryString = window.location.search;
	var searchParams = null;
	var value = "";

	if(queryString.toLowerCase().
		indexOf(name.toLowerCase() + "=") > -1)
	{
		searchParams = new URLSearchParams(queryString);
		if(searchParams.has(name))
		{
			//	The name/value pair exists.
			value = searchParams.get(name);
		}
	}
	return value;
}
//----------

//----------
// onTimeUpdate
//----------
/**
	* The time on the media control has been updated.
	*/
function onTimeUpdate()
{
	var vid = document.getElementById("videoPlayer");
	var time = 0;

	if(vid)
	{
		time = vid.currentTime
		console.log(`Time update: ${time}`);
		if(time >= buttonAT)
		{
			//	The button is visible.
			if(!buttonV)
			{
				console.log("Set button visible...");
				$(".overlay1").css("opacity", 1.0);
				buttonV = true;
			}
		}
		else
		{
			//	The button is hidden.
			if(buttonV)
			{
				console.log("Set button invisible...");
				$(".overlay1").css("opacity", 0.0);
				buttonV = false;
			}
		}
	}
}
//----------

//----------
//	$(document).ready
//----------
/**
	* Called when the document is loaded and ready to display.
 */
$(document).ready(function()
{
	//	Get command-line parameters.
	var value = "";
	var vid = null;

	value = getQueryValue("buttonTop");
	if(value.length > 0)
	{
		//	Button top has been specified.
		console.log(`Arg found: buttonTop=${value}`);
		buttonY = parseFloat(value);
	}
	value = getQueryValue("buttonBottom");
	if(value.length > 0)
	{
		//	Button bottom has been specified.
		console.log(`Arg found: buttonBottom=${value}`);
		buttonY = 0.0 - parseFloat(value);
	}

	value = getQueryValue("buttonLeft");
	if(value.length > 0)
	{
		//	Button left has been specified.
		console.log(`Arg found: buttonLeft=${value}`);
		buttonX = parseFloat(value);
	}
	value = getQueryValue("buttonRight");
	if(value.length > 0)
	{
		//	Button right has been specified.
		console.log(`Arg found: buttonRight=${value}`);
		buttonX = 0.0 - parseInt(value);
	}

	value = getQueryValue("buttonWidth");
	if(value.length > 0)
	{
		//	Button width has been specified.
		console.log(`Arg found: buttonWidth=${value}`);
		buttonW = parseFloat(value);
	}
	else
	{
		buttonW = 20.0;
	}
	$(".overlay1").css("width", `calc(${buttonW}%)`);

	value = getQueryValue("buttonHeight");
	if(value.length > 0)
	{
		//	Button height has been specified.
		console.log(`Arg found: buttonHeight=${value}`);
		buttonH = parseFloat(value);
	}
	else
	{
		buttonH = 10.0;
	}
	$(".overlay1").css("height", `calc(${buttonH}%)`);

	value = getQueryValue("buttonTime");
	if(value.length > 0)
	{
		//	Button available time has been specified.
		console.log(`Arg found: buttonTime=${value}`);
		buttonAT = parseInt(value);
	}

	value = getQueryValue("target");
	if(value.length > 0)
	{
		//	Target URL has been specified.
		console.log(`Arg found: target=${value}`);
		target = decodeURIComponent(value);
	}

	value = getQueryValue("video");
	if(value.length > 0)
	{
		//	Video filename has been specified.
		console.log(`Arg found: video=${value}`);
		videoFilename = value;
	}

	$("#linkTarget").attr("src", `${target}`);
	if(buttonX >= 0.0)
	{
		//	Left aligned.
		console.log("Button left aligned...");
		$(".overlay1").css("left", `calc(${buttonX}%)`);
		$(".overlay1").css("right", "");
	}
	else if(buttonX < 0.0)
	{
		//	Right aligned.
		console.log("Button right aligned...");
		$(".overlay1").css("left", "");
		$(".overlay1").css("right", `calc(${Math.abs(buttonX)}%)`);
	}

	if(buttonY >= 0)
	{
		//	Top aligned.
		console.log("Button top aligned...");
		$(".overlay1").css("top", `calc(${buttonY}%)`);
		$(".overlay1").css("bottom", "");
	}
	else
	{
		//	Bottom aligned.
		console.log("Button bottom aligned...");
		$(".overlay1").css("top", "");
		$(".overlay1").css("bottom", `calc(${Math.abs(buttonY)}%)`);
	}

	//	Button hotspot.
	value = getQueryValue("showHotspot");
	if(value.length > 0)
	{
		buttonS = (parseInt(value) == 1);
		if(buttonS)
		{
			$(".overlay1").css("background-color", "#ff0000");
		}
	}

	//	Configure the target.
	$("#linkTarget").attr("href", target);

	//	Configure the player.
	$("#videoPlayer").append(`<source id="videoSource" src="videos/${videoFilename}" />`);
	vid = document.getElementById("videoPlayer");
	if(vid)
	{
		console.log("Loading video...");
		//	Set the video timing interrupts.
		vid.ontimeupdate = function() { onTimeUpdate() };
		console.log(`Display button at: ${buttonAT} seconds.`);
	}
});
//----------


	