# CI-only actual NSIS 0.1.0 (IDB v1) -> 0.1.1 (IDB v2) upgrade.
# Both installers are built on the same disposable Windows runner from distinct
# compiled app versions. Never touches an end-user profile or installation.
Set-StrictMode -Version Latest
$ErrorActionPreference='Stop'
if ($env:GITHUB_ACTIONS -ne 'true' -or [string]::IsNullOrWhiteSpace($env:RUNNER_TEMP)) {
  throw 'Upgrade acceptance is restricted to GitHub Actions Windows runner'
}
$original = Join-Path $env:RUNNER_TEMP 'astra-baseline-0.1.0.exe'
$upgrade = @(Get-ChildItem -LiteralPath 'release' -Filter 'ASTRA-PDF-Redesigner-Setup-0.1.1-x64.exe' -File)
if (-not (Test-Path -LiteralPath $original -PathType Leaf) -or $upgrade.Count -ne 1) {
  throw 'Expected exact original 0.1.0 and candidate 0.1.1 NSIS installers'
}
$installation=Join-Path $env:RUNNER_TEMP ("astra-version-upgrade-"+$PID)
$env:ASTRA_STEP2_PROFILE_DIR=Join-Path $env:RUNNER_TEMP ("astra-step2-profile-"+$PID)
$projectPdf=Join-Path $env:RUNNER_TEMP ("astra-step2-project-"+$PID+".pdf")
$env:ASTRA_STEP2_ACCEPTANCE_OUT=$projectPdf
$installed=$false
try {
  foreach($p in @($installation,$env:ASTRA_STEP2_PROFILE_DIR,$projectPdf)){
    if(Test-Path -LiteralPath $p){throw "Refusing existing CI upgrade test path: $p"}
  }
  if($installation -match '\s'){throw 'NSIS /D path must not contain whitespace'}
  $args=@('/S',"/D=$installation")
  $first=Start-Process -FilePath $original -ArgumentList $args -Wait -PassThru -NoNewWindow
  if($first.ExitCode -ne 0){throw "Baseline installer failed: $($first.ExitCode)"}
  $installed=$true
  $oldApp=Join-Path $installation 'ASTRA PDF Redesigner.exe'
  if(-not (Test-Path -LiteralPath $oldApp)){throw 'Baseline installed EXE missing'}
  $created=Start-Process -FilePath $oldApp -ArgumentList @('--astra-desktop-smoke','--astra-step2-acceptance') -Wait -PassThru -NoNewWindow
  if($created.ExitCode -ne 0){throw "Baseline STEP2 data generation failed: $($created.ExitCode)"}
  & node tests/verify-desktop-pdf.mjs $projectPdf --step2-project
  if($LASTEXITCODE -ne 0){throw "Baseline project PDF failed parsing: $LASTEXITCODE"}
  Write-Host 'PASS ASTRA UPGRADE BASELINE 0.1.0 IDB V1: installed EXE saved STEP2 document/PNG and generated parsed PDF'

  # Actually run a separate 0.1.1 NSIS executable over same install path.
  $second=Start-Process -FilePath $upgrade[0].FullName -ArgumentList $args -Wait -PassThru -NoNewWindow
  if($second.ExitCode -ne 0){throw "Candidate upgrade installer failed: $($second.ExitCode)"}
  $newApp=Join-Path $installation 'ASTRA PDF Redesigner.exe'
  if(-not (Test-Path -LiteralPath $newApp)){throw 'Upgraded installed EXE missing'}
  $verify=Start-Process -FilePath $newApp -ArgumentList @('--astra-desktop-smoke','--astra-step2-schema-upgrade-verify') -Wait -PassThru -NoNewWindow
  if($verify.ExitCode -ne 0){throw "Upgraded STEP2 document/PNG verification failed: $($verify.ExitCode)"}
  Write-Host 'PASS ASTRA NSIS SCHEMA UPGRADE 0.1.0 (IDB v1) -> 0.1.1 (IDB v2): existing STEP2 document and PNG readable after in-place installer upgrade'
  $uninstaller=Join-Path $installation 'Uninstall ASTRA PDF Redesigner.exe'
  if(-not (Test-Path -LiteralPath $uninstaller)){
    $options=@(Get-ChildItem -LiteralPath $installation -Filter 'Uninstall*.exe' -File)
    if($options.Count -ne 1){throw 'Expected one upgraded NSIS uninstaller'}
    $uninstaller=$options[0].FullName
  }
  $un=Start-Process -FilePath $uninstaller -ArgumentList '/S' -Wait -PassThru -NoNewWindow
  if($un.ExitCode -ne 0){throw "Upgraded uninstaller failed: $($un.ExitCode)"}
  for($i=0;$i -lt 60 -and (Test-Path -LiteralPath $installation);$i++){Start-Sleep -Milliseconds 500}
  if(Test-Path -LiteralPath $installation){throw 'Upgraded uninstall left installation behind'}
  $installed=$false
  Write-Host 'PASS ASTRA UPGRADE UNINSTALL: upgraded package removed'
} finally {
  Remove-Item Env:ASTRA_STEP2_ACCEPTANCE_OUT -ErrorAction SilentlyContinue
  Remove-Item Env:ASTRA_STEP2_PROFILE_DIR -ErrorAction SilentlyContinue
  if(Test-Path -LiteralPath $projectPdf){Remove-Item -LiteralPath $projectPdf -Force}
  if($installed -and (Test-Path -LiteralPath $installation)){
    $un=@(Get-ChildItem -LiteralPath $installation -Filter 'Uninstall*.exe' -File -ErrorAction SilentlyContinue)
    if($un.Count -eq 1){try{$null=Start-Process -FilePath $un[0].FullName -ArgumentList '/S' -Wait -PassThru -NoNewWindow}catch{Write-Warning 'CI upgrade cleanup failed'}}
  }
}
