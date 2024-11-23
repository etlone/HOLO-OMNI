@echo off
echo Starting Holistic Health App...

:: Set Node.js path
set PATH=%PATH%;C:\Program Files\nodejs;%USERPROFILE%\AppData\Roaming\npm

:: Navigate to project directory
cd /d "%~dp0"

:: Start Expo
echo Starting Expo development server...
call npx expo start --web

pause
