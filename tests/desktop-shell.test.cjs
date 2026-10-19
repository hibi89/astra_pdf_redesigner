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
