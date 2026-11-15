$ErrorActionPreference = 'Stop'

if ($env:GITHUB_ACTIONS -ne 'true' -or -not $env:RUNNER_TEMP) {
  throw 'P124 real-model Electron acceptance is restricted to GitHub-hosted Actions.'
}

$repoRoot = [IO.Path]::GetFullPath((Get-Location).Path)
$runnerRoot = [IO.Path]::GetFullPath($env:RUNNER_TEMP).TrimEnd('\')
$runtimeZipSha = '50fcf5ad54277f2fa5d173ebfc93bcb017adbc0c9ef2314daabc96ca9e6aa64e'
$modelSha = 'eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee'
$modelParts = @(
  @{ Name = 'qwen3-4b-instruct-2507-Q8_0.gguf.part0'; Sha = '611f555849d7360ac5157df694b2ca7327a9d69a40612cf86807e765cbfdb75c' },
  @{ Name = 'qwen3-4b-instruct-2507-Q8_0.gguf.part1'; Sha = '4d329adca10c17ab73a64d47a22ffc8163f0f89567459ccb149ef685cf33e87a' },
  @{ Name = 'qwen3-4b-instruct-2507-Q8_0.gguf.part2'; Sha = '8aa6a472d08a4ba1922eff00e2833cbb36f30ae7b13d98620ff84d8b81862e21' }
)
$script:OwnedServer = $null

function Assert-ExitCode([string]$Label) {
  if ($LASTEXITCODE -ne 0) { throw "$Label failed with exit code $LASTEXITCODE" }
}

function Assert-GitHubUrl([string]$Url) {
  $uri = [Uri]$Url
  if ($uri.Scheme -ne 'https' -or $uri.Host -notin @('github.com', 'raw.githubusercontent.com')) {
    throw 'P124 accepts downloads only from GitHub-hosted URLs.'
  }
}

function Download-GitHubFile([string]$Url, [string]$Destination) {
  Assert-GitHubUrl $Url
  & curl.exe --fail --show-error --location --retry 5 --retry-all-errors --output $Destination $Url
  Assert-ExitCode "GitHub download $(Split-Path -Leaf $Destination)"
}

function Get-Hash([string]$Path) {
  (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Wait-Ollama([string]$ExpectedModel) {
  for ($attempt = 0; $attempt -lt 90; $attempt++) {
    try {
      $tags = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 4
      if ($null -ne $tags.models) {
        if (-not $ExpectedModel -or @($tags.models | Where-Object { $_.name -in @('qwen3:4b-instruct', 'qwen3:4b-instruct:latest') }).Count -gt 0) {
          return
        }
      }
    } catch { }
    Start-Sleep -Seconds 1
  }
  throw "Loopback Ollama did not become ready with expectedModel=$ExpectedModel."
}

function Start-OllamaServer([string]$ModelDirectory, [string]$Label) {
  $env:OLLAMA_HOST = '127.0.0.1:11434'
  $env:OLLAMA_NO_CLOUD = '1'
  $env:CUDA_VISIBLE_DEVICES = '-1'
  $env:OLLAMA_MODELS = $ModelDirectory
  $stdout = Join-Path $runnerRoot "astra-p124-$Label-ollama.out.log"
  $stderr = Join-Path $runnerRoot "astra-p124-$Label-ollama.err.log"
  $script:OwnedServer = Start-Process -FilePath $script:OllamaExe -ArgumentList 'serve' -PassThru -WindowStyle Hidden `
    -RedirectStandardOutput $stdout -RedirectStandardError $stderr
  Wait-Ollama ''
}

function Stop-OwnedServer {
  if ($script:OwnedServer) {
    $ownedId = $script:OwnedServer.Id
    if (Get-Process -Id $ownedId -ErrorAction SilentlyContinue) {
      & taskkill.exe /PID $ownedId /T /F | Out-Null
      if ($LASTEXITCODE -notin @(0, 128)) { throw "Could not stop this workflow's Ollama process tree (PID $ownedId)." }
    }
    $script:OwnedServer = $null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
      try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 1 | Out-Null; Start-Sleep -Milliseconds 200 }
      catch { return }
    }
    throw 'The P124 loopback server did not release port 11434 after shutdown.'
  }
}

function Start-ForgedResponseServer {
  $stdout = Join-Path $runnerRoot 'astra-p124-tampered-protocol.out.log'
  $stderr = Join-Path $runnerRoot 'astra-p124-tampered-protocol.err.log'
  $script:OwnedServer = Start-Process -FilePath (Get-Command node).Source `
    -ArgumentList (Join-Path $repoRoot 'tests/p124-fake-ollama.cjs') -PassThru -WindowStyle Hidden `
    -RedirectStandardOutput $stdout -RedirectStandardError $stderr
  Wait-Ollama 'qwen3:4b-instruct'
}

function Invoke-ElectronScenario([string]$Scenario) {
  $profile = Join-Path $runnerRoot "astra-p124-profile-$Scenario"
  if ([IO.Path]::GetDirectoryName([IO.Path]::GetFullPath($profile)) -ne $runnerRoot) {
    throw 'P124 Electron profile escaped RUNNER_TEMP.'
  }
  if (Test-Path -LiteralPath $profile) { throw "Refusing to reuse P124 profile: $profile" }
  New-Item -ItemType Directory -Path $profile | Out-Null
  $env:P124_SCENARIO = $Scenario
  $env:P124_REPORT_OUT = if ($Scenario -eq 'quality') { Join-Path $runnerRoot 'astra-c005-quality.json' } else { Join-Path $runnerRoot "astra-p124-$Scenario.json" }
  $env:P124_SCREENSHOT_DIR = $runnerRoot
  $env:ASTRA_P124_PROFILE_DIR = $profile
  $env:ASTRA_P124_ELECTRON_ACCEPTANCE = '1'
  $electron = Join-Path $repoRoot 'node_modules/.bin/electron.cmd'
  & $electron '.' '--astra-desktop-smoke' '--astra-p124-qwen3-acceptance'
  Assert-ExitCode "Windows Electron P124 $Scenario acceptance"
  if (-not (Test-Path -LiteralPath $env:P124_REPORT_OUT -PathType Leaf)) { throw "Missing P124 $Scenario report." }
  $report = Get-Content -LiteralPath $env:P124_REPORT_OUT -Raw | ConvertFrom-Json
  if ($report.status -ne 'PASS' -or $report.github_sha -ne $env:GITHUB_SHA) {
    throw "P124 $Scenario report did not PASS for the exact GitHub SHA."
  }
  if (@($report.sku_contexts).Count -ne 3) { throw "P124 $Scenario did not cover all three SKU contexts." }
  if (-not $report.synthetic_v1_v2_unchanged -or -not $report.product_step2_content_preserved -or $report.automatic_applies -ne 0) {
    throw "P124 $Scenario changed stored V1/V2 content or automatically applied text."
  }
  if ($Scenario -eq 'quality') {
    if ($report.c005_quality.distinct_input_count -ne 31 -or $report.c005_quality.total_real_inference_calls -ne 31 -or -not $report.c005_quality.unique_coverage_all_skus -or -not $report.c005_quality.safety_gate_zero_automatic_applies) {
      throw 'C005 did not complete the 31-input corpus measurement across all three SKU contexts.'
    }
    Write-Host ("C005 31-input corpus measurement PASS; qualityGate={0}; physicalHostMemoryGiB={1:N2}" -f $report.c005_quality.quality_gate, ($report.resource_profile.host_memory_bytes/1GB))
  }
  if ($Scenario -eq 'healthy') {
    if (-not $report.pdf_text_equal_by_sku -or -not $report.synthetic_v1_v2_unchanged -or -not $report.product_step2_content_preserved -or $report.automatic_applies -ne 0) {
      throw 'P124 healthy scenario missed per-SKU PDF text stability, V1/V2 content preservation, or no-auto-apply acceptance.'
    }
    foreach ($sku in $report.sku_contexts) {
      if ($sku.actual_proposals -lt 10 -or -not $sku.cancelled -or $sku.approved_then_undone -ne 1 -or $sku.rejected -lt 1) {
        throw "P124 healthy $($sku.sku) missed real proposal, cancel, approve/reject/Undo acceptance."
      }
    }
  }
  if ($Scenario -eq 'missing' -and @($report.sku_contexts | Where-Object { $_.model_status -ne 'unavailable' -or -not $_.run_disabled }).Count -ne 0) {
    throw 'P124 missing-model scenario did not fail closed for each SKU.'
  }
  if ($Scenario -eq 'tampered' -and @($report.sku_contexts | Where-Object { $_.tampered_output -ne 'rejected' -or -not $_.source_unchanged }).Count -ne 0) {
    throw 'P124 tampered-output scenario was not rejected for each SKU.'
  }
  if ($Scenario -eq 'quality') {
    Write-Host "C005 31-input corpus scenario completed sha=$env:GITHUB_SHA skuContexts=$(@($report.sku_contexts).Count)"
  } else {
    Write-Host "PASS P124 Electron scenario=$Scenario sha=$env:GITHUB_SHA skuContexts=$(@($report.sku_contexts).Count)"
  }
}

try {
  if ([IO.Path]::GetPathRoot($runnerRoot) -ne [IO.Path]::GetPathRoot($repoRoot)) {
    throw 'P124 requires enough local runner-temp capacity on the same volume as the application.'
  }
  $drive = [IO.DriveInfo]::new([IO.Path]::GetPathRoot($runnerRoot))
  if ($drive.AvailableFreeSpace -lt 10GB) {
    throw "P124 Qwen3 Windows runner needs at least 10 GiB free for pinned model/runtime; available=$([math]::Round($drive.AvailableFreeSpace/1GB,2)) GiB."
  }
  if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
    throw 'P124 CPU-only acceptance refused because NVIDIA tooling is present on the hosted runner.'
  }

  $entitlementsPath = Join-Path $runnerRoot 'astra-p124-test-entitlements.json'
  node (Join-Path $repoRoot 'tests/p124-generate-test-entitlements.cjs') $entitlementsPath
  Assert-ExitCode 'P124 ephemeral signed SKU receipt generation'
  $env:ASTRA_P124_ENTITLEMENT_CONFIG = $entitlementsPath
  $env:ASTRA_P124_ELECTRON_ACCEPTANCE = '1'
  npm run build
  Assert-ExitCode 'P124 isolated product Workspace entitlement fixture build'
  $fixture = Join-Path $repoRoot 'dist/tests/fixtures/p124-electron-qwen3.html'
  if (-not (Test-Path -LiteralPath $fixture -PathType Leaf)) { throw 'Vite did not produce the P124 Electron acceptance fixture.' }

  $runtimeZip = Join-Path $runnerRoot 'astra-p124-ollama-windows-amd64.zip'
  $runtimeDir = Join-Path $runnerRoot 'astra-p124-ollama-runtime'
  New-Item -ItemType Directory -Path $runtimeDir | Out-Null
  Download-GitHubFile 'https://github.com/ollama/ollama/releases/download/v0.40.16/ollama-windows-amd64.zip' $runtimeZip
  if ((Get-Hash $runtimeZip) -ne $runtimeZipSha) { throw 'Pinned Ollama Windows runtime SHA-256 mismatch.' }
  Expand-Archive -LiteralPath $runtimeZip -DestinationPath $runtimeDir
  Remove-Item -LiteralPath $runtimeZip -Force
  $ollamaMatches = @(Get-ChildItem -LiteralPath $runtimeDir -Filter 'ollama.exe' -File -Recurse)
  if ($ollamaMatches.Count -ne 1) { throw "Expected exactly one ollama.exe in the pinned Windows release, found $($ollamaMatches.Count)." }
  $script:OllamaExe = $ollamaMatches[0].FullName
  $version = (& $script:OllamaExe --version | Out-String).Trim()
  if ($LASTEXITCODE -ne 0 -or $version -notmatch '0\.40\.16') { throw "Unexpected Ollama runtime version: $version" }
  Write-Host "PASS P124 runtime version=$version sha256=$runtimeZipSha CPU-only=CUDA_VISIBLE_DEVICES:-1"

  $modelRevision = '6bbfd43a548c506734fb8899ed5adee5878a5e4a'
  $licensePath = Join-Path $runnerRoot 'astra-p124-qwen3-LICENSE'
  Download-GitHubFile "https://raw.githubusercontent.com/locomotive-works/npu-local-model-running/$modelRevision/LICENSE" $licensePath
  $licenseBytes = [IO.File]::ReadAllBytes($licensePath)
  [byte[]]$gitInput = [Text.Encoding]::UTF8.GetBytes("blob $($licenseBytes.Length)`0") + $licenseBytes
  $licenseBlob = [Convert]::ToHexString([Security.Cryptography.SHA1]::HashData($gitInput)).ToLowerInvariant()
  if ($licenseBlob -ne '6634c8cc3133b3848ec74b9f275acaaa1ea618ab') { throw 'Pinned Qwen3 test-artifact LICENSE blob mismatch.' }
  if ([Text.Encoding]::UTF8.GetString($licenseBytes) -notmatch 'Apache License') { throw 'Pinned Qwen3 LICENSE is not identified as Apache-2.0.' }

  $modelPartsDir = Join-Path $runnerRoot 'astra-p124-qwen3-parts'
  New-Item -ItemType Directory -Path $modelPartsDir | Out-Null
  $releaseBase = 'https://github.com/locomotive-works/npu-local-model-running/releases/download/v1.0'
  $combined = Join-Path $runnerRoot 'astra-p124-qwen3-Q8_0.gguf'
  $output = [IO.File]::Open($combined, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
  try {
    foreach ($part in $modelParts) {
      $partPath = Join-Path $modelPartsDir $part.Name
      Download-GitHubFile "$releaseBase/$($part.Name)" $partPath
      if ((Get-Hash $partPath) -ne $part.Sha) { throw "Pinned Qwen3 model part hash mismatch: $($part.Name)" }
      $partStream = [IO.File]::OpenRead($partPath)
      try { $partStream.CopyTo($output) } finally { $partStream.Dispose() }
    }
    $output.Flush()
  } finally { $output.Dispose() }
  if ((Get-Hash $combined) -ne $modelSha) { throw 'Combined Qwen3 model SHA-256 mismatch.' }
  Remove-Item -LiteralPath $modelPartsDir -Recurse -Force

  $modelStore = Join-Path $runnerRoot 'astra-p124-ollama-models'
  New-Item -ItemType Directory -Path $modelStore | Out-Null
  $modelfile = Join-Path $runnerRoot 'astra-p124-Modelfile'
  "FROM $($combined.Replace('\','/'))" | Set-Content -LiteralPath $modelfile -Encoding ascii
  Start-OllamaServer $modelStore 'healthy'
  $env:OLLAMA_HOST = '127.0.0.1:11434'; $env:OLLAMA_NO_CLOUD = '1'; $env:CUDA_VISIBLE_DEVICES = '-1'; $env:OLLAMA_MODELS = $modelStore
  & $script:OllamaExe create qwen3:4b-instruct -f $modelfile
  Assert-ExitCode 'Pinned Qwen3 model import into local Ollama'
  Wait-Ollama 'qwen3:4b-instruct'
  Remove-Item -LiteralPath $combined, $modelfile -Force
  Invoke-ElectronScenario 'healthy'
  Stop-OwnedServer

  $emptyModelStore = Join-Path $runnerRoot 'astra-p124-empty-models'
  New-Item -ItemType Directory -Path $emptyModelStore | Out-Null
  Start-OllamaServer $emptyModelStore 'missing'
  Invoke-ElectronScenario 'missing'
  Stop-OwnedServer

  Start-ForgedResponseServer
  Invoke-ElectronScenario 'tampered'
  Stop-OwnedServer

  Start-OllamaServer $modelStore 'quality'
  Invoke-ElectronScenario 'quality'
  Stop-OwnedServer

  Write-Host "PASS P124 Windows Electron Qwen3 acceptance and C005 31-input corpus measurement; model sha256=$modelSha runtime sha256=$runtimeZipSha"
} finally {
  Stop-OwnedServer
  Remove-Item Env:P124_SCENARIO -ErrorAction SilentlyContinue
  Remove-Item Env:P124_REPORT_OUT -ErrorAction SilentlyContinue
  Remove-Item Env:P124_SCREENSHOT_DIR -ErrorAction SilentlyContinue
  Remove-Item Env:ASTRA_P124_PROFILE_DIR -ErrorAction SilentlyContinue
  Remove-Item Env:ASTRA_P124_ELECTRON_ACCEPTANCE -ErrorAction SilentlyContinue
  Remove-Item Env:ASTRA_P124_ENTITLEMENT_CONFIG -ErrorAction SilentlyContinue
  if (Test-Path -LiteralPath $entitlementsPath) { Remove-Item -LiteralPath $entitlementsPath -Force }
}
