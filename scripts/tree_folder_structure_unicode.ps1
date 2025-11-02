param([string]$Path = ".")

function Show-Tree {
    param(
        [string]$Path = ".", 
        [string]$Prefix = "", 
        [bool]$IsLast = $true,
        [string[]]$IgnoreFolders = @(".venv", ".idea", ".staff", "node_modules", ".git", "__pycache__", "bin", "obj", "dist", "build")
    )
    
    if (-not (Test-Path $Path)) {
        Write-Error "Path '$Path' does not exist."
        return
    }
    
    $items = Get-ChildItem -Path $Path | Sort-Object Name
    
    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $isLastItem = ($i -eq $items.Count - 1)
        
        # Unicode znaky pomocou [char] konštrukcie
        if ($isLastItem) {
            $connector = [char]0x2514 + [char]0x2500 + [char]0x2500 + " "  # └──
        } else {
            $connector = [char]0x251C + [char]0x2500 + [char]0x2500 + " "  # ├──
        }
        
        if ($item.PSIsContainer) {
            Write-Host "$Prefix$connector$($item.Name)/" -ForegroundColor Cyan
            
            # Ak nie je v zozname ignorovaných priečinkov, zobraz obsah
            if ($item.Name -notin $IgnoreFolders) {
                # Určenie nového prefixu
                if ($isLastItem) {
                    $newPrefix = $Prefix + "    "
                } else {
                    $newPrefix = $Prefix + [char]0x2502 + "   "  # │
                }
                
                Show-Tree -Path $item.FullName -Prefix $newPrefix -IsLast $isLastItem -IgnoreFolders $IgnoreFolders
            }
        } else {
            Write-Host "$Prefix$connector$($item.Name)" -ForegroundColor White
        }
    }
}

# Hlavný kód
if ($Path -eq ".") {
    $Path = Get-Location
}

Write-Host "Directory structure for: $Path" -ForegroundColor Green
Write-Host ""
Show-Tree -Path $Path