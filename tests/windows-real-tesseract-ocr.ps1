# P119/P120 exploratory Windows-only supplier and real OCR evidence.
# Runs only on a disposable GitHub-hosted runner. Never modifies the app bundle.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($env:OS -ne 'Windows_NT') { throw 'P119_P120_WINDOWS_ONLY' }

$reportPath = Join-Path $env:RUNNER_TEMP 'astra-p119-p120-report.json'
$installerPath = Join-Path $env:RUNNER_TEMP 'tesseract-5.5.3-setup.exe'
$installRoot = Join-Path $env:RUNNER_TEMP 'astra-p119-tesseract'
$dataRoot = Join-Path $installRoot 'tessdata'
$casesRoot = Join-Path $env:RUNNER_TEMP 'astra-p120-synthetic-cases'
$releaseUrl = 'https://github.com/tesseract-ocr/tesseract/releases/download/5.5.3/tesseract-ocr-w64-setup-5.5.3.20260724.exe'
$expectedInstallerSha256 = 'bee9e3434bd94fd65387d9be28cd467a41f61b1275383b55b0f59a1331270ae4'
$dataCommit = 'e12c65a915945e4c28e237a9b52bc4a8f39a0cec'
$state = [ordered]@{
  schema = 'astra-p119-p120-windows-exploration-v1'
  status = 'RUNNING'
  isolated_github_hosted_runner = $true
  product_bundle_modified = $false
  product_ocr_manifest_enabled = $false
  customer_files_used = $false
  external_inference_api_used = $false
  release_url = $releaseUrl
  release_sha256_expected = $expectedInstallerSha256
  data_repository = 'https://github.com/tesseract-ocr/tessdata_best'
  data_commit = $dataCommit
  installer_signature = $null
  installer_sha256_actual = $null
  language_assets = @()
  runtime_files = @()
  language_list = @()
  version_output = $null
  ocr_results = @()
  import_closure = $null
  license_file_names = @()
  error = $null
}
function Save-Report {
  $state | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $reportPath -Encoding UTF8
}
function Normalize-OcrText([string]$Text) {
  return ([string]$Text -replace '\s+','').Normalize([Text.NormalizationForm]::FormC)
}
function Get-EditDistance([string]$Left,[string]$Right) {
  $previous = [int[]]::new($Right.Length + 1)
  for ($j = 0; $j -le $Right.Length; $j++) { $previous[$j] = $j }
  for ($i = 1; $i -le $Left.Length; $i++) {
    $current = [int[]]::new($Right.Length + 1)
    $current[0] = $i
    for ($j = 1; $j -le $Right.Length; $j++) {
      $cost = if ($Left[$i - 1] -ceq $Right[$j - 1]) { 0 } else { 1 }
      $current[$j] = [Math]::Min([Math]::Min($current[$j - 1] + 1, $previous[$j] + 1), $previous[$j - 1] + $cost)
    }
    $previous = $current
  }
  return $previous[$Right.Length]
}
function Get-CriticalNumbers([string]$Text) {
  return @([regex]::Matches($Text,'(?<![A-Za-z0-9])[-+]?\d[\d,]*(?:\.\d+)?%?(?![A-Za-z0-9])') | ForEach-Object { $_.Value })
}
try {
  Save-Report
  Invoke-WebRequest -Uri $releaseUrl -OutFile $installerPath -MaximumRedirection 5
  $hash = (Get-FileHash -LiteralPath $installerPath -Algorithm SHA256).Hash.ToLowerInvariant()
  $state.installer_sha256_actual = $hash
  if ($hash -ne $expectedInstallerSha256) { throw 'PINNED_TESSERACT_INSTALLER_SHA256_MISMATCH' }

  $sig = Get-AuthenticodeSignature -LiteralPath $installerPath
  $state.installer_signature = [ordered]@{
    status = [string]$sig.Status
    status_message = [string]$sig.StatusMessage
    signer_subject = if ($sig.SignerCertificate) { [string]$sig.SignerCertificate.Subject } else { $null }
    signer_thumbprint = if ($sig.SignerCertificate) { [string]$sig.SignerCertificate.Thumbprint } else { $null }
    timestamp_subject = if ($sig.TimeStamperCertificate) { [string]$sig.TimeStamperCertificate.Subject } else { $null }
  }
  Save-Report

  if (Test-Path -LiteralPath $installRoot) { throw 'REFUSE_TO_OVERWRITE_TEMP_INSTALL_ROOT' }
  $proc = Start-Process -FilePath $installerPath -ArgumentList @('/S', "/D=$installRoot") -Wait -PassThru
  if ($proc.ExitCode -ne 0) { throw "TESSERACT_INSTALLER_EXIT_$($proc.ExitCode)" }
  $engines = @(Get-ChildItem -LiteralPath $installRoot -Filter 'tesseract.exe' -File -Recurse)
  if ($engines.Count -ne 1) { throw "EXPECTED_ONE_TESSERACT_ENGINE_FOUND_$($engines.Count)" }
  $engine = $engines[0].FullName
  $installRoot = $engines[0].DirectoryName
  $dataRoot = Join-Path $installRoot 'tessdata'
  New-Item -ItemType Directory -Path $dataRoot -Force | Out-Null

  foreach ($lang in @('eng','kor')) {
    $url = "https://raw.githubusercontent.com/tesseract-ocr/tessdata_best/$dataCommit/$lang.traineddata"
    $dest = Join-Path $dataRoot "$lang.traineddata"
    Invoke-WebRequest -Uri $url -OutFile $dest -MaximumRedirection 5
    $state.language_assets += [ordered]@{
      name = "$lang.traineddata"
      url = $url
      bytes = (Get-Item -LiteralPath $dest).Length
      sha256 = (Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash.ToLowerInvariant()
      git_blob_sha1 = if ($lang -eq 'eng') { '176dc3220de7db34d3b3aecbfa42043a6038348b' } else { 'c82615b5228c9981c33a0985b32224d97b7fb43a' }
    }
  }
  $langs = & $engine --tessdata-dir $dataRoot --list-langs 2>&1
  if ($LASTEXITCODE -ne 0) { throw 'TESSERACT_LIST_LANGS_FAILED' }
  $state.language_list = @($langs | ForEach-Object { [string]$_ })
  if (($state.language_list -join ([Environment]::NewLine)) -notmatch 'eng' -or ($state.language_list -join ([Environment]::NewLine)) -notmatch 'kor') { throw 'PINNED_KOR_ENG_DATA_NOT_LOADED' }
  $version = & $engine --version 2>&1
  if ($LASTEXITCODE -ne 0 -or ($version -join ([Environment]::NewLine)) -notmatch '5\.5\.3') { throw 'UNEXPECTED_TESSERACT_VERSION' }
  $state.version_output = @($version | Select-Object -First 3 | ForEach-Object { [string]$_ })

  $fontPath = Join-Path $env:WINDIR 'Fonts\malgun.ttf'
  if (!(Test-Path -LiteralPath $fontPath)) { throw 'WINDOWS_KOREAN_FONT_MALGUN_NOT_FOUND' }
  Add-Type -AssemblyName System.Drawing
  $sourceTexts = @(
    '안녕하세요 한국어 문서 2026',
    '보고서 제목 4500원 금액',
    '원본 PDF 숫자 12345 검수',
    '승인하지 않습니다. 결제 불가',
    '주문번호 AB-0091 합계 80,000원',
    '표 행 01 금액 123,456원',
    '매출액 12.5% 증가했습니다.',
    '갑과 을은 계약을 취소합니다.',
    'PDF 원문은 수정하지 않습니다.',
    '회계 장부 부채 2,300,000원',
    '수익률 -3.2% 손실 금액 -50원',
    '증빙 자료는 외부 전송 금지'
  )
  if (Test-Path -LiteralPath $casesRoot) { throw 'REFUSE_TO_OVERWRITE_SYNTHETIC_CASES' }
  New-Item -ItemType Directory -Path $casesRoot | Out-Null
  $fontFamily = [System.Drawing.FontFamily]::new('Malgun Gothic')
  $results = @()
  for ($i = 0; $i -lt $sourceTexts.Count; $i++) {
    $difficult = ($i -ge 8)
    $size = if ($difficult) { 18 } elseif ($i -ge 4) { 30 } else { 44 }
    $width = if ($difficult) { 900 } else { 1500 }
    $height = if ($difficult) { 100 } else { 170 }
    $bitmap = [System.Drawing.Bitmap]::new($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $gray = if ($i -eq 11) { 110 } else { 15 }
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb([int]$gray, 15, 15))
    $font = [System.Drawing.Font]::new($fontFamily, [single]$size, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.DrawString($sourceTexts[$i], $font, $brush, [single]18, [single]22)
    $graphics.Dispose(); $brush.Dispose(); $font.Dispose()
    $filename = Join-Path $casesRoot ("case-{0:D2}.png" -f ($i + 1))
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    $fixtureHash = (Get-FileHash -LiteralPath $filename -Algorithm SHA256).Hash.ToLowerInvariant()
    $raw = & $engine $filename stdout -l kor+eng --psm 6 --tessdata-dir $dataRoot 2>&1
    $exit = $LASTEXITCODE
    $recognized = (($raw | ForEach-Object { [string]$_ }) -join ([Environment]::NewLine)).Trim()
    $expectedNormalized = Normalize-OcrText $sourceTexts[$i]
    $recognizedNormalized = Normalize-OcrText $recognized
    $editDistance = Get-EditDistance $expectedNormalized $recognizedNormalized
    $cer = if ($expectedNormalized.Length -eq 0) { 1.0 } else { [Math]::Round($editDistance / $expectedNormalized.Length, 4) }
    $expectedNumbers = @(Get-CriticalNumbers $sourceTexts[$i])
    $recognizedNumbers = @(Get-CriticalNumbers $recognized)
    $results += [ordered]@{
      case = $i + 1; expected = $sourceTexts[$i]; recognized = $recognized
      exact = ($expectedNormalized -ceq $recognizedNormalized)
      character_error_rate = $cer
      critical_numbers_expected = $expectedNumbers
      critical_numbers_recognized = $recognizedNumbers
      critical_numbers_match = (($expectedNumbers -join '|') -ceq ($recognizedNumbers -join '|'))
      engine_exit = $exit; fixture_sha256 = $fixtureHash
      difficulty = if ($difficult) { 'small_low_contrast' } elseif ($i -ge 4) { 'medium' } else { 'easy' }
    }
    if ($exit -ne 0) { throw "TESSERACT_OCR_EXIT_CASE_$($i + 1)_$exit" }
  }
  $state.ocr_results = $results
  $state.license_file_names = @(Get-ChildItem -LiteralPath $installRoot -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'LICENSE|NOTICE|COPYING|AUTHORS' } | ForEach-Object { $_.FullName.Substring($installRoot.Length + 1).Replace('\','/') })
  $state.runtime_files = @(Get-ChildItem -LiteralPath $installRoot -File | Where-Object { $_.Extension -in @('.exe','.dll') } | ForEach-Object {
    $s = Get-AuthenticodeSignature -LiteralPath $_.FullName
    [ordered]@{ path = $_.Name; bytes = $_.Length; sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant(); authenticode = [string]$s.Status; signer = if ($s.SignerCertificate) { [string]$s.SignerCertificate.Subject } else { $null } }
  })
  $auditPath = Join-Path (Split-Path -Parent $PSScriptRoot) 'scripts/audit-tesseract-installed-pe.cjs'
  try {
    $nodeOut = & node $auditPath ($installRoot)
    if ($LASTEXITCODE -ne 0) { throw 'STATIC_IMPORT_CHECK_EXIT' }
    $state.import_closure = ($nodeOut -join ([Environment]::NewLine)) | ConvertFrom-Json
  } catch {
    $state.import_closure = [ordered]@{ status = 'not-proven'; error = $_.Exception.Message }
  }
  $global:LASTEXITCODE = 0
  $state.status = 'ACTUAL_WINDOWS_OCR_COMPLETE_REVIEW_REQUIRED'
  Save-Report
  Write-Host "PASS P120: actual Tesseract $($state.version_output[0]); $($results.Count) synthetic Korean kor+eng cases executed; exact=$(@($results | Where-Object exact).Count); mismatch=$(@($results | Where-Object { !$_.exact }).Count)"
  Write-Host "P119 OBSERVED installer Authenticode=$($state.installer_signature.status); release SHA256=$hash; product OCR remains disabled"
  Write-Host "P119/P120 REPORT: $reportPath"
  Write-Host (($state | ConvertTo-Json -Depth 12 -Compress))
} catch {
  $state.status = 'FAILED'
  $state.error = $_.Exception.Message
  Save-Report
  Write-Host (($state | ConvertTo-Json -Depth 12 -Compress))
  throw
}
