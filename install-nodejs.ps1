# Set TLS to 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Installing Node.js..." -ForegroundColor Green

# Download URL for Node.js LTS
$nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
$installerPath = "$env:TEMP\nodejs_installer.msi"

try {
    # Download Node.js installer
    Write-Host "Downloading Node.js installer..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath

    # Install Node.js
    Write-Host "Running installer..." -ForegroundColor Yellow
    Start-Process msiexec.exe -Wait -ArgumentList "/i `"$installerPath`" /qn ADDLOCAL=ALL"

    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

    # Clean up
    Remove-Item $installerPath -Force

    Write-Host "Node.js installation completed!" -ForegroundColor Green
    
    # Install project dependencies
    Write-Host "Installing project dependencies..." -ForegroundColor Yellow
    Set-Location -Path "c:/Users/hadiu/CascadeProjects/holistic-health-app"
    & "C:\Program Files\nodejs\npm.cmd" install --legacy-peer-deps
    
    # Install Expo CLI globally
    Write-Host "Installing Expo CLI..." -ForegroundColor Yellow
    & "C:\Program Files\nodejs\npm.cmd" install -g expo-cli
    
    # Start the application
    Write-Host "Starting the application..." -ForegroundColor Green
    & "C:\Program Files\nodejs\npx.cmd" expo start --web

} catch {
    Write-Host "An error occurred during installation: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
