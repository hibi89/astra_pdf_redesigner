# Exploratory audit of an alternate official Tesseract Windows installer.
# Runs only on a disposable GitHub-hosted runner. It never changes the ASTRA app bundle.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($env:OS -ne 'Windows_NT') { throw 'P119_WINDOWS_ONLY' }

$reportPath = Join-Path $env:RUNNER_TEMP 'astra-p119-tesseract-5.5.0-audit.json'
$installerPath = Join-Path $env:RUNNER_TEMP 'tesseract-5.5.0-setup-exploratory.exe'
$installRoot = Join-Path $env:RUNNER_TEMP 'astra-p119-tesseract-5.5.0-exploratory'
$releaseUrl = 'https://github.com/tesseract-ocr/tesseract/releases/download/5.5.0/tesseract-ocr-w64-setup-5.5.0.20241111.exe'
$state = [ordered]@{
  schema = 'astra-p119-windows-alternate-candidate-v1'
  status = 'RUNNING'
  isolated_github_hosted_runner = $true
  product_bundle_modified = $false
  product_ocr_manifest_enabled = $false
  customer_files_used = $false
  external_inference_api_used = $false
  release_url = $releaseUrl
  github_release_digest = $null
  installer_sha256_actual = $null
  installer_signature = $null
  version_output = $null
  observed_pe_file_count = 0
  license_files = @()
  import_closure = $null
  error = $null
}
function Save-Report { $state | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $reportPath -Encoding UTF8 }
try {
  Save-Report
  Invoke-WebRequest -Uri $releaseUrl -OutFile $installerPath -MaximumRedirection 5
  $state.installer_sha256_actual = (Get-FileHash -LiteralPath $installerPath -Algorithm SHA256).Hash.ToLowerInvariant()
  $signature = Get-AuthenticodeSignature -LiteralPath $installerPath
  $state.installer_signature = [ordered]@{
    status = [string]$signature.Status
    status_message = [string]$signature.StatusMessage
    signer_subject = if ($signature.SignerCertificate) { [string]$signature.SignerCertificate.Subject } else { $null }
    signer_thumbprint = if ($signature.SignerCertificate) { [string]$signature.SignerCertificate.Thumbprint } else { $null }
    timestamp_subject = if ($signature.TimeStamperCertificate) { [string]$signature.TimeStamperCertificate.Subject } else { $null }
  }
  if (Test-Path -LiteralPath $installRoot) { throw 'REFUSE_TO_OVERWRITE_TEMP_INSTALL_ROOT' }
  $proc = Start-Process -FilePath $installerPath -ArgumentList @('/S', "/D=$installRoot") -Wait -PassThru
  if ($proc.ExitCode -ne 0) { throw "TESSERACT_INSTALLER_EXIT_$($proc.ExitCode)" }
  $engines = @(Get-ChildItem -LiteralPath $installRoot -Filter 'tesseract.exe' -File -Recurse)
  if ($engines.Count -ne 1) { throw "EXPECTED_ONE_TESSERACT_ENGINE_FOUND_$($engines.Count)" }
  $engineRoot = $engines[0].DirectoryName
  $version = @(& $engines[0].FullName --version 2>&1)
  if ($LASTEXITCODE -ne 0) { throw 'TESSERACT_VERSION_FAILED' }
  $state.version_output = @($version | Select-Object -First 3 | ForEach-Object { [string]$_ })
  $state.observed_pe_file_count = @(Get-ChildItem -LiteralPath $installRoot -File -Recurse | Where-Object { $_.Extension -in @('.exe','.dll') }).Count
  $state.license_files = @(Get-ChildItem -LiteralPath $installRoot -File -Recurse | Where-Object { $_.Name -match '(?i)(license|licence|notice|copyright|authors)' } | ForEach-Object { [IO.Path]::GetRelativePath($installRoot, $_.FullName) })
  $auditScript = Join-Path $PSScriptRoot '..\scripts\audit-tesseract-installed-pe.cjs'
  $auditOutput = @(& node $auditScript $engineRoot 2>&1)
  $auditExit = $LASTEXITCODE
  $auditText = ($auditOutput | ForEach-Object { [string]$_ }) -join [Environment]::NewLine
  if ($auditExit -eq 0) {
    $state.import_closure = $auditText | ConvertFrom-Json -AsHashtable
  } else {
    $state.import_closure = [ordered]@{ status = 'not-proven'; error = $auditText }
  }
  $state.status = 'AUDIT_COMPLETE_REVIEW_REQUIRED'
} catch {
  $state.status = 'AUDIT_FAILED_REVIEW_REQUIRED'
  $state.error = $_.Exception.Message
} finally {
  Save-Report
  if (Test-Path -LiteralPath $installerPath) { Remove-Item -LiteralPath $installerPath -Force }
  if (Test-Path -LiteralPath $installRoot) { Remove-Item -LiteralPath $installRoot -Recurse -Force }
}
Write-Host "P119 ALTERNATE CANDIDATE REPORT: $reportPath"
$state | ConvertTo-Json -Depth 12
