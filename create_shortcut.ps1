# create_shortcut.ps1
# Creates a Desktop shortcut named "LAN Messenger.lnk" that points to start.cmd
# and sets a system icon (no external .ico required).

$target = Join-Path $PSScriptRoot 'start.cmd'
if (-not (Test-Path $target)) {
  Write-Error "Target not found: $target"
  exit 1
}

$WshShell = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')
$linkPath = Join-Path $desktop 'LAN Messenger.lnk'

$shortcut = $WshShell.CreateShortcut($linkPath)
$shortcut.TargetPath = (Resolve-Path $target).ProviderPath
$shortcut.WorkingDirectory = Split-Path $shortcut.TargetPath
# Use a system icon resource (imageres.dll). You can change the index if you prefer.
$shortcut.IconLocation = "$env:SystemRoot\\system32\\imageres.dll,15"
$shortcut.WindowStyle = 1
$shortcut.Save()

Write-Output "Created shortcut: $linkPath"
Write-Output "Icon used: $($shortcut.IconLocation)"
