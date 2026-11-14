# P106 Windows-only synthetic signature evidence tests; no real supplier OCR files.
Set-StrictMode -Version Latest
$ErrorActionPreference='Stop'
if ($env:OS -ne 'Windows_NT') { throw 'P106_TESTS_WINDOWS_ONLY' }
$runner=Join-Path (Split-Path -Parent $PSScriptRoot) 'scripts/ocr-windows-authenticode-evidence.ps1'
if (!(Test-Path -LiteralPath $runner)) { throw 'P106_RUNNER_MISSING' }
$temp=Join-Path ([IO.Path]::GetTempPath()) ("astra-p106-"+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $temp | Out-Null
function Assert([bool]$Ok,[string]$Test) { if (!$Ok) { throw "P106_TEST_FAILED: $Test" }; Write-Host "PASS P106: $Test" }
function Refuses([scriptblock]$Action,[string]$Test) {
  $rejected=$false
  try { & $Action | Out-Null } catch { $rejected=$true }
  Assert $rejected $Test
}
try {
  $root=Join-Path $temp 'assets'
  foreach ($d in @('bin','tessdata','licenses')) { New-Item -ItemType Directory -Path (Join-Path $root $d) -Force | Out-Null }
  $installer=Join-Path $temp 'synthetic-unsigned-installer.exe'
  $manifestPath=Join-Path $temp 'synthetic-manifest.json'
  [IO.File]::WriteAllBytes($installer,([Text.Encoding]::ASCII.GetBytes('MZ-SYNTHETIC-UNSIGNED-INSTALLER-TEST-ONLY')))
  foreach ($p in @('bin/tesseract.exe','bin/liblept.dll','tessdata/kor.traineddata','tessdata/eng.traineddata','licenses/TESSERACT-LICENSE.txt','licenses/LEPTONICA-LICENSE.txt','licenses/THIRD-PARTY-NOTICES.txt')) {
    $f=Join-Path $root ($p -replace '/','\')
    [IO.File]::WriteAllBytes($f,([Text.Encoding]::ASCII.GetBytes("MZ-SYNTHETIC-P106-TEST-ONLY-$p")))
  }
  $records=@()
  foreach ($p in @('bin/tesseract.exe','bin/liblept.dll','tessdata/kor.traineddata','tessdata/eng.traineddata','licenses/TESSERACT-LICENSE.txt','licenses/LEPTONICA-LICENSE.txt','licenses/THIRD-PARTY-NOTICES.txt')) {
    $f=Join-Path $root ($p -replace '/','\')
    $kind=if ($p -eq 'bin/tesseract.exe') {'engine'} elseif ($p -like 'bin/*') {'dependency'} elseif ($p -like 'tessdata/*') {'language'} else {'license'}
    $records+=@{path=$p;kind=$kind;bytes=(Get-Item -LiteralPath $f).Length;sha256=(Get-FileHash -LiteralPath $f -Algorithm SHA256).Hash.ToLowerInvariant()}
  }
  $manifest=@{
    schemaVersion=1;platform='windows-x64';purpose='astra-offline-ocr-asset-audit'
    origin=@{installerSha256=(Get-FileHash -LiteralPath $installer -Algorithm SHA256).Hash.ToLowerInvariant()}
    files=$records
  }
  function Save-Manifest { $manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $manifestPath -Encoding UTF8 }
  Save-Manifest
  $report=(& $runner -InstallerPath $installer -AssetsRoot $root -ManifestPath $manifestPath | ConvertFrom-Json)
  Assert ($report.status -eq 'review-required') 'signed/unsigned scan never grants release'
  Assert ($report.count -eq 2) 'complete native PE evidence inventory'
  Assert ($report.signaturesNotValidCount -ge 1) 'synthetic unsigned file status is not Valid'
  Assert (!$report.installerSignatureApproved -and !$report.productOcrEnabled -and !$report.legalRedistributionApproved) 'human approval is always false'
  Assert ($report.hashesBeforeAfterMatched) 'file hashes checked around Authenticode operation'
  Assert ($report.nativePeFiles[0].asset -eq 'bin/tesseract.exe') 'relative asset ID only'
  $reportJson=$report | ConvertTo-Json -Depth 6
  Assert (!$reportJson.Contains($temp)) 'report omits absolute local paths'
  $dll=Join-Path $root 'bin/liblept.dll'
  [IO.File]::AppendAllText($dll,'EVIL')
  Refuses { & $runner -InstallerPath $installer -AssetsRoot $root -ManifestPath $manifestPath } 'tampered binary SHA fails closed'
  [IO.File]::WriteAllBytes($dll,([Text.Encoding]::ASCII.GetBytes('MZ-SYNTHETIC-P106-TEST-ONLY-bin/liblept.dll')))
  $manifest.origin.installerSha256=('a'*64)
  Save-Manifest
  Refuses { & $runner -InstallerPath $installer -AssetsRoot $root -ManifestPath $manifestPath } 'installer SHA mismatch denied'
  $manifest.origin.installerSha256=(Get-FileHash -LiteralPath $installer -Algorithm SHA256).Hash.ToLowerInvariant()
  $manifest.files[0].path='../escape.exe'
  Save-Manifest
  Refuses { & $runner -InstallerPath $installer -AssetsRoot $root -ManifestPath $manifestPath } 'manifest path traversal denied'
  $manifest.files[0].path='bin/tesseract.exe'
  Save-Manifest
  [IO.File]::WriteAllBytes((Join-Path $root 'bin/unlisted.dll'),([Text.Encoding]::ASCII.GetBytes('MZ-EXTRA-PE-TEST')))
  Refuses { & $runner -InstallerPath $installer -AssetsRoot $root -ManifestPath $manifestPath } 'unlisted native DLL denied'
  Write-Host 'PASS P106 WINDOWS AUTHENTICODE EVIDENCE: synthetic regression complete'
} finally {
  Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue
}
