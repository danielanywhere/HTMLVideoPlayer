//	VideoPlayer.js
//	HTML video player with YouTube-style button overlay,
//	usable within any templated webpage that supports
//	IFRAME, such as WordPress, Wix, Sites, etc.

//	Copyright (c). 2020 Daniel Patterson, MCSD (danielanywhere)
//	Released for public access under the MIT License.
//	http://www.opensource.org/licenses/mit-license.php

// 20200619.1011 - Bug repair. Anchors were not being hidden, even though their
//  container divs were. This was causing the first anchor to be always active,
//  effectively blocking out others in the same position.
//	20200615.1521 - Added support for multiple buttons on multiple timelines.
//	20200615.1239 - Added support for the URL parameter configFile.
//	20200615.1237 - Removed support for the URL parameters buttonTop,
//		buttonBottom, buttonLeft, buttonRight, buttonWidth, buttonTime,
//		showHotspot, target, and video. Those values are now all controlled
//		from the configuration file.

//	URL Parameters.

//	configFile - URL or filename of the configuration file to load.

var configData = {};	//	Configuration data;
var videoControl = null;
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
// highlightOff
//----------
/**
	* Hide the highlight for the specified overlay.
	* @param {string} name Name of the control with the highlight to hide.
	* @returns {undefined}
	*/
function highlightOff(name)
{
	if(name)
	{
		$(`#${name}`).css("border", "0");
	}
}
//----------

//----------
// highlightOn
//----------
/**
	* Show the highlight on the specified overlay.
	* @param {string} name Name of the control where the highlight will be displayed.
	* @param {string} color Color of the highlight for this control.
	* @returns {undefined}
	*/
function highlightOn(name, color)
{
	if(name && color)
	{
		$(`#${name}`).css("border", `2px solid ${color}`);
	}
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
	var element = "";
	var id = "";
	var options = "";
	var time = 0;
	var value = "";

	if(videoControl && configData.Timelines)
	{
		time = videoControl.currentTime;
		if(!configData.Initialized)
		{
			//	Initialize all buttons.
			configData.Buttons.forEach(function(item, index)
			{
				id = `id="overlay${index}"`;
				options = "";
				if(item.ButtonHoverColor)
				{
					options +=
						` onmouseover="highlightOn('overlay${index}', ` +
							`'${item.ButtonHoverColor}')" ` +
						`onmouseout="highlightOff('overlay${index}')"`;
				}
				element =
					`<div ${id} class="overlay1" ` +
					`style="` +
					`left:calc(${item.ButtonLeft}%);` +
					`top:calc(${item.ButtonTop}%);` +
					`width:calc(${item.ButtonWidth}%);` +
					`height:calc(${item.ButtonHeight}%);`;
				if(item.ButtonBackgroundColor)
				{
					element += `background-color:${item.ButtonBackgroundColor};`;
				}
				element += `"`;
				element += options;
				element += `>`;
				element += `<a id="linkTarget${index}" href="${item.ButtonTarget}" target="_blank">` +
					`<div class="overlay1area"></div></a></div>`;
				$("#videoContainer").append(element);
				$(`#overlay${index} a`).hide();
				$(`#overlay${index}`).hide();
			});
			//	Initialize all timelines.
			configData.Timelines.forEach(function(item, index)
			{
				//	This item has not yet been initialized.
				//	Enable time.
				value = item.TimelineEnableTime.toString().toLowerCase();
				if(value != "start" && value != "end")
				{
					//	Explicit time.
						item.TimelineEnableTime = parseInt(value);
				}
				else if(value == "start")
				{
					//	Start of video.
					item.TimelineEnableTime = 0;
				}
				else if(value == "end")
				{
					//	End of video.
					item.TimelineEnableTime = videoControl.duration + 1;
				}
				console.log(`Enable ${item.TimelineButtonName} at ${item.TimelineEnableTime}.`);
				//	Disable time.
				value = item.TimelineDisableTime.toString().toLowerCase();
				if(value != "start" && value != "end")
				{
					//	Explicit time.
					item.TimelineDisableTime = parseInt(value);
				}
				else if(value == "start")
				{
					//	Start of video.
					item.TimelineDisableTime = 0;
				}
				else if(value == "end")
				{
					//	End of video.
					item.TimelineDisableTime = videoControl.duration + 1;
				}
				console.log(`Disable ${item.TimelineButtonName} at ${item.TimelineDisableTime}.`);
				item.Visible = false;
			});
			configData.Initialized = true;
		}
		console.log(`Time update: ${time}`);
		configData.Timelines.forEach(function(timeline, tIndex)
		{
			if(time >= timeline.TimelineEnableTime &&
				time <= timeline.TimelineDisableTime)
			{
				if(!timeline.Visible)
				{
					//	The overlay has entered a visible state. Enable the control.
					name = timeline.TimelineButtonName;
					console.log(`Show ${name}.`);
					configData.Buttons.some(function(button, bIndex)
					{
						if(button.ButtonName == name)
						{
							console.log(`Show Button ${bIndex}`);
							$(`#overlay${bIndex}`).show();
							$(`#overlay${bIndex} a`).show();
							return false;
						}
					});
					timeline.Visible = true;
				}
			}
			else if(timeline.Visible)
			{
				//	The button associated with this timeline was visible on the
				//	previous pass. Hide the overlay.
				name = timeline.TimelineButtonName;
				console.log(`Hide ${name}.`);
				configData.Buttons.some(function(button, bIndex)
				{
					if(button.ButtonName == name)
					{
						$(`#overlay${bIndex} a`).hide();
						$(`#overlay${bIndex}`).hide();
						return false;
					}
				});
				timeline.Visible = false;
			}
		});
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

	videoControl = document.getElementById("videoPlayer");

	value = getQueryValue("configFile");
	if(value.length > 0)
	{
		//	Configuration file has been specified.
		value = decodeURIComponent(value);
		console.log(`Arg found: configFile=${value}`);
		loadConfigFile(value);
	}
});
//----------

//----------
// loadConfigFile
//----------
/**
	* Load an existing configuration file.
	* @param {string} filename Name of the URL or file to load.
	*/
function loadConfigFile(filename)
{
	if(filename)
	{
		$.getJSON(filename, function(data)
			{
				//	On success, data will contain the configuration settings.
				if(data)
				{
					if(data.HVPVersion > 0.0)
					{
						//	Any version of file is valid in this version.
						console.log(`Configuration file loaded: ${filename}`);
						configData = data;
						console.log(JSON.stringify(configData));
						startVideo();
					}
				}
			}
		);
	}
}
//----------

//----------
// startVideo
//----------
/**
	* Register video events and start the video specified in the configuration data.
	* @returns {undefined}
	*/
function startVideo()
{
	if(configData && configData.VideoName)
	{
		//	Configure the player.
		$("#videoPlayer").
			append(`<source id="videoSource" src="${configData.VideoName}" />`);
		if(videoControl)
		{
			console.log("Loading video...");
			//	Set the video timing interrupts.
			videoControl.ontimeupdate = function() { onTimeUpdate() };
		}
	}
}
//----------
	