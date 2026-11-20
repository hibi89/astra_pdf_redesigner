# P119 5.4.0 candidate audit guard regressions; no installer is executed here.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($env:OS -ne 'Windows_NT') { throw 'P119_TESTS_WINDOWS_ONLY' }

$scriptPath = Join-Path $PSScriptRoot 'windows-tesseract-5.4-candidate-audit.ps1'
if (!(Test-Path -LiteralPath $scriptPath)) { throw 'P119_5_4_AUDIT_SCRIPT_MISSING' }
$source = Get-Content -LiteralPath $scriptPath -Raw
function Assert([bool]$ok, [string]$name) {
  if (!$ok) { throw "P119_5_4_GUARD_TEST_FAILED: $name" }
  Write-Host "PASS P119 5.4.0 guard: $name"
}
$hash = 'c885fff6998e0608ba4bb8ab51436e1c6775c2bafc2559a19b423e18678b60c9'
$manifestCommit = 'dd11564899b74d402e5fd39cb6f7b31945170286'
$hashIndex = $source.IndexOf($hash, [StringComparison]::OrdinalIgnoreCase)
$authIndex = $source.IndexOf('Get-AuthenticodeSignature', [StringComparison]::Ordinal)
$validGateIndex = $source.IndexOf('if ($signature.Status -ne ''Valid'')', [StringComparison]::Ordinal)
$installIndex = $source.IndexOf('Start-Process -FilePath $installerPath', [StringComparison]::Ordinal)
Assert ($source.Contains('UB-Mannheim/tesseract/releases/download/v5.4.0.20240606/')) 'official release URL pinned'
Assert ($hashIndex -ge 0 -and $source.Contains($manifestCommit)) 'SHA-256 and signed Microsoft manifest commit pinned'
Assert ($authIndex -ge 0 -and $validGateIndex -gt $authIndex -and $installIndex -gt $validGateIndex) 'Authenticode Valid gate precedes installation'
Assert ($source.Contains('WaitForExit(90000)')) 'installer wait is bounded to 90 seconds'
Assert ($source.Contains('product_ocr_manifest_enabled = $false') -and $source.Contains('product_bundle_modified = $false')) 'audit cannot enable product OCR or modify bundle'
Assert ($source.Contains('customer_files_used = $false') -and $source.Contains('external_inference_api_used = $false')) 'audit excludes customer files and external inference APIs'
Write-Host 'PASS P119 5.4.0 candidate audit guard regressions'
