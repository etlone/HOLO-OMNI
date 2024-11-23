@echo off
echo Setting up Node.js environment...

:: Add Node.js to PATH
setx PATH "%PATH%;C:\Program Files\nodejs" /M

:: Create a new command prompt with updated PATH
echo Environment variables updated. Please run the following commands in a new command prompt:
echo cd c:/Users/hadiu/CascadeProjects/holistic-health-app
echo npm install --legacy-peer-deps
echo npm install react-native-web@~0.19.6 react-dom@18.2.0 --legacy-peer-deps
echo npx expo start --web

pause
