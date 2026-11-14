# P106: local-only Windows signature evidence. No files are executed, installed or uploaded.
# This report never grants redistribution, supplier trust or product activation.
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$InstallerPath,
  [Parameter(Mandatory=$true)][string]$AssetsRoot,
  [Parameter(Mandatory=$true)][string]$ManifestPath
)
Set-StrictMode -Version Latest
$ErrorActionPreference='Stop'
if ($env:OS -ne 'Windows_NT') { throw 'P106_WINDOWS_ONLY' }
function Require-File([string]$Literal) {
  $item=Get-Item -LiteralPath $Literal -ErrorAction Stop
  if ($item.PSIsContainer -or (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0)) {
    throw 'P106_UNSAFE_FILE'
  }
  return $item
}
function Require-Directory([string]$Literal) {
  $item=Get-Item -LiteralPath $Literal -ErrorAction Stop
  if (!$item.PSIsContainer -or (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0)) {
    throw 'P106_UNSAFE_DIRECTORY'
  }
  return $item
}
function Pinned-Signature([string]$Literal,[string]$ExpectedSha,[long]$ExpectedLength,[string]$Label) {
  if ($ExpectedSha -cnotmatch '^[0-9a-f]{64}$') { throw 'P106_INVALID_SHA_PIN' }
  $before=Require-File $Literal
  if ($ExpectedLength -ge 0 -and $before.Length -ne $ExpectedLength) { throw 'P106_SIZE_MISMATCH' }
  $first=(Get-FileHash -LiteralPath $Literal -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($first -cne $ExpectedSha) { throw 'P106_SHA_MISMATCH' }
  # Get-AuthenticodeSignature inspects the file but does not run the target executable.
  $signature=Get-AuthenticodeSignature -LiteralPath $Literal -ErrorAction Stop
  $second=(Get-FileHash -LiteralPath $Literal -Algorithm SHA256).Hash.ToLowerInvariant()
  $after=Require-File $Literal
  if ($first -cne $second -or $after.Length -ne $before.Length) { throw 'P106_CHANGED_DURING_SIGNATURE_CHECK' }
  $thumbprint=$null
  $subject=$null
  if ($null -ne $signature.SignerCertificate) {
    $thumbprint=[string]$signature.SignerCertificate.Thumbprint
    $subject=[string]$signature.SignerCertificate.Subject
  }
  [pscustomobject]@{
    asset=$Label
    sizeBytes=[long]$after.Length
    sha256=$second
    signatureStatus=[string]$signature.Status
    signerThumbprint=$thumbprint
    signerSubject=$subject
    publisherTrustApproved=$false
  }
}
$installer=Require-File $InstallerPath
$root=Require-Directory $AssetsRoot
$manifestFile=Require-File $ManifestPath
if ($manifestFile.Length -lt 16 -or $manifestFile.Length -gt 262144) { throw 'P106_MANIFEST_SIZE' }
$rootFull=[IO.Path]::GetFullPath($root.FullName)
$manifestFull=[IO.Path]::GetFullPath($manifestFile.FullName)
$installerFull=[IO.Path]::GetFullPath($installer.FullName)
if ($manifestFull.StartsWith($rootFull.TrimEnd('\')+'\',[StringComparison]::OrdinalIgnoreCase) -or
    $installerFull.StartsWith($rootFull.TrimEnd('\')+'\',[StringComparison]::OrdinalIgnoreCase)) {
  throw 'P106_MANIFEST_OR_INSTALLER_INSIDE_ASSETS'
}
if ($installer.Extension -notin @('.exe','.msi')) { throw 'P106_INSTALLER_EXTENSION' }
$manifest=Get-Content -LiteralPath $manifestFull -Raw -Encoding UTF8 | ConvertFrom-Json
if ($null -eq $manifest -or $manifest.schemaVersion -ne 1 -or
    $manifest.purpose -ne 'astra-offline-ocr-asset-audit' -or
    $manifest.platform -ne 'windows-x64' -or $null -eq $manifest.origin) {
  throw 'P106_MANIFEST_SCHEMA'
}
$sourceInstallerHash=[string]$manifest.origin.installerSha256
if ($sourceInstallerHash -cnotmatch '^[0-9a-f]{64}$') { throw 'P106_INVALID_INSTALLER_PIN' }
$rows=@($manifest.files)
$names=New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$native=@()
foreach ($entry in $rows) {
  $rel=[string]$entry.path
  if (!$names.Add($rel)) { throw 'P106_DUPLICATE_MANIFEST_PATH' }
  if ($rel -eq 'bin/tesseract.exe' -and $entry.kind -eq 'engine') {
    $native+=,$entry
  } elseif ($rel -cmatch '^bin/[A-Za-z0-9_.-]{1,90}\.dll$' -and $entry.kind -eq 'dependency') {
    $native+=,$entry
  } elseif ($rel -cmatch '^(?:tessdata/(?:kor|eng)\.traineddata|licenses/[A-Za-z0-9_.-]+\.txt)$') {
    continue
  } else { throw 'P106_UNSAFE_MANIFEST_ENTRY' }
}
if (!$names.Contains('bin/tesseract.exe') -or !$names.Contains('tessdata/kor.traineddata') -or
    !$names.Contains('tessdata/eng.traineddata') -or $native.Count -lt 2) {
  throw 'P106_REQUIRED_ASSETS_MISSING'
}
$binDir=Require-Directory (Join-Path $rootFull 'bin')
$actualNative=@(Get-ChildItem -LiteralPath $binDir.FullName -Force | Where-Object {
  !$_.PSIsContainer -and $_.Extension -in @('.exe','.dll')
})
if ($actualNative.Count -ne $native.Count) { throw 'P106_NATIVE_INVENTORY_MISMATCH' }
foreach ($entry in $native) {
  $rel=[string]$entry.path
  $target=Join-Path $binDir.FullName ($rel.Substring(4))
  $f=Require-File $target
  if ($f.Name -cne $rel.Substring(4)) { throw 'P106_CASE_MISMATCH' }
}
$installerRecord=Pinned-Signature $installerFull $sourceInstallerHash -1 'installer'
$reports=@()
foreach ($entry in $native) {
  $rel=[string]$entry.path
  if ($null -eq $entry.bytes -or [long]$entry.bytes -lt 4) { throw 'P106_INVALID_DECLARED_SIZE' }
  $target=Join-Path $binDir.FullName ($rel.Substring(4))
  $reports+=,(Pinned-Signature $target ([string]$entry.sha256) ([long]$entry.bytes) $rel)
}
$notValid=@($reports | Where-Object { $_.signatureStatus -ne 'Valid' }).Count
if ($installerRecord.signatureStatus -ne 'Valid') { $notValid++ }
$result=[ordered]@{
  status='review-required'
  platform='windows-x64'
  evidenceTool='Get-AuthenticodeSignature'
  installer=$installerRecord
  nativePeFiles=$reports
  count=$reports.Count
  signaturesNotValidCount=$notValid
  hashesBeforeAfterMatched=$true
  manifestInventoryIndependentlyVerified=$false
  sourcePublisherAuthenticated=$false
  installerSignatureApproved=$false
  runtimeDllClosureVerified=$false
  legalRedistributionApproved=$false
  productOcrEnabled=$false
}
$result | ConvertTo-Json -Depth 6 -Compress
