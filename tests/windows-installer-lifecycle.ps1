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
$acceptancePdf = $null
$step2RecoveryReport = Join-Path $env:RUNNER_TEMP ("astra-step2-recovery-$PID.json")
$step2Stdout = Join-Path $env:RUNNER_TEMP ("astra-step2-stdout-$PID.log")
$step2Stderr = Join-Path $env:RUNNER_TEMP ("astra-step2-stderr-$PID.log")
$step3Pdf = $null
$eightFolder = $null
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
  $acceptancePdf = Join-Path $env:RUNNER_TEMP ("astra-pdf-acceptance-$PID.pdf")
  if (Test-Path -LiteralPath $acceptancePdf) { throw 'Refusing to overwrite an existing acceptance PDF' }
  $env:ASTRA_PDF_ACCEPTANCE_OUT = $acceptancePdf
  $appProcess = Start-Process -FilePath $installedExe -ArgumentList @('--astra-desktop-smoke', '--astra-pdf-acceptance') -PassThru -Wait -NoNewWindow
  if ($appProcess.ExitCode -ne 0) { throw "Installed app smoke failed with exit code $($appProcess.ExitCode)" }
  Write-Host 'PASS ASTRA INSTALLED EXE: Electron renderer, local storage and native PDF file write verified'
  & node tests/verify-desktop-pdf.mjs $acceptancePdf
  if ($LASTEXITCODE -ne 0) { throw "Installed PDF content verification failed: $LASTEXITCODE" }
  Write-Host 'PASS ASTRA WINDOWS PDF STRUCTURE: installed Electron PDF parsed and verified'

  # Second isolated installed-app run: actual STEP2 UI edits -> IndexedDB
  # commit -> reload -> PDF output. This does not inject preview HTML.
  $projectPdf = Join-Path $env:RUNNER_TEMP ("astra-step2-project-$PID.pdf")
  if (Test-Path -LiteralPath $projectPdf) { throw 'Refusing to overwrite STEP2 project PDF' }
  $env:ASTRA_STEP2_PROFILE_DIR = Join-Path $env:RUNNER_TEMP ("astra-step2-profile-$PID")
  if (Test-Path -LiteralPath $env:ASTRA_STEP2_PROFILE_DIR) { throw 'Refusing to reuse an existing STEP2 profile' }
  $env:ASTRA_STEP2_ACCEPTANCE_OUT = $projectPdf
  $env:ASTRA_STEP2_FAILURE_INJECTION = '1'
  $env:ASTRA_STEP2_RECOVERY_REPORT_OUT = $step2RecoveryReport
  foreach ($temporary in @($step2RecoveryReport,$step2Stdout,$step2Stderr)) {
    if (Test-Path -LiteralPath $temporary) { throw "Refusing to overwrite recovery evidence path: $temporary" }
  }
  try {
    $projectProcess = Start-Process -FilePath $installedExe -ArgumentList @('--astra-desktop-smoke','--astra-step2-acceptance') -PassThru -Wait -NoNewWindow -RedirectStandardOutput $step2Stdout -RedirectStandardError $step2Stderr
    if ($projectProcess.ExitCode -ne 0) {
      $failedOutput = (Get-Content -LiteralPath $step2Stdout -Raw -ErrorAction SilentlyContinue) + (Get-Content -LiteralPath $step2Stderr -Raw -ErrorAction SilentlyContinue)
      $failureLines = @($failedOutput -split '[\r\n]+' | Where-Object { $_ -match '(?i)(error|exception|step2|quota|abort|c007)' -and $_ -notmatch '^\s*at\s' } | Select-Object -Last 12)
      foreach ($failureLine in $failureLines) {
        $safeLine = $failureLine -replace 'ASTRA_STEP2_[A-Z0-9_]+|C007_[A-Z0-9_]+','[synthetic-marker]'
        Write-Host "Sanitized STEP2 diagnostic: $safeLine"
      }
      throw "Installed STEP2 project acceptance failed: $($projectProcess.ExitCode)"
    }
    & node tests/verify-desktop-pdf.mjs $projectPdf --step2-project
    if ($LASTEXITCODE -ne 0) { throw "Installed STEP2 project PDF verification failed: $LASTEXITCODE" }
    Write-Host 'PASS ASTRA INSTALLED STEP2 PROJECT PDF: actual editor, IDB, reload, A4 text/image PDF'
    if (-not (Test-Path -LiteralPath $step2RecoveryReport -PathType Leaf)) { throw 'Sanitized STEP2 recovery report missing' }
    $recovery = Get-Content -LiteralPath $step2RecoveryReport -Raw | ConvertFrom-Json
    if ($recovery.schema -ne 'astra-c007-step2-recovery-v1' -or $recovery.status -ne 'PASS' -or
        $recovery.github_sha -ne $env:GITHUB_SHA -or -not $recovery.quota_failure_visible -or
        -not $recovery.quota_failure_preserved_storage -or -not $recovery.retry_persisted -or
        -not $recovery.png_bytes_preserved -or -not $recovery.multi_store_abort_atomic -or
        -not $recovery.renderer_reload_preserved -or
        -not $recovery.stdout_stderr_leak_check -or
        -not $recovery.installed_process_restart_verified -or
        $recovery.after_quota_snapshot_sha256 -ne $recovery.baseline_snapshot_sha256 -or
        $recovery.abort_before_snapshot_sha256 -ne $recovery.abort_after_snapshot_sha256) {
      throw 'Installed STEP2 quota, retry, atomic-abort, reload, SHA or report acceptance failed'
    }
    $capturedLog = (Get-Content -LiteralPath $step2Stdout -Raw) + (Get-Content -LiteralPath $step2Stderr -Raw)
    if ($capturedLog -match 'ASTRA_STEP2_BODY_8308|ASTRA_STEP2_PRINT_8307|ASTRA_STEP2_CAPTION_8309|C007_QUOTA|C007_ABORT_UNCOMMITTED') {
      throw 'Installed STEP2 logs exposed synthetic document or recovery marker text'
    }
    $recovery.stdout_stderr_leak_check = $true
    Set-Content -LiteralPath $step2RecoveryReport -Value ($recovery | ConvertTo-Json -Depth 12) -Encoding utf8
    Remove-Item -LiteralPath $step2Stdout,$step2Stderr -Force
    Write-Host "PASS ASTRA STEP2 QUOTA/ABORT RECOVERY: exact SHA $($recovery.github_sha); sanitized storage digests; no text in logs"
    Remove-Item Env:ASTRA_STEP2_FAILURE_INJECTION -ErrorAction SilentlyContinue
    Remove-Item Env:ASTRA_STEP2_RECOVERY_REPORT_OUT -ErrorAction SilentlyContinue
    $preserve = Start-Process -FilePath $installedExe -ArgumentList @('--astra-desktop-smoke','--astra-step2-preservation-verify') -PassThru -Wait -NoNewWindow
    if ($preserve.ExitCode -ne 0) { throw "STEP2 persisted project failed separate installed EXE restart: $($preserve.ExitCode)" }
    $recovery.installed_process_restart_verified = $true
    Set-Content -LiteralPath $step2RecoveryReport -Value ($recovery | ConvertTo-Json -Depth 12) -Encoding utf8
    Write-Host 'PASS ASTRA STEP2 SECOND EXE LAUNCH: recovered document and PNG intact'
  } finally {
    Remove-Item Env:ASTRA_STEP2_FAILURE_INJECTION -ErrorAction SilentlyContinue
    Remove-Item Env:ASTRA_STEP2_RECOVERY_REPORT_OUT -ErrorAction SilentlyContinue
    Remove-Item Env:ASTRA_STEP2_ACCEPTANCE_OUT -ErrorAction SilentlyContinue
    Remove-Item Env:ASTRA_STEP2_PROFILE_DIR -ErrorAction SilentlyContinue
    foreach ($temporary in @($step2Stdout,$step2Stderr)) {
      if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary -Force }
    }
    if (Test-Path -LiteralPath $projectPdf) { Remove-Item -LiteralPath $projectPdf -Force }
  }

  # Third isolated installed EXE run: PDF.js import -> approval -> persisted
  # redesigned document -> native save -> actual exported PDF parsing.
  $step3Pdf = Join-Path $env:RUNNER_TEMP ("astra-step3-import-$PID.pdf")
  if (Test-Path -LiteralPath $step3Pdf) { throw 'Refusing to overwrite STEP3 output' }
  $env:ASTRA_STEP3_ACCEPTANCE_OUT = $step3Pdf
  $eightFolder = Join-Path $env:RUNNER_TEMP ("astra-step3-layouts-$PID")
  if (Test-Path -LiteralPath $eightFolder) { throw 'Refusing to overwrite existing M08-A PDF folder' }
  $env:ASTRA_STEP3_EIGHT_DIR = $eightFolder
  try {
    $step3 = Start-Process -FilePath $installedExe -ArgumentList @('--astra-desktop-smoke','--astra-step3-acceptance','--astra-step3-eight-layouts') -PassThru -Wait -NoNewWindow
    if ($step3.ExitCode -ne 0) { throw "Installed STEP3 import/export failed with exit code $($step3.ExitCode)" }
    & node tests/verify-desktop-pdf.mjs $step3Pdf --step3-import
    if ($LASTEXITCODE -ne 0) { throw "Installed STEP3 PDF content failed verification: $LASTEXITCODE" }
    & node tests/verify-eight-desktop-layouts.mjs $eightFolder
    if ($LASTEXITCODE -ne 0) { throw "Installed eight-template actual PDF audit failed: $LASTEXITCODE" }
    Write-Host 'PASS M08-A NSIS INSTALLED 8/8 A4 PDF AUDIT'
    Write-Host 'PASS ASTRA INSTALLED STEP3: PDF.js import, source review, persisted design and native A4 PDF output'
  } finally {
    Remove-Item Env:ASTRA_STEP3_ACCEPTANCE_OUT -ErrorAction SilentlyContinue
    Remove-Item Env:ASTRA_STEP2_FAILURE_INJECTION -ErrorAction SilentlyContinue
  Remove-Item Env:ASTRA_STEP2_RECOVERY_REPORT_OUT -ErrorAction SilentlyContinue
  Remove-Item Env:ASTRA_STEP3_EIGHT_DIR -ErrorAction SilentlyContinue
    if ($eightFolder -and (Test-Path -LiteralPath $eightFolder)) {
      Remove-Item -LiteralPath $eightFolder -Recurse -Force
    }
    if (Test-Path -LiteralPath $step3Pdf) { Remove-Item -LiteralPath $step3Pdf -Force }
  }

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
  Remove-Item Env:ASTRA_STEP3_EIGHT_DIR -ErrorAction SilentlyContinue
  if ($eightFolder -and (Test-Path -LiteralPath $eightFolder)) {
    Remove-Item -LiteralPath $eightFolder -Recurse -Force
  }
  if ($step3Pdf -and (Test-Path -LiteralPath $step3Pdf)) {
    Remove-Item -LiteralPath $step3Pdf -Force
  }
  Remove-Item Env:ASTRA_STEP3_ACCEPTANCE_OUT -ErrorAction SilentlyContinue
  if ($acceptancePdf -and (Test-Path -LiteralPath $acceptancePdf)) {
    Remove-Item -LiteralPath $acceptancePdf -Force
  }
  Remove-Item Env:ASTRA_PDF_ACCEPTANCE_OUT -ErrorAction SilentlyContinue
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
