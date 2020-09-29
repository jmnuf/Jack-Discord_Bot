@echo off
set botWin=
If [%1]==[] (
	Set botWin=DiscordBot
) Else (
	Set botWin=%1
)
echo %botWin%
@Title %botWin%
rem @start /b node main.js
node main.js
@Echo off
Timeout /t 2
Exit
rem timeout /t -1