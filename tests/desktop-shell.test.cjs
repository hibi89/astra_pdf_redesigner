'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {resolveBundleAsset}=require('../desktop/bundle-path.cjs');
const root=path.resolve(process.cwd(),'dist');
test('desktop local scheme serves only bundled relative files',()=>{
  assert.equal(resolveBundleAsset(root,'astra://app/'),path.join(root,'index.html'));
  assert.equal(resolveBundleAsset(root,'astra://app/index.html'),path.join(root,'index.html'));
  assert.equal(resolveBundleAsset(root,'astra://app/assets/main.js'),path.join(root,'assets/main.js'));
});
test('desktop local scheme denies escaping, query and remote origins',()=>{
  for(const url of ['https://app/index.html','astra://evil/index.html',
    'astra://app/%2e%2e%5csecrets','astra://app/assets/%5cprivate.txt',
    'astra://app/%00bad','astra://app/index.html?q=1',
    'astra://app:8080/index.html','astra://app/%zz']){
    assert.equal(resolveBundleAsset(root,url),null,'unsafe '+url);
  }
});
test('desktop Electron shell enforces isolated sandbox and network block',()=>{
  const s=fs.readFileSync(path.resolve(__dirname,'../desktop/main.cjs'),'utf8');
  for(const fragment of ['sandbox:true','contextIsolation:true','nodeIntegration:false',
    'webSecurity:true',"preload:path.join(__dirname,'preload.cjs')",'registerSchemesAsPrivileged',"app.setPath('userData'",'onBeforeRequest',"ipcMain.handle('astra:save-pdf'",'printToPDF']){
    assert.ok(s.includes(fragment),'Missing '+fragment);
  }
  assert.doesNotMatch(s,/allowRunningInsecureContent:true|bypassCSP:true/);
});

test('Windows CI invokes real NSIS install and uninstall with non-destructive guards',()=>{
  const script=fs.readFileSync(path.resolve(__dirname,'windows-installer-lifecycle.ps1'),'utf8');
  const ci=fs.readFileSync(path.resolve(__dirname,'../.github/workflows/windows-desktop.yml'),'utf8');
  for(const required of ["$env:GITHUB_ACTIONS -ne 'true'","$env:RUNNER_TEMP",
    "'/S'",'"/D=$installation"','--astra-desktop-smoke',
    'PASS ASTRA NSIS INSTALL','PASS ASTRA NSIS UNINSTALL',
    'PASS ASTRA INSTALLED EXE',"if (-not (Test-Path -LiteralPath $sentinel -PathType Leaf))"]){
    assert.ok(script.includes(required),'NSIS lifecycle script missing '+required);
  }
  assert.match(ci,/run: \.\/tests\/windows-installer-lifecycle\.ps1/);
  assert.doesNotMatch(script,/Remove-Item\s+-LiteralPath\s+\$appProfile\s+-Recurse/);
});

test('Windows acceptance fixture is synthetic PNG and requires runner-only PDF output',()=>{
  const fixture=require('../desktop/pdf-acceptance-fixture.cjs');
  const png=fixture.makeSyntheticPng();
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.ok(png.length>100);
  const source=fixture.acceptanceDomSource();
  assert.ok(source.includes(fixture.MARKERS.first));
  assert.ok(source.includes(fixture.MARKERS.second));
  assert.ok(source.includes(fixture.MARKERS.korean));
  const main=fs.readFileSync(path.resolve(__dirname,'../desktop/main.cjs'),'utf8');
  const lifecycle=fs.readFileSync(path.resolve(__dirname,'windows-installer-lifecycle.ps1'),'utf8');
  assert.ok(main.includes("process.env.GITHUB_ACTIONS!=='true'"));
  assert.ok(main.includes("path.dirname(output)!==runnerRoot"));
  assert.ok(main.includes("await fs.writeFile(output,bytes,{flag:'wx'})"));
  assert.ok(lifecycle.includes('verify-desktop-pdf.mjs'));
  assert.ok(lifecycle.includes('--astra-pdf-acceptance'));
  assert.ok(lifecycle.includes('Remove-Item -LiteralPath $acceptancePdf -Force'));
});

test('local PDF visual acceptance is opt-in, hidden, synthetic, and temp-path guarded',()=>{
  const runtime=fs.readFileSync(path.resolve(__dirname,'../desktop/main.cjs'),'utf8');
  const runner=fs.readFileSync(path.resolve(__dirname,'../desktop/local-pdf-visual.cjs'),'utf8');
  const step2Fixture=fs.readFileSync(path.resolve(__dirname,'../desktop/step2-project-acceptance.cjs'),'utf8');
  const verifier=fs.readFileSync(path.resolve(__dirname,'verify-desktop-pdf.mjs'),'utf8');
  for(const required of ['--astra-local-step2-acceptance','ASTRA_LOCAL_PDF_PROFILE',
    'ASTRA_LOCAL_PDF_OUTPUT','path.dirname(profile)!==tempRoot',
    'path.dirname(output)!==tempRoot','profileInfo.isSymbolicLink()',
    'fsSync.existsSync(output)',"await fs.writeFile(output,bytes,{flag:'wx'})"]){
    assert.ok(runtime.includes(required),'Local visual acceptance guard missing '+required);
  }
  assert.ok(runner.includes('--astra-desktop-smoke'));
  assert.ok(runner.includes('--astra-local-step2-acceptance'));
  assert.ok(runner.includes('windowsHide:true'));
  assert.ok(runner.includes('pdftoppm'));
  assert.ok(step2Fixture.includes('Local STEP2 PDF output must be directly under the isolated OS temp folder'));
  assert.ok(step2Fixture.includes('local?{pattern:true,width:144,height:216}'));
  assert.ok(step2Fixture.includes('picture.naturalHeight===expectedImage.height'));
  assert.ok(verifier.includes('--local-synthetic'));
  assert.ok(verifier.includes("assert.equal(doc.numPages,3"));
});

test('Windows CI exercises real STEP2 UI and IndexedDB before installed PDF output',()=>{
  const fixture=fs.readFileSync(path.resolve(__dirname,'../desktop/step2-project-acceptance.cjs'),'utf8');
  const runtime=fs.readFileSync(path.resolve(__dirname,'../desktop/main.cjs'),'utf8');
  const lifecycle=fs.readFileSync(path.resolve(__dirname,'windows-installer-lifecycle.ps1'),'utf8');
  const verifier=fs.readFileSync(path.resolve(__dirname,'verify-desktop-pdf.mjs'),'utf8');
  for(const required of ['editStep2InBrowser','verifyReloadedProject',
    "indexedDB.open('astra-pdf-redesigner:v2')",'ASTRA_STEP2_BODY_8308',
    "path.dirname(output)!==root","{flag:'wx'}"]){
    assert.ok(fixture.includes(required),'STEP2 acceptance missing '+required);
  }
  assert.ok(runtime.includes('--astra-step2-acceptance'));
  assert.ok(lifecycle.includes('--astra-step2-acceptance'));
  assert.ok(lifecycle.includes('--step2-project'));
  assert.ok(verifier.includes('ASTRA_LIBRARY_ONLY_8310'));
  assert.ok(verifier.includes('realStep2'));
});

test('installed Electron versionchange check is synthetic, isolated, and verifies existing store data',()=>{
  const fixture=fs.readFileSync(path.resolve(__dirname,'../desktop/step2-versionchange-acceptance.cjs'),'utf8');
  const runtime=fs.readFileSync(path.resolve(__dirname,'../desktop/main.cjs'),'utf8');
  const installer=fs.readFileSync(path.resolve(__dirname,'windows-installer-version-upgrade.ps1'),'utf8');
  const workflow=fs.readFileSync(path.resolve(__dirname,'../.github/workflows/windows-desktop.yml'),'utf8');
  for(const required of ["process.env.GITHUB_ACTIONS!=='true'","process.env.RUNNER_TEMP",
    "--astra-step2-schema-upgrade-verify",'electronVersionchangeProbe','isDeepStrictEqual',
    'versionchange warning','activeDocumentId','migrationAudit',"body:document.querySelector('.project-paper')?.textContent"]){
    assert.ok(fixture.includes(required),'Electron versionchange acceptance missing '+required);
  }
  assert.ok(runtime.includes('--astra-step2-versionchange-verify'));
  assert.ok(runtime.includes('runStep2VersionchangeAcceptance(mainWindow,BrowserWindow)'));
  assert.ok(installer.includes('--astra-step2-versionchange-verify'));
  assert.ok(installer.includes('PASS ASTRA VERSIONCHANGE PROFILE CLEANUP'));
  assert.ok(installer.includes('Refusing to recursively remove a reparse-point CI profile'));
  assert.match(workflow,/In-place 0\.1\.0 IDB v1 to 0\.1\.1 IDB v2 Windows upgrade preserves STEP2 IndexedDB/);
});
