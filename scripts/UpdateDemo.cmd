:: UpdateDemo.cmd
:: Update the demo files on the profile page.

XCOPY ..\ConfigurePlayer.html ..\..\danielanywhere.github.io\VideoPlayer /c /d /y
XCOPY ..\Index.html ..\..\danielanywhere.github.io\VideoPlayer /c /d /y
XCOPY ..\TestTarget.html ..\..\danielanywhere.github.io\VideoPlayer /c /d /y
XCOPY ..\VideoPlayer.css ..\..\danielanywhere.github.io\VideoPlayer /c /d /y
XCOPY ..\VideoPlayer.html ..\..\danielanywhere.github.io\VideoPlayer /c /d /y
XCOPY ..\videos\*.* ..\..\danielanywhere.github.io\VideoPlayer\videos /c /d /y
XCOPY *.js ..\..\danielanywhere.github.io\VideoPlayer\scripts /c /d /y
