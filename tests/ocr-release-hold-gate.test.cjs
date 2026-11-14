'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {verifyOcrReleaseHold}=require('../desktop/ocr-release-hold-gate.cjs');
const realRoot=path.resolve(__dirname,'..');
function fixture(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'astra-ocr-release-hold-'));
 fs.mkdirSync(path.join(root,'desktop'),{recursive:true});
 fs.mkdirSync(path.join(root,'dist'),{recursive:true});
 const config=fs.readFileSync(path.join(realRoot,'electron-builder.yml'),'utf8');
 fs.writeFileSync(path.join(root,'electron-builder.yml'),config);
 fs.writeFileSync(path.join(root,'desktop','main.cjs'),'module.exports={safe:true};\n');
 return{root,cleanup:()=>fs.rmSync(root,{recursive:true,force:true,maxRetries:3,retryDelay:50})};
}
test('OCR release gate keeps the current source explicitly disabled',()=>{
 const result=verifyOcrReleaseHold(realRoot);
 assert.equal(result.status,'RELEASE_HOLD');
 assert.equal(result.nativeOcrAssetsBundled,false);
 assert.equal(result.productOcrEnabled,false);
});
test('OCR release gate denies an undocumented native DLL',()=>{
 const f=fixture();
 try{fs.writeFileSync(path.join(f.root,'desktop','evil.dll'),'not-an-allowed-package');
 assert.throws(()=>verifyOcrReleaseHold(f.root),/unapproved-native-ocr-binary/);}
 finally{f.cleanup();}
});
test('OCR release gate denies bundled traineddata even if synthetically named',()=>{
 const f=fixture();
 try{fs.writeFileSync(path.join(f.root,'dist','kor.traineddata'),'not-a-licensed-bundle');
 assert.throws(()=>verifyOcrReleaseHold(f.root),/unapproved-native-ocr-binary/);}
 finally{f.cleanup();}
});
test('OCR release gate denies a hidden OCR resources directory',()=>{
 const f=fixture();
 try{fs.mkdirSync(path.join(f.root,'desktop','astra-local-ocr'));
 assert.throws(()=>verifyOcrReleaseHold(f.root),/native-ocr-assets-present/);}
 finally{f.cleanup();}
});
test('OCR release gate detects new Electron extraResources configuration',()=>{
 const f=fixture();
 try{fs.appendFileSync(path.join(f.root,'electron-builder.yml'),'\nextraResources:\n  - ocr-bundle/**\n');
 assert.throws(()=>verifyOcrReleaseHold(f.root),/new-electron-extra-resources-must-be-audited/);}
 finally{f.cleanup();}
});


test('OCR release gate refuses extra package file globs that could smuggle assets',()=>{
 const f=fixture();
 try{
  const configFile=path.join(f.root,'electron-builder.yml');
  const original=fs.readFileSync(configFile,'utf8');
  assert.ok(original.includes('  - package.json'));
  fs.writeFileSync(configFile,original.replace('  - package.json','  - package.json\n  - ocr-binaries/**'));
  assert.throws(()=>verifyOcrReleaseHold(f.root),/packaging-files-changed-review-required/);
 }finally{f.cleanup();}
});
