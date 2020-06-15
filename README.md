# Embedded Video Player With YouTube-Style Hotspot Links

HTML5 allows the direct inclusion of a video with transport controls into any web page. However, a little bit of additional work is needed to place interactive overlays on the screen above the video, especially in cases when you are using a template-driven website like WordPress, Wix, Sites, or others that don't allow direct customization of the underlying HTML code.

To work around that obstacle, a combination video player and overlay control, hosted on another site that does support cusomization, is embedded in the intended web page using an iframe, an HTML container component specialized just for that type of purpose.

![Video player with overlays on a template-based website](images/VideoWithOverlayProcess.png)

## Needed Files
To run the VideoPlayer from a site of your choosing, you will need the following files from this repository.

 - VideoPlayer.html
 - VideoPlayer.css
 - scripts/jquery-3.4.1.min.js
 - scripts/VideoPlayer.js

## Configuring Your Video
A configuration page has been added to help you configure your overlay code for the VideoPlayer.html control. That page can be used on my profile page [here](https://danielanywhere.github.io/VideoPlayer/ConfigurePlayer.html).

To generate your JSON data and IFRAME html command:
 - Paste a single frame of your video into the viewer.
 - Add buttons as needed.
 - Adjust the sliders to surround your buttons.
 - Set one or more timelines for each button.
 - Enter additional information about the video and configuration locations.
 - Click **Generate Data**.

A JSON data configuration and matching IFRAME code will be generated for you automatically. If using the configuration page, you can probably skip the rest of the information on this page, unless you want to see the [preconfigured demo page](https://danielanywhere.github.io/VideoPlayer/Index.html).

## Current Control State
In the example page, an &lt;iframe&gt; element is used to display a basic movie with a clickable overlay control, enabled at 53 seconds, and embedded into the intended web page.

In the current version, multiple clickable overlays can be created, each with multiple timelines, if desired. However, only transparent hotspots for the link are supported, meaning you will need to provide your own formatted button image in the video you intend to highlight. To help with positioning the hotspot over your button image, though, you can turn on the hot spot indicator to highlight the full area sensitive to your button click. I recommend that you use the ConfigurePlayer page mentioned in the previous section to define your hotspots. It is quick and reliable.
<br /><br />

## Getting Started
To use the embedded iframe control, set its <b>width</b> and <b>height</b> attributes to the width and height to be displayed on the host web page, then follow these instructions to set the value of the <b>src</b> attribute to load the video and control the hotspot card.
<br /><br />

### Filling The IFRAME SRC Attribute
Start with the full https path to the video player page, followed by a question mark to indicating that parameters are included.

For example:
<blockquote>
<b>https://www.mydomain.com/VideoPlayer.html?</b>(Parameters will go here)
</blockquote>

Next, add all of the appropriate parameters from the reference list below, using this general syntax:
<blockquote>
{ParameterName}<b>=</b>{ParameterValue}<b>&amp; ...</b>
</blockquote>

For example:
<blockquote>
src=&quot;VideoPlayer.html?configFile=ExampleConfig.json&quot;
</blockquote>
<br /><br />

### About Video Frame Size
In the following reference table, several values are described as being a percentage of the current video frame size, which refers to the characteristic that it is possible for the video to be placed into a frame of any size, that in certain cases, can be sized in response to the current browser resolution and might also be resizable in real time by the current viewer, depending upon the settings of the page upon which it is shown.

To easily address the variability in display size, most of the parameters in the layout category are references to percentage of the current display size of the video frame.

The following steps help to calculate the positioning and size of the button, relative to the video.

 1. Open the video you are going to display and run it in full screen.
 2. Index to the time at which the button is displayed and stop the video.
 3. Press the \[PrtScr\] button on your keyboard to copy the screen content to the clipboard.
 ![Captured video frame](images/MeasureStep01-Capture.png)
 4. Open GIMP or some other bitmap editor that allows you to to review your cursor position.
 5. Paste the captured image into your editor.
 ![Note orientation](images/MeasureStep05-Observe.png)
 6. Note the width and height of the captured frame. For this example, FrameWidth = 1920 and FrameHeight = 1080.
 ![Captured frame dimensions](images/MeasureStep06-Dimension.png)
 7. Hover your cursor over the top left corner and note the location. In this example, LeftX = 25 and TopY = 113.
 ![Button top left location](images/MeasureStep07-TopLeft.png)
 8. Hover your cursor over the bottom right corner and note the location. In this example, RightX = 565 and BottomY = 369.
 ![Button bottom right location](images/MeasureStep08-BottomRight.png)

Using the values assumed for this example, the following calculations are used for highlighting this button in the top left quadrant.
 - buttonTop = (TopY / FrameHeight) * 100 = (113 / 1080) * 100 ~ 10.463
 - buttonLeft = (LeftX / FrameWidth) * 100 = (25 / 1920) * 100 ~ 1.302
 - buttonWidth = ((RightX - LeftX) / FrameWidth) * 100 = ((565 - 25) / 1920) * 100 = 28.125
 - buttonHeight = ((BottomX - TopX) / FrameHeight) * 100 = ((369 - 113) / 1080) * 100 ~ 23.704
<br />

### SRC Parameter Reference
To be as general-purpose as possible, and completely reusable for different videos, the video player control is driven by a JSON data file. The IFRAME src attribute takes only one parameter: the URL encoded name of the JSON file.

The JSON data file contains a number of name/value attributes, a Buttons collection, and a Timelines collection. The JSON file values are described in the following table.

| Category | Parameter | Values | Description |
|----------|-----------|--------|-------------|
| Header | HVPVersion | 1.0 | Verification value to determine that a valid JSON configuration was loaded for the current session. |
| Layout | ViewPortWidth | Integer | Width of the IFRAME viewport, in pixels. |
| Layout | ViewPortHeight | Integer | Height of the IFRAME viewport, in pixels. |
| Overlay | Buttons.ButtonName | String | Name of the button. |
| Overlay | Buttons.ButtonTarget | String | URL or relative filename to open when this button is clicked. |
| Overlay | Buttons.ButtonLeft | Integer | Distance of the button from the left of the video, in percentage of the current video frame size. |
| Overlay | Buttons.ButtonTop | Integer | Distance of the button from the top of the video, in percentage of the current video frame size. |
| Overlay | Buttons.ButtonWidth | Integer | Width of the button, as a percentage of the current video frame size. |
| Overlay | Buttons.ButtonHeight | Integer | Height of the button, as a percentage of the current video frame size. |
| Overlay | Buttons.ButtonHoverColor | String | Outline color of the button. If blank, no outline is shown during hover. |
| Overlay | Buttons.ButtonBackgroundColor | String | Solid background color of the button. If blank, no background color is shown during hover. At present, this value is mainly used to manually work out proper dimensions and timing for the button. |
| Overlay | Buttons.ButtonImageName | String | Reserved. This feature is not yet implemented. If you wish to see this function, please request it. |
| Timing | Timelines.TimelineName | String | Unique name of the timeline. |
| Timing | Timelines.TimelineButtonName | String | Name of the button associated with this timing. |
| Timing | Timelines.TimelineEnableTime | String or Integer | Any number of seconds at which the overlay will be enabled, or the keywords **start** or **end**. |
| Timing | Timelines.TimelineDisableTime | String or Integer | Any number of seconds and which the overlay will be hidden, or the keywords **start** or **end**. |
| Source | VideoName | String | Filename of the video. |
<br /><br />

### Completed IFRAME
Following is an example of the fully-filled iframe reference used on the Index.html linked below, or readable on this folder.

<blockquote>
&lt;iframe width=&quot;700&quot; height=&quot;394&quot;
src=&quot;https&colon;&sol;&sol;danielanywhere.github.io/VideoPlayer.html?configFile=videos&percnt;2FForcedPerspective.json&quot;&gt;&lt;/iframe&gt;
</blockquote>

## Demo
This README file isn't allowed to include an IFRAME view, so the working demo is placed in the VideoPlayer/Index.html example page of my profile page here on GitHub.

Follow [this link](https://danielanywhere.github.io/VideoPlayer/Index.html) to see the demo video with a clickable button that appears at 53 seconds.
