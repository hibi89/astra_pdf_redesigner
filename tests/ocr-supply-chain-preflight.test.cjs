'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {auditOcrWindowsBundle}=require('../desktop/ocr-supply-chain-preflight.cjs');
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const ORIGIN='https://github.com/UB-Mannheim/tesseract/wiki';
const SOURCE='https://github.com/tesseract-ocr/tesseract';
function fakePe(machine=0x8664){
 const out=Buffer.alloc(512);
 out.write('MZ',0,'ascii');out.writeUInt32LE(0x80,0x3c);
 out.write('PE\0\0',0x80,'ascii');out.writeUInt16LE(machine,0x84);
 out.writeUInt16LE(0x20b,0x98);
 return out;
}
function fixture(){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'astra-ocr-sbom-'));
 const assets=path.join(dir,'bundle'),manifestPath=path.join(dir,'inventory.json');
 for(const folder of ['bin','tessdata','licenses'])fs.mkdirSync(path.join(assets,folder),{recursive:true});
 const records=[];
 const add=(rel,body,kind,licenseId)=>{
  const f=path.join(assets,...rel.split('/'));fs.writeFileSync(f,body);
  const row={path:rel,kind,bytes:body.length,sha256:hash(body)};
  if(licenseId){row.licenseId=licenseId;row.sourceUrl=SOURCE;}
  records.push(row);
 };
 add('bin/tesseract.exe',fakePe(),'engine','tesseract-apache');
 add('bin/liblept.dll',fakePe(),'dependency','leptonica-bsd');
 add('tessdata/kor.traineddata',Buffer.from('synthetic-korean-language-test-only'),'language','tesseract-apache');
 add('tessdata/eng.traineddata',Buffer.from('synthetic-english-language-test-only'),'language','tesseract-apache');
 add('licenses/TESSERACT-LICENSE.txt',Buffer.from('Synthetic Apache license evidence fixture, not real redistribution proof.'),'license');
 add('licenses/LEPTONICA-LICENSE.txt',Buffer.from('Synthetic BSD license evidence fixture, not real redistribution proof.'),'license');
 add('licenses/THIRD-PARTY-NOTICES.txt',Buffer.from('Synthetic test NOTICE, all files are fabricated and must never be distributed.'),'notice');
 const manifest={
  schemaVersion:1,platform:'windows-x64',purpose:'astra-offline-ocr-asset-audit',
  origin:{distributor:'Synthetic CI Only',version:'5.5.3-test',installerUrl:ORIGIN,installerSha256:hash('synthetic-installer-archive-claim')},
  files:records,
  licenses:[
   {id:'tesseract-apache',spdx:'Apache-2.0',sourceUrl:SOURCE,file:'licenses/TESSERACT-LICENSE.txt'},
   {id:'leptonica-bsd',spdx:'BSD-2-Clause',sourceUrl:'https://github.com/DanBloomberg/leptonica',file:'licenses/LEPTONICA-LICENSE.txt'},
  ],
 };
 const save=()=>fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2),'utf8');
 save();
 return{dir,assets,manifestPath,manifest,save,
  cleanup:()=>fs.rmSync(dir,{recursive:true,force:true,maxRetries:3,retryDelay:60})};
}
async function withFixture(fn){
 const f=fixture();try{await fn(f);}finally{f.cleanup();}
}
test('OCR supply preflight: complete pinned synthetic inventory is only REVIEW-REQUIRED',()=>withFixture(async f=>{
 const result=await auditOcrWindowsBundle(f.assets,f.manifestPath);
 assert.equal(result.status,'review-required');
 assert.equal(result.hashesVerified,true);
 assert.equal(result.assetCount,7);
 assert.equal(result.dllCount,1);
 assert.equal(result.licenseEvidenceCount,2);
 assert.equal(result.legalRedistributionApproved,false);
 assert.equal(result.installerSignatureVerified,false);
 assert.equal(result.dllRuntimeDependencyClosureVerified,false);
 assert.equal(result.productOcrEnabled,false);
 assert.doesNotMatch(JSON.stringify(result),/synthetic-english|license evidence fixture/);
}));
test('OCR supply preflight rejects an unlisted DLL even when the other hashes match',()=>withFixture(async f=>{
 fs.writeFileSync(path.join(f.assets,'bin','unsigned.dll'),fakePe());
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/unlisted-or-missing-asset/);
}));
test('OCR supply preflight fails if no dependency DLL is declared',()=>withFixture(async f=>{
 f.manifest.files=f.manifest.files.filter(x=>x.kind!=='dependency');f.save();
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/windows-dll-inventory-missing/);
}));
test('OCR supply preflight rejects tampering of a pinned language pack',()=>withFixture(async f=>{
 fs.appendFileSync(path.join(f.assets,'tessdata','kor.traineddata'),'injected');
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/asset-size-mismatch/);
}));
test('OCR supply preflight refuses a changed hash even if byte length is unchanged',()=>withFixture(async f=>{
 const target=path.join(f.assets,'tessdata','eng.traineddata');
 const content=fs.readFileSync(target);content[5]^=1;fs.writeFileSync(target,content);
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/asset-sha256-mismatch/);
}));
test('OCR supply preflight refuses x86 or malformed executable despite matching SHA',()=>withFixture(async f=>{
 const entry=f.manifest.files.find(x=>x.kind==='engine'),buffer=fakePe(0x14c);
 fs.writeFileSync(path.join(f.assets,entry.path),buffer);
 entry.sha256=hash(buffer);f.save();
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/non-x64-or-invalid-windows-pe/);
}));
test('OCR supply preflight rejects symlink escapes from the bundle',()=>withFixture(async f=>{
 const target=path.join(f.assets,'bin','liblept.dll');
 fs.unlinkSync(target);
 try{fs.symlinkSync(path.join(f.assets,'bin','tesseract.exe'),target,'file');}
 catch(error){if(process.platform==='win32'&&error?.code==='EPERM')return;throw error;}
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/symlink-or-unsafe-file/);
}));
test('OCR supply preflight refuses traversal paths even with a claimed SHA',()=>withFixture(async f=>{
 f.manifest.files[0].path='../bin/tesseract.exe';f.save();
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/invalid-asset-entry/);
}));
test('OCR supply preflight rejects duplicate paths ignoring Windows case',()=>withFixture(async f=>{
 f.manifest.files.push({...f.manifest.files[1],path:'bin/LIBLEPT.dll'});f.save();
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/duplicate-asset/);
}));
test('OCR supply preflight rejects missing notice or license mappings',()=>withFixture(async f=>{
 f.manifest.files=f.manifest.files.filter(x=>x.kind!=='notice');f.save();
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/required-ocr-asset-missing/);
}));
test('OCR supply preflight rejects missing license attribution for a DLL',()=>withFixture(async f=>{
 f.manifest.files.find(x=>x.kind==='dependency').licenseId='unknown-licence';f.save();
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/asset-license-unmapped/);
}));
test('OCR supply preflight rejects unknown legal rights and insecure URL',()=>withFixture(async f=>{
 f.manifest.licenses[0].spdx='NOASSERTION';f.save();
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/invalid-license-evidence/);
 f.manifest.licenses[0].spdx='Apache-2.0';
 f.manifest.origin.installerUrl='http://unsafe.example.invalid/setup.exe';f.save();
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/missing-supplier-provenance/);
}));
test('OCR supply preflight requires the manifest outside untrusted assets root',()=>withFixture(async f=>{
 const inside=path.join(f.assets,'inventory.json');
 fs.copyFileSync(f.manifestPath,inside);
 await assert.rejects(auditOcrWindowsBundle(f.assets,inside),/manifest-must-be-outside-assets/);
}));
test('OCR supply preflight rejects unexpected files and folders',()=>withFixture(async f=>{
 fs.mkdirSync(path.join(f.assets,'plugins'));fs.writeFileSync(path.join(f.assets,'plugins','inject.js'),'alert(1)');
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/unlisted-asset-directory/);
}));
test('OCR supply preflight rejects evidence file tamper even when the checksum matches other files',()=>withFixture(async f=>{
 const target=path.join(f.assets,'licenses','THIRD-PARTY-NOTICES.txt');
 const bytes=fs.readFileSync(target);bytes[5]^=1;fs.writeFileSync(target,bytes);
 await assert.rejects(auditOcrWindowsBundle(f.assets,f.manifestPath),/asset-sha256-mismatch/);
}));
