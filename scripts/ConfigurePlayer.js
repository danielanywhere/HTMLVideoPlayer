//	ConfigurePlayer.js
//	Functionality for helping the user configure their IFrame commands
//	on HTMLVideoPlayer control.

//	Copyright (c). 2020 Daniel Patterson, MCSD (danielanywhere)
//	Released for public access under the MIT License.
//	http://www.opensource.org/licenses/mit-license.php

// 20200612.1025 - Added ability to load configuration file.
//	20200612.1023 - Added functionality for multiple buttons and multiple
//		timelines.
//	20200612.1022 - Renamed from ConfigureIFrame.js
var bBusy = false;
var clipImage = null;
var configData = {};
//	Change the following value to set the default location from where your player
//	will be used.
var playerLocation = "https://danielanywhere.github.io/VideoPlayer/VideoPlayer.html";
var selectedButton = null;
var selectedTimeline = null;

$(document).ready(function()
{
	clipImage = new ClipboardInterface("workingImage", false);

	$("#txtPlayer").val(playerLocation);
	applyConfig();

});

//----------
// applyConfig
//----------
/**
	* Apply configuration data to controls.
	*/
function applyConfig()
{
	var attribute = "";
	var bDefined = false;
	var sel = null;
	var val = null;

	if(!bBusy)
	{
		bBusy = true;
		if(elementCount(configData) > 0)
		{
			//	Configuration data is present.
			bDefined = true;
		}
		if(!bDefined)
		{
			//	Create a default configuration data if non-existent.
			configData.HVPVersion = 1.0;
			configData.ViewPortWidth = 700;
			configData.ViewPortHeight = 394;
		}
		if(!(configData.Buttons))
		{
			configData.Buttons = [];
			configData.Buttons[0] = {};
			val = configData.Buttons[0];
			val.ButtonName = "Button 1";
			val.ButtonLeft = 0;
			val.ButtonTop = 0;
			val.ButtonWidth = 10;
			val.ButtonHeight = 10;
			val.ButtonTarget = "";
			val.ButtonHoverColor = "";
			val.ButtonBackgroundColor = "";
			val.ButtonImageName = "";
			selectedButton = val;
		}
		if(!(configData.Timelines))
		{
			attribute = configData.Buttons[0].ButtonName;
			configData.Timelines = [];
			configData.Timelines[0] = {};
			val = configData.Timelines[0];
			val.TimelineName = `${attribute}-1`;
			val.TimelineButtonName = attribute;
			val.TimelineEnableTime = "start";
			val.TimelineDisableTime = "end";
			selectedTimeline = val;
		}
		//	Assign configuration data to the form controls.
		$("#txtViewWidth").val(configData.ViewPortWidth);
		$("#txtViewHeight").val(configData.ViewPortHeight);
		$("#cmboButton").empty();
		$("#cmboTimelineButton").empty();
		configData.Buttons.forEach(function(item, index)
		{
			if(selectedButton != null)
			{
				attribute = (selectedButton.ButtonName == item.ButtonName ?
					' selected="selected"' : '');
			}
			else if(index == 0)
			{
				attribute = ' selected="selected"';
			}
			else
			{
				attribute = "";
			}
			console.log(`Adding button element: ${item.ButtonName}`);
			$("#cmboButton").append(`<option name="${item.ButtonName}"${attribute}>` +
				`${item.ButtonName}</option>`);
			$("#cmboTimelineButton").append(`<option name="${item.ButtonName}">` +
				`${item.ButtonName}</option>`);
		});
		if(selectedButton != null)
		{
			$("#txtButtonName").val(selectedButton.ButtonName);
			$("#slideLeft").val(selectedButton.ButtonLeft);
			$("#slideTop").val(selectedButton.ButtonTop);
			$("#slideWidth").val(selectedButton.ButtonWidth);
			$("#slideHeight").val(selectedButton.ButtonHeight);
			$("#txtButtonTarget").val(selectedButton.ButtonTarget);
			$("#txtButtonHoverColor").val(selectedButton.ButtonHoverColor);
			$("#txtButtonBackgroundColor").val(selectedButton.ButtonBackgroundColor);
			$("#txtButtonImage").val(selectedButton.ButtonImageName);
		}
		else
		{
			$("#txtButtonName").val("");
			$("#slideLeft").val(0);
			$("#slideTop").val(0);
			$("#slideWidth").val(10);
			$("#slideHeight").val(10);
			$("#txtButtonTarget").val("");
			$("#txtButtonHoverColor").val("");
			$("#txtButtonBackgroundColor").val("");
			$("#txtButtonImage").val("");
		}
		$("#cmboTimeline").empty();
		console.log(`Selected timeline is ${selectedTimeline.TimelineName}`);
		configData.Timelines.forEach(function(item, index)
		{
			if(selectedTimeline != null)
			{
				attribute = (selectedTimeline.TimelineName == item.TimelineName ?
					' selected="selected"' : '');
				console.log(`Attribute for timeline ${item.TimelineName} = ${attribute}`);
			}
			else if(index == 0)
			{
				attribute = ' selected="selected"';
			}
			else
			{
				attribute = "";
			}
			$("#cmboTimeline").append(`<option name="${item.TimelineName}"${attribute}>` +
				`${item.TimelineName}</option>`);
		});
		if(selectedTimeline != null)
		{
				//	Select the item according to the specified value.
				// $("#cmboTimelineButton").each(function(index, obj)
				// {
				// 	obj = obj.children[index];
				// 	attribute = obj.attributes.getNamedItem("name");
				// 	console.log(`Timeline selection button: ${attribute.value}. ` +
				// 		`Name: ${selectedTimeline.TimelineButtonName}`);
				// 	if(attribute.value == selectedTimeline.TimelineButtonName)
				// 	{
				// 		console.log("Selection found...");
				// 		sel = document.createAttribute("selected");
				// 		sel.value = "selected";
				// 		obj.attributes.setNamedItem(sel);
				// 		return false;
				// 	}
				// });
				console.log(`Select linked button ${selectedTimeline.TimelineButtonName}`);
				$(`#cmboTimelineButton option[name="${selectedTimeline.TimelineButtonName}"]`).
					attr("selected", "selected");
				$("#txtTimelineName").val(selectedTimeline.TimelineName);
				$("#txtTimelineEnable").val(selectedTimeline.TimelineEnableTime);
				$("#txtTimelineDisable").val(selectedTimeline.TimelineDisableTime);
		}
		else
		{
			$("#txtTimelineName").val("");
			$("#txtTimelineEnable").val("");
			$("#txtTimelineDisable").val("");
		}
		$("#txtVideo").val(configData.VideoName);
		slideLeftInput();
		slideTopInput();
		slideWidthInput();
		slideHeightInput();
		bBusy = false;
	}
}
//----------

//----------
// btnButtonAddClick
//----------
/**
	* Called when the Add button button has been clicked.
	* @returns {undefined}
	*/
function btnButtonAddClick()
{
	var bFound = false;
	var index = 0;
	var name = "";
	var record = null;

	if(configData.Buttons)
	{
		index = configData.Buttons.length;
		bFound = true;
		while(bFound)
		{
			bFound = false;
			name = `Button ${index}`;
			bFound = buttonNameExists(name);
			if(bFound)
			{
				index ++;
			}
		}
	}
	else
	{
		//	No buttons defined yet.
		name = "Button 1";
	}
	name = prompt("New button name:", name);
	if(name)
	{
		bFound = buttonNameExists(name);
		if(!bFound)
		{
			//	The name of the button is unique.
			record = {};
			configData.Buttons[configData.Buttons.length] = record;
			record.ButtonName = name;
			record.ButtonLeft = 0;
			record.ButtonTop = 0;
			record.ButtonWidth = 10;
			record.ButtonHeight = 10;
			record.ButtonTarget = "";
			record.ButtonHoverColor = "";
			record.ButtonBackgroundColor = "";
			record.ButtonImageName = "";
			$("#cmboButton").append(`<option name="${record.ButtonName}">` +
				`${record.ButtonName}</option>`);
		}
	}
}
//----------

//----------
// btnButtonDeleteClick
//----------
/**
	* Called when the Delete button button has been clicked.
	* @returns {undefined}
	*/
function btnButtonDeleteClick()
{
	var name = "";
	var sIndex = -1;

	selectedButton = null;
	name = $("#cmboButton").find("option:selected").attr("name");
	if(name)
	{
		//	A list item is selected.
		console.log(`Preparing to delete button def ${name}`);
		configData.Buttons.some(function(obj, index)
		{
			if(obj.ButtonName == name)
			{
				sIndex = index;
				return false;
			}
		});
	}
	if(sIndex != -1)
	{
		console.log(`Deleting button ${sIndex}`);
		if(sIndex == 0)
		{
			configData.Buttons.shift();
		}
		else if(sIndex == configData.Buttons.length - 1)
		{
			configData.Buttons.length = sIndex;
		}
		else
		{
			configData.Buttons = configData.Buttons.splice(sIndex, 1);
		}
		applyConfig();
	}
}
//----------

//----------
// btnTimelineAddClick
//----------
/**
	* Called when the Add timeline button has been clicked.
	* @returns {undefined}
	*/
function btnTimelineAddClick()
{
	var bFound = false;
	var index = 0;
	var name = "";
	var record = null;

	if(configData.Timelines)
	{
		index = configData.Timelines.length;
		bFound = true;
		while(bFound)
		{
			bFound = false;
			name = `Link Button ${index}-1`;
			bFound = timelineNameExists(name);
			if(bFound)
			{
				index ++;
			}
		}
	}
	else
	{
		//	No timelines defined yet.
		name = "Link Button 1-1";
	}
	name = prompt("New timeline name:", name);
	if(name)
	{
		bFound = timelineNameExists(name);
		if(!bFound)
		{
			//	The name of the timeline is unique.
			record = {};
			configData.Timelines[configData.Timelines.length] = record;
			record.TimelineName = name;
			record.TimelineButtonName = "";
			record.TimelineEnableTime = "start";
			record.TimelineDisableTime = "end";
			$("#cmboTimeline").append(`<option name="${record.TimelineName}">` +
				`${record.TimelineName}</option>`);
		}
	}
}
//----------

//----------
// btnTimelineDeleteClick
//----------
/**
	* Called when the Delete timeline button has been clicked.
	* @returns {undefined}
	*/
function btnTimelineDeleteClick()
{
	var name = "";
	var sIndex = -1;

	selectedTimeline = null;
	name = $("#cmboTimeline").find("option:selected").attr("name");
	if(name)
	{
		//	A list item is selected.
		configData.Timelines.some(function(obj, index)
		{
			if(obj.TimelineName == name)
			{
				sIndex = index;
				return false;
			}
		});
	}
	if(sIndex != -1)
	{
		if(sIndex == 0)
		{
			configData.Timelines.shift();
		}
		else if(sIndex == configData.Timelines.length - 1)
		{
			configData.Timelines.length = sIndex;
		}
		else
		{
			configData.Timelines = configData.Timelines.splice(sIndex, 1);
		}
		applyConfig();
	}
}
//----------

//----------
// buttonNameExists
//----------
/**
	* Return a value indicating whether the named button exists in the collection.
	* @param {string} name Name of the button to search for.
	* @returns {boolean} True if the specified button was found. Otherwise, false.
	*/
function buttonNameExists(name)
{
	var result = false;

	if(name && configData.Buttons)
	{
		configData.Buttons.some(function(index, item)
		{
			if(item.ButtonName == name)
			{
				result = true;
				return false;
			}
		});
	}
	return result;
}
//----------

//----------
// ClipboardInterface
//----------
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
//----------

//----------
// cmboButtonChange
//----------
/**
	* Called when the button selection has changed.
	* @returns {undefined}
	*/
function cmboButtonChange()
{
	var name = "";
	var sIndex = -1;		//	Selected index.

	if(!bBusy)
	{
		selectedButton = null;
		//	Get the selected control index.
		name = $("#cmboButton").find("option:selected").attr("name");
		if(name)
		{
			configData.Buttons.some(function(obj, index)
			{
				if(obj.ButtonName == name)
				{
					sIndex = index;
					return false;
				}
			});
		}
		if(sIndex != -1)
		{
			selectedButton = configData.Buttons[sIndex];
			applyConfig();
		}
	}
}
//----------
	
//----------
// cmboTimelineButtonChange
//----------
/**
	* Called when the button associated with the timeline has changed.
	* @returns {undefined}
	*/
function cmboTimelineButtonChange()
{
	var name = "";

	if(!bBusy)
	{
		//	Get the selected control index.
		name = $("#cmboTimelineButton").find("option:selected").attr("name");
		console.log(`Timeline button changed to ${name}`);
		if(name)
		{
			if(selectedTimeline)
			{
				selectedTimeline.TimelineButtonName = name;
			}
		}
	}
}
//----------
	
	//----------
// cmboTimelineChange
//----------
/**
	* Called when the timeline selection has changed.
	* @returns {undefined}
	*/
function cmboTimelineChange()
{
	var name = "";
	var sIndex = -1;		//	Selected index.

	if(!bBusy)
	{
		selectedTimeline = null;
		//	Get the selected control index.
		name = $("#cmboTimeline").find("option:selected").attr("name");
		if(name)
		{
			configData.Timelines.some(function(obj, index)
			{
				if(obj.TimelineName == name)
				{
					console.log(`Timeline found: ${name}`);
					sIndex = index;
					return false;
				}
			});
		}
		if(sIndex != -1)
		{
			selectedTimeline = configData.Timelines[sIndex];
			applyConfig();
		}
	}
}
//----------
	
//----------
// elementCount
//----------
/**
	* Return the count of root elements in the specified object.
	* @param {object} obj Reference to the object for which the count of elements
	* will be returned.
	* @returns {number} Count of root elements in the specified object, if found.
	* Otherwise, 0.
	*/
function elementCount(obj)
{
	var result = 0;

	if(obj)
	{
		result = Object.keys(obj).length;
	}
	return result;
}
//----------

//----------
// generateData
//----------
/**
	* Generate the JSON data and IFRAME html for the video player.
	* @returns {undefined}
	*/
function generateData()
{
	generateIFrame();
	generateJSON();
}
//----------

//----------
// generateIFrame
//----------
/**
	* Generate the IFRAME html from the current settings.
	*/
function generateIFrame()
{
	var config = encodeURIComponent($("#txtConfigLocation").val());
	var player = $("#txtPlayer").val();

	value = `<iframe width="${configData.ViewPortWidth}" ` +
		`height="${configData.ViewPortHeight}" src="` +
		`${player}?configFile=${config}"></iframe>`;
	$("#srcIFrame").val(value);
}
//----------

//----------
// generateJSON
//----------
/**
	* Generate the JSON configuration data from the current settings.
	*/
function generateJSON()
{
	$("#srcJSON").text(JSON.stringify(configData, null, '\t'));
}
//----------

//----------
// loadConfigFile
//----------
/**
	* Load an existing configuration file.
	*/
function loadConfigFile()
{
	var filename = $("#txtConfigFilename").val();

	if(filename)
	{
		$.getJSON(filename, function(data)
			{
				//	On success, data will contain the configuration settings.
				if(data)
				{
					if(data.HVPVersion > 0.0)
					{
						//	Any version of file.
						console.log(`Configuration file loaded: ${filename}`);
						selectedButton = null;
						selectedTimeline = null;
						configData = data;
						if(configData.Buttons)
						{
							selectedButton = configData.Buttons[0];
						}
						if(configData.Timelines)
						{
							selectedTimeline = configData.Timelines[0];
						}
						applyConfig();
					}
				}
			}
		);
	}
}
//----------

//----------
// slideHeightInput
//----------
/**
	* Adjust the height of the selected button.
	*/
function slideHeightInput()
{
	var value = parseInt($("#slideHeight").val());
	$("#divLink").css("height", `${value}%`);
	if(!bBusy && selectedButton)
	{
		selectedButton.ButtonHeight = value;
	}
}
//----------

//----------
// slideLeftInput
//----------
/**
	* Adjust the left position of the selected button.
	*/
function slideLeftInput()
{
	var value = parseInt($("#slideLeft").val());
	$("#divLink").css("left", `${value}%`);
	if(!bBusy && selectedButton)
	{
		selectedButton.ButtonLeft = value;
	}
}
//----------

//----------
// slideTopInput
//----------
/**
	* Adjust the top position of the selected button.
	*/
function slideTopInput()
{
	var value = parseInt($("#slideTop").val());
	$("#divLink").css("top", `${value}%`);
	if(!bBusy && selectedButton)
	{
		selectedButton.ButtonTop = value;
	}
}
//----------

//----------
// slideWidthInput
//----------
/**
	* Adjust the width of the selected button.
	*/
function slideWidthInput()
{
	var value = parseInt($("#slideWidth").val());
	$("#divLink").css("width", `${value}%`);
	if(!bBusy && selectedButton)
	{
		selectedButton.ButtonWidth = value;
	}
}
//----------

//----------
// timelineNameExists
//----------
/**
	* Return a value indicating whether the named timeline exists in the collection.
	* @param {string} name Name of the timeline to search for.
	* @returns {boolean} True if the specified timeline was found. Otherwise, false.
	*/
function timelineNameExists(name)
{
	var result = false;

	if(name && configData.Timelines)
	{
		configData.Timelines.some(function(index, item)
		{
			if(item.TimelineName == name)
			{
				result = true;
				return false;
			}
		});
	}
	return result;
}
//----------
	
//----------
// txtButtonBackgroundColorChange
//----------
/**
	* Called when the background color value has been changed.
	* @returns {undefined}
	*/
function txtButtonBackgroundColorChange()
{
	if(!bBusy && selectedButton)
	{
		selectedButton.ButtonBackgroundColor = $("#txtButtonBackgroundColor").val();
	}
}
//----------

//----------
// txtButtonHoverColorChange
//----------
/**
	* Called when the hover color value has been changed.
	* @returns {undefined}
	*/
function txtButtonHoverColorChange()
{
	if(!bBusy && selectedButton)
	{
		selectedButton.ButtonHoverColor = $("#txtButtonHoverColor").val();
	}
}
//----------

//----------
// txtButtonImageChange
//----------
/**
	* Called when the name of the button image has been changed.
	* @returns {undefined}
	*/
function txtButtonImageChange()
{
	if(!bBusy && selectedButton)
	{
		selectedButton.ButtonImageName = $("#txtButtonImage").val();
	}
}
//----------

//----------
// txtButtonNameChange
//----------
/**
	* Called when the name of the button has been changed.
	* @returns {undefined}
	*/
function txtButtonNameChange()
{
	var name = "";		//	New name.

	if(!bBusy && selectedButton)
	{
		//	First rename all timeline references to this button.
		if(configData.Timelines)
		{
			name = $("#txtButtonName").val();
			configData.Timelines.forEach(function(item, index)
			{
				if(item.TimelineButtonName == selectedButton.ButtonName)
				{
					item.TimelineButtonName = name;
				}
			});
		}
		//	Finally, rename the button itself.
		selectedButton.ButtonName = name;
		applyConfig();
	}
}
//----------

//----------
// txtButtonTargetChange
//----------
/**
	* Called when the target URL has changed.
	* @returns {undefined}
	*/
function txtButtonTargetChange()
{
	if(!bBusy && selectedButton)
	{
		selectedButton.ButtonTarget = $("#txtButtonTarget").val();
	}
}
//----------

//----------
// txtPlayerChange
//----------
/**
	* Called when the location of the player has been changed.
	* @returns {undefined}
	*/
function txtPlayerChange()
{
	if(!bBusy)
	{
		playerLocation = $("#txtPlayer").val();
	}
}
//----------

//----------
// txtTimelineDisableChange
//----------
/**
	* Called when the disable time has changed.
	* @returns {undefined}
	*/
function txtTimelineDisableChange()
{
	if(!bBusy && selectedTimeline)
	{
		selectedTimeline.TimelineDisableTime = $("#txtTimelineDisable").val();
	}
}
//----------

//----------
// txtTimelineEnableChange
//----------
/**
	* Called when the enable time has changed.
	* @returns {undefined}
	*/
function txtTimelineEnableChange()
{
	if(!bBusy && selectedTimeline)
	{
		selectedTimeline.TimelineEnableTime = $("#txtTimelineEnable").val();
	}
}
//----------

//----------
// txtTimelineNameChange
//----------
/**
	* Called when the name of the timeline has been changed.
	* @returns {undefined}
	*/
function txtTimelineNameChange()
{
	if(!bBusy && selectedTimeline)
	{
		selectedTimeline.TimelineName = $("#txtTimelineName").val();
		applyConfig();
	}
}
//----------

//----------
// txtVideoChange
//----------
/**
	* Called when the location of the video has changed.
	* @returns {undefined}
	*/
function txtVideoChange()
{
	if(!bBusy)
	{
		configData.VideoName = $("#txtVideo").val();
	}
}
//----------

//----------
// txtViewHeightChange
//----------
/**
	* Called when the IFRAME portal height has been changed.
	* @returns {undefined}
	*/
function txtViewHeightChange()
{
	if(!bBusy)
	{
		configData.ViewPortHeight = parseInt($("#txtViewHeight").val());
	}
}
//----------

//----------
// txtViewWidthChange
//----------
/**
	* Called when the IFRAME portal width has been changed.
	* @returns {undefined}
	*/
function txtViewWidthChange()
{
	if(!bBusy)
	{
		configData.ViewPortWidth = parseInt($("#txtViewWidth").val());
	}
}
//----------
