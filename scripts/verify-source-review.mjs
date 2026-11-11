// Offline independent ASTRA source-review receipt cross-check: hashes only, no extracted text output.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const limit=Object.freeze({pdf:30*1024*1024,receipt:16*1024,project:100*1024*1024});
const fail=()=>{throw Error('SOURCE_RECEIPT_VERIFICATION_BLOCKED');};
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const exact=(x,keys)=>isObj(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const readStrict=(filename,extension,max)=>{
 if(typeof filename!=='string'||!path.isAbsolute(filename)||!filename.toLowerCase().endsWith(extension))fail();
 const resolved=path.resolve(filename),root=path.parse(resolved).root;
 const parts=path.relative(root,resolved).split(path.sep);let walk=root;
 for(const part of parts){if(!part||part==='.'||part==='..')fail();walk=path.join(walk,part);
  if(fs.lstatSync(walk).isSymbolicLink())fail();}
 const stat=fs.lstatSync(resolved);
 if(!stat.isFile()||stat.size<1||stat.size>max)fail();
 const fd=fs.openSync(resolved,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW??0));
 try{const before=fs.fstatSync(fd);
  if(!before.isFile()||before.size!==stat.size||before.dev!==stat.dev||before.ino!==stat.ino)fail();
  const bytes=fs.readFileSync(fd);
  const after=fs.fstatSync(fd),present=fs.lstatSync(resolved);
  if(bytes.length!==before.size||after.size!==before.size||after.mtimeMs!==before.mtimeMs||
     present.isSymbolicLink()||present.dev!==before.dev||present.ino!==before.ino||
     present.size!==before.size||present.mtimeMs!==before.mtimeMs)fail();
  return bytes;
 }finally{fs.closeSync(fd);}
};
const decode=bytes=>new TextDecoder('utf-8',{fatal:true}).decode(bytes);
function parseJson(bytes){
 try{return JSON.parse(decode(bytes));}catch{fail();}
}
const receiptKeys=['format','version','source_sha256','source_size_bytes','project_content_sha256',
 'anchored_block_count','acknowledged_block_count','unacknowledged_block_count',
 'stale_acknowledgement_count','unanchored_block_count','anchored_source_page_count',
 'status','source_fidelity_certified','owner_approval','external_transfer','original_modified'];
const count=x=>Number.isSafeInteger(x)&&x>=0;
export function verifyReviewReceiptBytes(receiptBytes,sourceBytes,projectBytes){
 const receipt=parseJson(receiptBytes),project=parseJson(projectBytes);
 if(!exact(receipt,receiptKeys)||
    receipt.format!=='astra-local-source-review-receipt'||receipt.version!==1||
    !/^[a-f0-9]{64}$/.test(receipt.source_sha256)||
    !/^[a-f0-9]{64}$/.test(receipt.project_content_sha256)||
    !count(receipt.source_size_bytes)||!count(receipt.anchored_block_count)||
    !count(receipt.acknowledged_block_count)||!count(receipt.unacknowledged_block_count)||
    !count(receipt.stale_acknowledgement_count)||!count(receipt.unanchored_block_count)||
    !count(receipt.anchored_source_page_count)||
    receipt.acknowledged_block_count+receipt.unacknowledged_block_count!==receipt.anchored_block_count||
    receipt.stale_acknowledgement_count>receipt.unacknowledged_block_count||
    receipt.anchored_source_page_count>receipt.anchored_block_count||
    receipt.status!==(receipt.anchored_block_count>0 && receipt.unacknowledged_block_count===0?
       'ALL_ANCHORED_BLOCKS_ACKNOWLEDGED':'REVIEW_INCOMPLETE')||
    receipt.source_fidelity_certified!==false||receipt.owner_approval!=='NOT_GRANTED'||
    receipt.external_transfer!==false||receipt.original_modified!==false)fail();
 if(!exact(project,['format','formatVersion','document','assets'])||
    project.format!=='astra-local-document'||project.formatVersion!==1||
    !isObj(project.document)||project.document.schemaVersion!==2||
    !isObj(project.document.content))fail();
 if(!Buffer.isBuffer(sourceBytes)||sourceBytes.length>limit.pdf||
    sourceBytes.subarray(0,5).toString()!=='%PDF-')fail();
 const sourceMatches=sourceBytes.length===receipt.source_size_bytes &&
   sha(sourceBytes)===receipt.source_sha256;
 const projectContentMatches=sha(Buffer.from(JSON.stringify(project.document.content),'utf8'))===receipt.project_content_sha256;
 return Object.freeze({
  status:sourceMatches&&projectContentMatches?'MATCHED_HASHES_NOT_FIDELITY_CERTIFIED':'MISMATCH',
  source_matches:sourceMatches,project_content_matches:projectContentMatches,
  acknowledged_blocks:receipt.acknowledged_block_count,
  unacknowledged_blocks:receipt.unacknowledged_block_count,
  source_fidelity_certified:false,manual_review_authenticated:false,
  owner_approval:'NOT_GRANTED',external_transfer:false,files_modified:false
 });
}
export function main(argv=process.argv.slice(2)){
 try{
  if(!Array.isArray(argv)||argv.length!==3)fail();
  const files=[readStrict(argv[0],'.json',limit.receipt),
    readStrict(argv[1],'.pdf',limit.pdf),readStrict(argv[2],'.json',limit.project)];
  const report=verifyReviewReceiptBytes(...files);
  process.stdout.write(JSON.stringify(report)+'\n');
  return report.status==='MISMATCH'?2:0;
 }catch{
  process.stdout.write(JSON.stringify({status:'SOURCE_RECEIPT_VERIFICATION_BLOCKED',source_fidelity_certified:false})+'\n');
  return 1;
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)process.exitCode=main();
