# Installs the generated NSIS package on a disposable GitHub-hosted Windows
# runner, launches the *installed* EXE, and verifies a silent uninstall.
# Does not modify developer/user PCs or existing documents.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ($env:GITHUB_ACTIONS -ne 'true' -or [string]::IsNullOrWhiteSpace($env:RUNNER_TEMP)) {
  throw 'NSIS lifecycle test is permitted only on an isolated GitHub Actions runner'
}

$setup = @(Get-ChildItem -LiteralPath 'release' -Filter 'ASTRA-PDF-Redesigner-Setup-*-x64.exe' -File)
if ($setup.Count -ne 1) { throw "Expected exactly one NSIS installer, found $($setup.Count)" }

$installation = Join-Path $env:RUNNER_TEMP ("astra-ci-nsis-" + $PID)
$appProfile = Join-Path $env:APPDATA 'AstraPDFRedesigner'
$sentinelName = "astra-ci-preservation-$PID.marker"
$sentinel = Join-Path $appProfile $sentinelName
$markerValue = "CI-KEEP-$PID"
$wasInstalled = $false
$removed = $false
$links = @()
$installer = $setup[0].FullName

function Test-UniqueExecutable($folder, $type) {
  $items = @(Get-ChildItem -LiteralPath $folder -Filter '*.exe' -File |
    Where-Object {
      if ($type -eq 'app') { $_.Name -like 'ASTRA*.exe' }
      else { $_.Name -like 'Uninstall*.exe' }
    })
  if ($items.Count -ne 1) {
    throw "Expected exactly one $type executable in isolated installation; found $($items.Count)"
  }
  return $items[0].FullName
}

function Wait-Removed($path) {
  for ($attempt=0; $attempt -lt 60; $attempt++) {
    if (-not (Test-Path -LiteralPath $path)) { return }
    Start-Sleep -Milliseconds 500
  }
  throw "NSIS uninstaller did not remove the isolated installation: $path"
}

function Find-AstraShortcuts($folder) {
  if (-not (Test-Path -LiteralPath $folder)) { return @() }
  return @(Get-ChildItem -LiteralPath $folder -Recurse -File -Filter '*ASTRA*.lnk' -ErrorAction Stop)
}

try {
  if (Test-Path -LiteralPath $installation) { throw "Refusing to overwrite an existing folder: $installation" }
  if (Test-Path -LiteralPath $sentinel) { throw 'Test profile sentinel already exists' }

  # NSIS requires /D=PATH to be LAST and without quotes. The CI temporary
  # folder must be whitespace-free to avoid ambiguous Start-Process quoting.
  if ($installation -match '\s') { throw 'Unexpected whitespace in isolated NSIS install path' }
  $arguments = @('/S', "/D=$installation")
  $installProcess = Start-Process -FilePath $installer -ArgumentList $arguments -Wait -PassThru -NoNewWindow
  if ($installProcess.ExitCode -ne 0) { throw "NSIS silent install failed: $($installProcess.ExitCode)" }

  if (-not (Test-Path -LiteralPath $installation -PathType Container)) {
    throw 'Silent installation did not respect isolated /D path'
  }
  $installedExe = Test-UniqueExecutable $installation 'app'
  $uninstallExe = Test-UniqueExecutable $installation 'uninstall'
  $wasInstalled = $true
  Write-Host "PASS ASTRA NSIS INSTALL: isolated directory, installed app and uninstaller found"

  # All paths live in the disposable Windows runner's ephemeral user profile.
  $desktop = [Environment]::GetFolderPath('Desktop')
  $startMenu = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs'
  $desktopLinks = @(Find-AstraShortcuts $desktop)
  $startLinks = @(Find-AstraShortcuts $startMenu)
  $links = @($desktopLinks) + @($startLinks)
  if ($desktopLinks.Count -lt 1) { throw 'Installed desktop shortcut missing' }
  if ($startLinks.Count -lt 1) { throw 'Installed Start Menu shortcut missing' }
  Write-Host "PASS ASTRA NSIS SHORTCUTS: desktop=$($desktopLinks.Count) start-menu=$($startLinks.Count)"

  # The smoke app writes a PDF under its own isolated PID-specific profile.
  # That test file is immediately checked and deleted by the Electron main
  # process; no personal PDF or interactive Save dialog is used.
  $appProcess = Start-Process -FilePath $installedExe -ArgumentList '--astra-desktop-smoke' -PassThru -Wait -NoNewWindow
  if ($appProcess.ExitCode -ne 0) { throw "Installed app smoke failed with exit code $($appProcess.ExitCode)" }
  Write-Host 'PASS ASTRA INSTALLED EXE: Electron renderer, local storage and native PDF file write verified'

  # Uninstall must not silently erase independent user data. The marker is
  # synthetic and confined to the CI runner's disposable userData folder.
  New-Item -ItemType Directory -Force -Path $appProfile | Out-Null
  Set-Content -LiteralPath $sentinel -Value $markerValue -Encoding UTF8 -NoNewline

  $uninstallProcess = Start-Process -FilePath $uninstallExe -ArgumentList '/S' -PassThru -Wait -NoNewWindow
  if ($uninstallProcess.ExitCode -ne 0) { throw "NSIS silent uninstall failed: $($uninstallProcess.ExitCode)" }
  Wait-Removed $installation
  $removed = $true

  foreach ($shortcut in $links) {
    if (Test-Path -LiteralPath $shortcut.FullName) {
      throw "Uninstall left ASTRA shortcut: $($shortcut.FullName)"
    }
  }
  if (-not (Test-Path -LiteralPath $sentinel -PathType Leaf)) {
    throw 'NSIS uninstall deleted application user data unexpectedly'
  }
  $readValue = Get-Content -LiteralPath $sentinel -Raw
  if ($readValue -cne $markerValue) {
    throw 'Application user data marker was modified during uninstall'
  }
  Write-Host 'PASS ASTRA NSIS UNINSTALL: app and both shortcuts removed; synthetic userData preserved'
}
finally {
  # Never recursively remove userData. Only delete this test's own marker.
  if (Test-Path -LiteralPath $sentinel) {
    Remove-Item -LiteralPath $sentinel -Force
  }
  # If a test failed after installation, attempt silent cleanup while still
  # on the disposable hosted runner, without masking the original error.
  if ($wasInstalled -and -not $removed -and (Test-Path -LiteralPath $installation)) {
    $uninstaller = @(Get-ChildItem -LiteralPath $installation -Filter 'Uninstall*.exe' -File -ErrorAction SilentlyContinue)
    if ($uninstaller.Count -eq 1) {
      try {
        $cleanup = Start-Process -FilePath $uninstaller[0].FullName -ArgumentList '/S' -Wait -PassThru -NoNewWindow
        Write-Host "NSIS cleanup exit code: $($cleanup.ExitCode)"
      } catch {
        Write-Warning 'NSIS test cleanup failed on ephemeral runner'
      }
    }
  }
}
