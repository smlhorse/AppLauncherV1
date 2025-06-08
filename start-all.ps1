# I Ching Application Launcher
# Author: GitHub Copilot
# Date: June 4, 2025

# UTF-8 Encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Root Directory
$Root = "c:\Users\p10397148\Desktop\AppLauncher"
$AppRoot = "$Root\apps\iching_v1"

# Determine language preference
function Get-UserLanguage {
    $culture = (Get-Culture).Name
    if ($culture -like "zh*") {
        return "zh"
    } else {
        return "en"
    }
}
$UserLanguage = Get-UserLanguage

# Service Configuration
$Svcs = @{
    B = @{ # Backend
        Name = "Backend API"
        Port = 8001
        Proc = "python*"
        Path = "$AppRoot\backend"
        Cmd = "python app.py"    }
    W = @{ # Web Frontend
        Name = "Web Frontend"
        Port = 3000
        Proc = "node"
        Path = "$AppRoot\frontend\web"
        Cmd = "`$env:PORT=3000; pnpm dev"
    }    M = @{ # Mobile App
        Name = "Mobile App"
        Port = 19000 
        Proc = "node"
        Path = "$AppRoot\frontend\mobile"
        Cmd = if ($UserLanguage -eq "zh") { "powershell -File .\expo-compatibility-fix.ps1" } else { "powershell -File .\expo-compatibility-fix-en.ps1" }
        Pre = "$AppRoot\frontend\mobile\update-api-servers-new.ps1"
    }
}

# Stop Services
function Stop-App {
    param([string]$Type)
    
    if ($Type -eq "All") {
        $Types = @("B", "W", "M")
        
        # Kill all processes on common React Native/Expo ports regardless of name
        $CommonPorts = @(8081, 8082, 19000, 19001, 19002, 19006)
        Write-Host "Stopping any processes on common React Native/Expo ports..." -ForegroundColor Yellow
        foreach ($Port in $CommonPorts) {
            $PortProcs = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                        Select-Object -ExpandProperty OwningProcess
            if ($PortProcs) {
                foreach ($Proc in $PortProcs) {
                    try {
                        $Process = Get-Process -Id $Proc -ErrorAction SilentlyContinue
                        if ($Process) {
                            Stop-Process -Id $Proc -Force
                            Write-Host "  Stopped process on port $Port (PID: $Proc, Name: $($Process.ProcessName))" -ForegroundColor Green
                        }
                    } catch {
                        Write-Host "  Failed to stop process on port $Port (PID: $Proc)" -ForegroundColor Red
                    }
                }
            }
        }
          # Kill any lingering node or npm processes that might be related to Expo/React Native
        $ExpoProcNames = @("node", "npm", "npx", "expo")
        foreach ($ProcName in $ExpoProcNames) {
            $Processes = Get-Process -Name $ProcName -ErrorAction SilentlyContinue
            if ($Processes) {
                $Processes | Stop-Process -Force -ErrorAction SilentlyContinue
                Write-Host "  Stopped all $ProcName processes that may be related to React Native/Expo" -ForegroundColor Green
            }
        }
    } else {
        $Types = @($Type)
    }
    
    foreach ($Key in $Types) {
        $S = $Svcs[$Key]
        Write-Host "Stopping $($S.Name)..." -ForegroundColor Yellow
        
        $Procs = Get-Process -Name $S.Proc -ErrorAction SilentlyContinue | 
                Where-Object { $_.Id -in (Get-NetTCPConnection -LocalPort $S.Port -ErrorAction SilentlyContinue).OwningProcess }
        
        if ($Procs) {
            $Procs | Stop-Process -Force
            Write-Host "  Service $($S.Name) stopped" -ForegroundColor Green
        } else {
            Write-Host "  No running $($S.Name) service found" -ForegroundColor Green
        }
    }
}

# Start Services
function Start-App {
    param([string]$Type)
    
    $S = $Svcs[$Type]
      # For mobile app, perform thorough cleanup first
    if ($Type -eq "M") {
        # Display message in appropriate language
        if ($UserLanguage -eq "zh") {
            Write-Host "在啟動移動應用前進行徹底清理..." -ForegroundColor Cyan
        } else {
            Write-Host "Performing thorough cleanup before starting Mobile App..." -ForegroundColor Cyan
        }
        
        Stop-App -Type "All"  # Use the more thorough cleanup
        # Additional cleanup for Metro Bundler and other React Native/Expo processes
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "metro|expo|react" } | Stop-Process -Force
    } else {
        Stop-App -Type $Type
    }
    
    # Add a small delay to ensure ports are fully released
    Start-Sleep -Seconds 2
    
    Write-Host "Starting $($S.Name)..." -ForegroundColor Green
    
    if ($S.Pre) {
        & $S.Pre
    }
    
    Start-Process powershell -ArgumentList "-NoExit -Command cd $($S.Path); $($S.Cmd)"
}

# Check Service Status
function Get-AppStatus {
    param([string]$Type)
    
    $S = $Svcs[$Type]
    $Status = "Stopped"
    $Color = "Red"

    $Procs = Get-Process -Name $S.Proc -ErrorAction SilentlyContinue |
        Where-Object { $_.Id -in (Get-NetTCPConnection -LocalPort $S.Port -ErrorAction SilentlyContinue).OwningProcess }

    if ($Procs) {
        $Status = "Running"
        $Color = "Green"
    }

    return @{
        Status = $Status
        Color = $Color
    }
}

# Main Menu
function Show-Menu {
    Clear-Host
    
    # Get service status
    $BStatus = Get-AppStatus -Type "B"
    $WStatus = Get-AppStatus -Type "W"
    $MStatus = Get-AppStatus -Type "M"
      # Display title in appropriate language
    if ($UserLanguage -eq "zh") {
        Write-Host "===== 易經應用程序啟動器 =====" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "服務狀態:" -ForegroundColor Cyan
        Write-Host "  後端 API: " -NoNewline; Write-Host $BStatus.Status -ForegroundColor $BStatus.Color
        Write-Host "  Web 前端: " -NoNewline; Write-Host $WStatus.Status -ForegroundColor $WStatus.Color
        Write-Host "  移動應用: " -NoNewline; Write-Host $MStatus.Status -ForegroundColor $MStatus.Color
    } else {
        Write-Host "===== I Ching Application Launcher =====" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Service Status:" -ForegroundColor Cyan
        Write-Host "  Backend API: " -NoNewline; Write-Host $BStatus.Status -ForegroundColor $BStatus.Color
        Write-Host "  Web Frontend: " -NoNewline; Write-Host $WStatus.Status -ForegroundColor $WStatus.Color
        Write-Host "  Mobile App: " -NoNewline; Write-Host $MStatus.Status -ForegroundColor $MStatus.Color
    }
    Write-Host ""    # Display options in appropriate language
    if ($UserLanguage -eq "zh") {
        $Options = @(
            "1. 啟動後端 API",
            "2. 啟動 Web 前端",
            "3. 啟動移動應用",
            "4. 啟動所有服務",
            "5. 顯示網絡 IP",
            "6. 清理臨時文件",
            "7. 測試 API 連接",
            "8. 停止所有服務", 
            "9. 升級 Expo SDK",
            "0. 退出"
        )
    } else {
        $Options = @(
            "1. Start Backend API",
            "2. Start Web Frontend",
            "3. Start Mobile App",
            "4. Start All Services",
            "5. Show Network IP",
            "6. Clean Temp Files",
            "7. Test API Connection",
            "8. Stop All Services", 
            "9. Upgrade Expo SDK",
            "0. Exit"
        )
    }
    
    foreach ($Opt in $Options) {
        Write-Host $Opt -ForegroundColor White
    }    Write-Host ""
    
    # Display prompt in appropriate language
    if ($UserLanguage -eq "zh") {
        return Read-Host "請選擇一個選項 (0-9)"
    } else {
        return Read-Host "Select an option (0-9)"
    }
}

# Clean Temporary Files
function Clear-Temp {
    Write-Host "Cleaning temporary files..." -ForegroundColor Cyan
    
    # Clean web cache
    $WebCache = "$AppRoot\frontend\web\.next\cache"
    if (Test-Path $WebCache) {
        Remove-Item -Path "$WebCache\webpack\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    # Clean Python cache
    Get-ChildItem -Path $AppRoot -Recurse -Directory -Filter "__pycache__" | 
        ForEach-Object { Remove-Item -Path $_.FullName -Recurse -Force }
    
    # Delete backup files
    Get-ChildItem -Path $AppRoot -Recurse -File -Include "*.old","*.bak","*.backup","*.tmp","*.temp" |
        ForEach-Object { Remove-Item -Path $_.FullName -Force }
    
    Write-Host "Cleaning complete" -ForegroundColor Green
}

# Main Process
while ($true) {
    $Choice = Show-Menu
    switch ($Choice) {
        "1" { Start-App -Type "B"; break }        "2" { Start-App -Type "W"; break }
        "3" { Start-App -Type "M"; break }
        "4" {
            # Perform thorough cleanup of all processes first
            Stop-App -Type "All"
            
            # Give extra time for ports to fully release
            Write-Host "Waiting for all ports to be released..." -ForegroundColor Cyan
            Start-Sleep -Seconds 3
            
            # Start services with delays between them
            Start-App -Type "B"
            Write-Host "Waiting for Backend API to initialize..." -ForegroundColor Cyan
            Start-Sleep -Seconds 3
            
            Start-App -Type "W"
            Write-Host "Waiting for Web Frontend to initialize..." -ForegroundColor Cyan
            Start-Sleep -Seconds 3
            
            Start-App -Type "M"
            break 
        }
        "5" { & "$AppRoot\frontend\mobile\get-ip-addresses.ps1" }
        "6" { Clear-Temp }
        "7" { & "$AppRoot\frontend\mobile\test-api.ps1" }
        "8" { 
            Stop-App -Type "All"
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }        "9" { 
            # Run SDK upgrade tool
            if ($UserLanguage -eq "zh") {
                Write-Host "開始 Expo SDK 升級流程..." -ForegroundColor Magenta
            } else {
                Write-Host "Starting Expo SDK upgrade process..." -ForegroundColor Magenta
            }
            
            # Stop mobile app if running to avoid conflicts
            Stop-App -Type "M"
            
            # Use the appropriate language version
            if ($UserLanguage -eq "zh") {
                & "$AppRoot\frontend\mobile\upgrade-expo-sdk-zh.ps1"
            } else {
                & "$AppRoot\frontend\mobile\upgrade-expo-sdk.ps1"
            }
        }"0" { exit }
        default { 
            Write-Host "Invalid option. Please try again." -ForegroundColor Red 
            Start-Sleep -Seconds 1
        }
    }
}
