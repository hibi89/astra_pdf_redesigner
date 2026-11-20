// Offline owner-operated acceptance preflight for 5-10 DIFFERENT PDF sources.
// No source text, paths, filenames, PDFs, or personal data enter the output.
// This corroborates file SHA256 and self-reported visual checks, NOT fidelity
// or seller approval. No network, model, OCR or dependency is required.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

export const MANIFEST_FORMAT='astra-owner-batch-manifest-v1';
export const EVIDENCE_FORMAT='astra-owner-batch-evidence-v1';
export const CATEGORY_IDS=Object.freeze(['text','table','image','mixed','long','korean','multicolumn','scanned']);
const REVIEW_FORMAT='astra-step7-local-pdf-parity-v1';
const VISUAL_IDS=['text','numbers','tables','images','pagination','typography','clipping'];
const HASH=/^[0-9a-f]{64}$/;
const MAX_MANIFEST=64*1024,MAX_REVIEW=64*1024,MAX_PDF=30*1024*1024;
const deny=()=>{throw Error('ASTRA_OWNER_BATCH_BLOCKED');};
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const exact=(value,keys)=>isRecord(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
function safeExisting(file,extension,limit){
  if(typeof file!=='string'||!path.isAbsolute(file)||!file.toLowerCase().endsWith(extension))deny();
  const filename=path.resolve(file),root=path.parse(filename).root;
  let current=root;
  for(const component of path.relative(root,filename).split(path.sep)){
    if(!component||component==='.'||component==='..')deny();
    current=path.join(current,component);
    if(fs.lstatSync(current).isSymbolicLink())deny();
  }
  const prior=fs.statSync(filename);
  if(!prior.isFile()||prior.size<1||prior.size>limit)deny();
  const fd=fs.openSync(filename,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW??0));
  try{
    const before=fs.fstatSync(fd);
    if(!before.isFile()||before.dev!==prior.dev||before.ino!==prior.ino||
       before.size!==prior.size||before.mtimeMs!==prior.mtimeMs)deny();
    const bytes=fs.readFileSync(fd);
    const after=fs.fstatSync(fd),currentStat=fs.lstatSync(filename);
    if(bytes.length!==before.size||after.size!==before.size||after.mtimeMs!==before.mtimeMs||
       currentStat.isSymbolicLink()||currentStat.dev!==before.dev||currentStat.ino!==before.ino||
       currentStat.size!==before.size||currentStat.mtimeMs!==before.mtimeMs)deny();
    return bytes;
  }finally{fs.closeSync(fd);}
}
function jsonFile(file,max){
  let parsed;
  try{parsed=JSON.parse(safeExisting(file,'.json',max).toString('utf8'));}catch{deny();}
  return parsed;
}
function freshOutput(file,inputPaths){
  if(typeof file!=='string'||!path.isAbsolute(file)||!file.toLowerCase().endsWith('.json'))deny();
  const absolute=path.resolve(file);
  if(inputPaths.has(absolute)||fs.existsSync(absolute))deny();
  const parent=path.dirname(absolute),root=path.parse(parent).root;
  let current=root;
  for(const segment of path.relative(root,parent).split(path.sep)){
    if(!segment||segment==='.'||segment==='..')deny();
    current=path.join(current,segment);
    if(fs.lstatSync(current).isSymbolicLink())deny();
  }
  if(!fs.lstatSync(parent).isDirectory())deny();
  return absolute;
}
function reviewedCase(item,index,paths,hashes){
  if(!exact(item,['category','sourcePdf','outputPdf','reviewJson'])||!CATEGORY_IDS.includes(item.category))deny();
  const files=[item.sourcePdf,item.outputPdf,item.reviewJson];
  if(files.some(file=>typeof file!=='string'||!path.isAbsolute(file)))deny();
  for(const file of files){
    const absolute=path.resolve(file);
    if(paths.has(absolute))deny();
    paths.add(absolute);
  }
  const source=safeExisting(item.sourcePdf,'.pdf',MAX_PDF);
  const output=safeExisting(item.outputPdf,'.pdf',MAX_PDF);
  if(source.length<10||output.length<10||source.subarray(0,5).toString()!=='%PDF-'||
     output.subarray(0,5).toString()!=='%PDF-')deny();
  const sourceHash=sha(source),outputHash=sha(output);
  if(sourceHash===outputHash||hashes.has(sourceHash)||hashes.has(outputHash))deny();
  hashes.add(sourceHash);hashes.add(outputHash);
  const report=jsonFile(item.reviewJson,MAX_REVIEW);
  if(!isRecord(report)||report.format!==REVIEW_FORMAT||
     !HASH.test(report.sourceSha256)||!HASH.test(report.outputSha256)||
     report.sourceSha256!==sourceHash||report.outputSha256!==outputHash||
     report.ownerApproval!=='NOT_GRANTED'||report.contentFidelityCertified!==false||
     report.visualFidelityCertified!==false||report.originalSourceModified!==false||
     report.externalTransfer!==false||!Number.isInteger(report.sourcePages)||report.sourcePages<1||
     !Number.isInteger(report.outputPages)||report.outputPages<1||
     report.sourcePages>50||report.outputPages>50||
     !['RISK_SIGNALS_REVIEW_REQUIRED','LEXICAL_PARITY_NOT_FIDELITY_CERTIFIED'].includes(report.status)||
     !Array.isArray(report.issues)||report.issues.length>50||report.issues.some(v=>typeof v!=='string'||v.length>300)||
     !isRecord(report.manualVisualReview)||
     report.manualVisualReview.scope!=='LOCAL_VISUAL_CHECK_ONLY_NOT_SALE_APPROVAL'||
     !Array.isArray(report.manualVisualReview.items)||report.manualVisualReview.items.length!==7)deny();
  const byId=new Map();
  for(const entry of report.manualVisualReview.items){
    if(!exact(entry,['id','checked'])||!VISUAL_IDS.includes(entry.id)||
       typeof entry.checked!=='boolean'||byId.has(entry.id))deny();
    byId.set(entry.id,entry.checked);
  }
  if(VISUAL_IDS.some(id=>!byId.has(id)))deny();
  const checked=VISUAL_IDS.filter(id=>byId.get(id)===true).length;
  if(report.manualVisualReview.completed!==(checked===7))deny();
  const risk=report.issues.length>0||report.status==='RISK_SIGNALS_REVIEW_REQUIRED'||checked!==7;
  return Object.freeze({case:index+1,category:item.category,
    sourceSha256:sourceHash,outputSha256:outputHash,
    sourcePages:report.sourcePages,outputPages:report.outputPages,
    manualChecks:checked,issueCount:report.issues.length,
    status:risk?'REVIEW_HOLD':'SELF_REVIEW_COMPLETE_NOT_CERTIFIED'});
}
export function generateOwnerBatchEvidence(manifestPath,outputPath){
  const manifest=jsonFile(manifestPath,MAX_MANIFEST);
  if(!exact(manifest,['format','cases'])||manifest.format!==MANIFEST_FORMAT||
     !Array.isArray(manifest.cases)||manifest.cases.length<5||manifest.cases.length>10)deny();
  const paths=new Set([path.resolve(manifestPath)]),hashes=new Set();
  const cases=manifest.cases.map((item,index)=>reviewedCase(item,index,paths,hashes));
  // Rehash before writing to detect input mutation since initial reading.
  for(let i=0;i<manifest.cases.length;i++){
    const item=manifest.cases[i],v=cases[i];
    if(sha(safeExisting(item.sourcePdf,'.pdf',MAX_PDF))!==v.sourceSha256||
       sha(safeExisting(item.outputPdf,'.pdf',MAX_PDF))!==v.outputSha256)deny();
  }
  const output=freshOutput(outputPath,paths);
  const holds=cases.filter(c=>c.status==='REVIEW_HOLD').length;
  const evidence={format:EVIDENCE_FORMAT,version:1,
    totalCases:cases.length,reviewHoldCases:holds,
    status:holds?'REVIEW_HOLD':'ALL_LOCAL_SELF_REVIEWS_COMPLETE_NOT_CERTIFIED',
    cases,ownerApproval:'NOT_GRANTED',saleReady:false,
    originalSourceModified:false,externalTransfer:false,
    contentFidelityCertified:false,visualFidelityCertified:false,
    verificationScope:'SHA256_AND_SELF_REPORTED_SEVEN_ITEM_CHECKS_ONLY'};
  const fd=fs.openSync(output,fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_WRONLY,0o600);
  try{fs.writeFileSync(fd,JSON.stringify(evidence,null,2)+'\n');}finally{fs.closeSync(fd);}
  return evidence;
}
export function main(argv=process.argv.slice(2)){
  try{
    if(argv.length!==2)deny();
    const evidence=generateOwnerBatchEvidence(argv[0],argv[1]);
    process.stdout.write(JSON.stringify({status:evidence.status,cases:evidence.totalCases,
      holds:evidence.reviewHoldCases,ownerApproval:'NOT_GRANTED'})+'\n');
    return evidence.reviewHoldCases?2:0;
  }catch{
    process.stdout.write(JSON.stringify({status:'ASTRA_OWNER_BATCH_BLOCKED',ownerApproval:'NOT_GRANTED'})+'\n');
    return 1;
  }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)
  process.exitCode=main();
