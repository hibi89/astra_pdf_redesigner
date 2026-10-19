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
    'webSecurity:true','registerSchemesAsPrivileged',"app.setPath('userData'",'onBeforeRequest']){
    assert.ok(s.includes(fragment),'Missing '+fragment);
  }
  assert.doesNotMatch(s,/allowRunningInsecureContent:true|bypassCSP:true/);
});
