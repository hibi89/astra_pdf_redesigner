'use strict';
// P104, local-only packaging audit. Successful hashes DO NOT grant permission
// to redistribute assets and DO NOT activate OCR_MANIFEST.
const fs=require('node:fs');
const fsp=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const {inspectPeStaticImports,verifyPeImportClosure,MAX_PE_BYTES}=require('./ocr-pe-import-audit.cjs');

const SHA=/^[0-9a-f]{64}$/;
const ID=/^[a-z0-9][a-z0-9._-]{1,63}$/;
const HTTPS=/^https:\/\/[^\s?#/]+(?:\/[^\s#]*)?$/i;
const MAX_MANIFEST_BYTES=256*1024;
const MAX_FILES=192;
const MAX_TOTAL_BYTES=512*1024*1024;
const MAX_SINGLE_BYTES=256*1024*1024;
const NOTICE='licenses/THIRD-PARTY-NOTICES.txt';
const CLASSIFICATIONS=Object.freeze({
 'bin/tesseract.exe':'engine',
 'tessdata/kor.traineddata':'language',
 'tessdata/eng.traineddata':'language',
});

function fail(reason){throw Error(reason);}
function validSha(value){return typeof value==='string'&&SHA.test(value)&&!/^(.)\1{63}$/.test(value);}
function safeUrl(value){return typeof value==='string'&&value.length<=1024&&HTTPS.test(value);}
function kindFor(rel){
 if(Object.hasOwn(CLASSIFICATIONS,rel))return CLASSIFICATIONS[rel];
 if(/^bin\/[A-Za-z0-9_.-]{1,90}\.dll$/i.test(rel))return'dependency';
 if(/^licenses\/[A-Za-z0-9_.-]{1,90}\.txt$/.test(rel))return rel===NOTICE?'notice':'license';
 return null;
}
function safeFileName(rel){
 return typeof rel==='string'&&rel.length<=128&&
  !rel.includes('\\')&&!rel.startsWith('/')&&!rel.includes('..')&&
  rel.split('/').length===2&&kindFor(rel)!==null;
}
function parseManifest(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.schemaVersion!==1||
  value.platform!=='windows-x64'||value.purpose!=='astra-offline-ocr-asset-audit')
  fail('invalid-manifest-schema');
 const origin=value.origin;
 if(!origin||typeof origin!=='object'||!safeUrl(origin.installerUrl)||
  !validSha(origin.installerSha256)||typeof origin.distributor!=='string'||
  !/^[\w .()\-]{3,100}$/.test(origin.distributor)||
  typeof origin.version!=='string'||!/^[A-Za-z0-9._-]{2,64}$/.test(origin.version))
  fail('missing-supplier-provenance');
 const files=value.files;
 if(!Array.isArray(files)||files.length<6||files.length>MAX_FILES)
  fail('invalid-asset-inventory');
 const byName=new Map();
 let totalDeclared=0,dependencyCount=0;
 for(const entry of files){
  if(!entry||typeof entry!=='object'||!safeFileName(entry.path)||
   entry.kind!==kindFor(entry.path)||!validSha(entry.sha256)||
   !Number.isSafeInteger(entry.bytes)||entry.bytes<4||entry.bytes>MAX_SINGLE_BYTES)
   fail('invalid-asset-entry');
  const key=entry.path.toLowerCase();
  if(byName.has(key))fail('duplicate-asset');
  if(entry.kind==='dependency')dependencyCount++;
  if(entry.kind==='engine'||entry.kind==='dependency'||entry.kind==='language'){
   if(!ID.test(entry.licenseId)||!safeUrl(entry.sourceUrl))
    fail('unproven-asset-license');
  }else if(entry.licenseId!==undefined||entry.sourceUrl!==undefined){
   fail('license-metadata-on-evidence-file');
  }
  totalDeclared+=entry.bytes;
  if(totalDeclared>MAX_TOTAL_BYTES)fail('asset-inventory-too-large');
  byName.set(key,entry);
 }
 if(dependencyCount===0)fail('windows-dll-inventory-missing');
 for(const name of ['bin/tesseract.exe','tessdata/kor.traineddata','tessdata/eng.traineddata',NOTICE]){
  if(!byName.has(name.toLowerCase()))fail('required-ocr-asset-missing');
 }
 const licenses=value.licenses;
 if(!Array.isArray(licenses)||licenses.length<2||licenses.length>64)
  fail('license-evidence-missing');
 const licenseIds=new Set();
 for(const license of licenses){
  if(!license||!ID.test(license.id)||licenseIds.has(license.id)||
   typeof license.spdx!=='string'||!(/^[A-Za-z0-9.+-]{2,80}$/).test(license.spdx)||
   /^(?:NOASSERTION|NONE|UNKNOWN|UNLICENSED)$/i.test(license.spdx)||
   !safeUrl(license.sourceUrl)||typeof license.file!=='string'||
   byName.get(license.file.toLowerCase())?.kind!=='license')
   fail('invalid-license-evidence');
  licenseIds.add(license.id);
 }
 for(const entry of files){
  if(['engine','dependency','language'].includes(entry.kind)&&!licenseIds.has(entry.licenseId))
   fail('asset-license-unmapped');
 }
 return {byName,fileCount:files.length,totalDeclared,licenseCount:licenses.length,dependencyCount};
}
function verifyPeHeader(bytes){
 if(bytes.length<0x100||bytes.toString('ascii',0,2)!=='MZ')fail('invalid-windows-pe');
 const offset=bytes.readUInt32LE(0x3c);
 if(offset<0x40||offset+26>bytes.length||
  bytes.toString('ascii',offset,offset+4)!=='PE\0\0'||
  bytes.readUInt16LE(offset+4)!==0x8664||
  bytes.readUInt16LE(offset+24)!==0x20b)
  fail('non-x64-or-invalid-windows-pe');
}
async function assertRegular(location,expectedType){
 const st=await fsp.lstat(location);
 if(st.isSymbolicLink()||(expectedType!=='dir'&&st.nlink>1)||
  (expectedType==='dir'?!st.isDirectory():!st.isFile()))
  fail('symlink-or-unsafe-file');
 return st;
}
async function enumerate(bundle){
 const observed=[];
 async function readDir(rel){
  const dir=rel?path.join(bundle,rel):bundle;
  await assertRegular(dir,'dir');
  for(const node of await fsp.readdir(dir,{withFileTypes:true})){
   const next=rel?rel+'/'+node.name:node.name;
   if(node.isSymbolicLink())fail('symlink-or-unsafe-file');
   const st=await fsp.lstat(path.join(bundle,next));
   if(st.isDirectory()){
    if(!['bin','tessdata','licenses'].includes(next))fail('unlisted-asset-directory');
    await readDir(next);
   }else{
    if(!st.isFile()||st.nlink>1||!safeFileName(next))fail('unsafe-asset-path');
    observed.push(next);
   }
   if(observed.length>MAX_FILES)fail('asset-inventory-too-large');
  }
 }
 await readDir('');
 return observed;
}
async function hashFile(file,expected){
 const opened=await fsp.open(file,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0));
 try{
  const before=await opened.stat();
  if(!before.isFile()||before.nlink>1||before.size!==expected.bytes)
   fail('asset-size-mismatch');
  const peAsset=['engine','dependency'].includes(expected.kind);
  if(peAsset&&expected.bytes>MAX_PE_BYTES)fail('pe-image-too-large-for-static-import-audit');
  const peChunks=peAsset?[]:null;
  const sha=crypto.createHash('sha256');
  let counted=0;
  const header=Buffer.alloc(4096);let headerSize=0;
  const stream=opened.createReadStream({autoClose:false,highWaterMark:64*1024});
  for await(const chunk of stream){
   sha.update(chunk);counted+=chunk.length;
   if(peChunks)peChunks.push(chunk);
   if(headerSize<header.length){
    const n=Math.min(header.length-headerSize,chunk.length);
    chunk.copy(header,headerSize,0,n);headerSize+=n;
   }
   if(counted>expected.bytes)fail('asset-size-mismatch');
  }
  const after=await opened.stat();
  if(counted!==expected.bytes||after.size!==before.size||
   after.mtimeMs!==before.mtimeMs||after.ctimeMs!==before.ctimeMs)
   fail('asset-changed-during-audit');
  if(sha.digest('hex')!==expected.sha256)fail('asset-sha256-mismatch');
  if(['engine','dependency'].includes(expected.kind))
   verifyPeHeader(header.subarray(0,headerSize));
  const imports=peChunks?inspectPeStaticImports(Buffer.concat(peChunks)):null;
  if(['license','notice'].includes(expected.kind)){
   const text=await fsp.readFile(file,'utf8');
   if(text.includes('\ufffd')||text.trim().length<24)fail('license-or-notice-invalid');
  }
  return imports;
 }finally{await opened.close().catch(()=>{});}
}
async function auditOcrWindowsBundle(bundlePath,manifestPath){
 if(typeof bundlePath!=='string'||typeof manifestPath!=='string')
  fail('missing-input-path');
 const bundle=path.resolve(bundlePath),source=path.resolve(manifestPath);
 if(source===bundle||source.startsWith(bundle+path.sep))fail('manifest-must-be-outside-assets');
 await assertRegular(bundle,'dir');
 const mfStat=await assertRegular(source,'file');
 if(mfStat.size>MAX_MANIFEST_BYTES||mfStat.size<16)fail('invalid-manifest-size');
 let manifest;
 try{manifest=JSON.parse(await fsp.readFile(source,'utf8'));}
 catch{fail('invalid-manifest-json');}
 const audit=parseManifest(manifest);
 const observed=await enumerate(bundle);
 if(observed.length!==audit.fileCount)fail('unlisted-or-missing-asset');
 const observedLower=new Set();
 const peEvidence=new Map();
 for(const relative of observed){
  const key=relative.toLowerCase();
  if(observedLower.has(key))fail('duplicate-asset');
  observedLower.add(key);
  const expected=audit.byName.get(key);
  if(!expected||relative!==expected.path)fail('unlisted-or-case-mismatched-asset');
  const imports=await hashFile(path.join(bundle,...relative.split('/')),expected);
  if(imports)peEvidence.set(relative,imports);
 }
 for(const key of audit.byName.keys()){
  if(!observedLower.has(key))fail('unlisted-or-missing-asset');
 }
 const importEvidence=verifyPeImportClosure(peEvidence,audit.byName);
 return Object.freeze({
  status:'review-required',platform:'windows-x64',assetCount:audit.fileCount,
  dllCount:audit.dependencyCount,licenseEvidenceCount:audit.licenseCount,
  totalVerifiedBytes:audit.totalDeclared,hashesVerified:true,
  staticPeImportsInspected:true,...importEvidence,
  legalRedistributionApproved:false,installerSignatureVerified:false,
  dllRuntimeDependencyClosureVerified:false,productOcrEnabled:false,
 });
}
module.exports={auditOcrWindowsBundle};
if(require.main===module){
 if(process.argv.length!==4){
  console.error('Usage: node desktop/ocr-supply-chain-preflight.cjs <assets-folder> <external-manifest.json>');
  process.exitCode=2;
 }else{
  auditOcrWindowsBundle(process.argv[2],process.argv[3])
   .then(summary=>console.log(JSON.stringify(summary,null,2)))
   .catch(error=>{console.error('BLOCKED OCR ASSET PREFLIGHT:',error.message);process.exitCode=1;});
 }
}
