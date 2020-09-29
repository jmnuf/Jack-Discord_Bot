Title Server restarter
@echo off
cls
set "botWin=DiscordBot-Jack-a2"
:run_node
start bot.bat %botWin%
echo starting bot...
rem echo Restart node? y/n
:menu
Echo Pick what to do:
Echo 1) Restart bot
Echo 2) Install package
Echo 3) Run command
Echo 4) Close window
set /p Inp=Do #
If /I "%Inp%"=="1" goto yes
If /I "%Inp%"=="2" goto install
If /I "%Inp%"=="3" goto run
If /I "%Inp%"=="4" goto end

echo Invalid index
goto menu

:yes
taskkill /IM node.exe /F
cls
goto run_node

:install
set /p package=Package name: 
echo npm install %package%
npm install %package%
timeout /t -1
cls
goto menu

:run
set /p cmd=Command: 
%cmd%
timeout /t -1
cls
goto menu

:end
echo closing...
timeout /t 5 /nobreak
Exit