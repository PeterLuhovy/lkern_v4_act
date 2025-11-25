# ================================================================
# FILE: create-shortcuts.ps1
# PATH: /create-shortcuts.ps1
# DESCRIPTION: Create desktop shortcuts for L-KERN Control Panel
# VERSION: v1.0.0
# UPDATED: 2025-11-23 15:45:00
# ================================================================
# Creates two shortcuts with L-KERN icon:
# - L-KERN Control Panel.lnk (normal mode - hidden terminal)
# - L-KERN Control Panel (Debug).lnk (debug mode - visible terminal)
# ================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  L-KERN Control Panel - Shortcut Creator" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Project root is 3 levels up from scripts/ folder
$projectRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $scriptDir))

# Paths
$normalBat = Join-Path $scriptDir "control-panel.bat"
$debugBat = Join-Path $scriptDir "control-panel-debug.bat"
$iconPath = Join-Path $projectRoot "lkern-logo.ico"

# Desktop path
$desktopPath = [Environment]::GetFolderPath("Desktop")

# Check if batch files exist
if (-not (Test-Path $normalBat)) {
    Write-Host "[ERROR] control-panel.bat not found!" -ForegroundColor Red
    Write-Host "Path: $normalBat" -ForegroundColor Yellow
    pause
    exit 1
}

if (-not (Test-Path $debugBat)) {
    Write-Host "[ERROR] control-panel-debug.bat not found!" -ForegroundColor Red
    Write-Host "Path: $debugBat" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if icon exists
if (-not (Test-Path $iconPath)) {
    Write-Host "[WARNING] Icon not found at: $iconPath" -ForegroundColor Yellow
    Write-Host "Shortcuts will use default icon." -ForegroundColor Yellow
    $iconPath = $null
}

# Create WScript Shell object
$WScriptShell = New-Object -ComObject WScript.Shell

# === CREATE SHORTCUT 1: Normal Mode ===
Write-Host "[INFO] Creating shortcut: L-KERN Control Panel.lnk" -ForegroundColor Green
$shortcut1Path = Join-Path $desktopPath "L-KERN Control Panel.lnk"
$shortcut1 = $WScriptShell.CreateShortcut($shortcut1Path)
$shortcut1.TargetPath = $normalBat
$shortcut1.WorkingDirectory = $projectRoot
$shortcut1.Description = "L-KERN Control Panel - Normal Mode (Hidden Terminal)"
$shortcut1.WindowStyle = 7  # Minimized window

if ($iconPath) {
    $shortcut1.IconLocation = "$iconPath,0"
}

$shortcut1.Save()
Write-Host "  ✅ Created: $shortcut1Path" -ForegroundColor Green
Write-Host ""

# === CREATE SHORTCUT 2: Debug Mode ===
Write-Host "[INFO] Creating shortcut: L-KERN Control Panel (Debug).lnk" -ForegroundColor Green
$shortcut2Path = Join-Path $desktopPath "L-KERN Control Panel (Debug).lnk"
$shortcut2 = $WScriptShell.CreateShortcut($shortcut2Path)
$shortcut2.TargetPath = $debugBat
$shortcut2.WorkingDirectory = $projectRoot
$shortcut2.Description = "L-KERN Control Panel - Debug Mode (Visible Terminal)"
$shortcut2.WindowStyle = 1  # Normal window

if ($iconPath) {
    $shortcut2.IconLocation = "$iconPath,0"
}

$shortcut2.Save()
Write-Host "  ✅ Created: $shortcut2Path" -ForegroundColor Green
Write-Host ""

# === SUMMARY ===
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Shortcuts created successfully!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Location: $desktopPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Files created:" -ForegroundColor White
Write-Host "  1. L-KERN Control Panel.lnk (Normal Mode)" -ForegroundColor White
Write-Host "  2. L-KERN Control Panel (Debug).lnk (Debug Mode)" -ForegroundColor White
Write-Host ""
Write-Host "You can now double-click these shortcuts to launch the Control Panel." -ForegroundColor White
Write-Host ""

pause
