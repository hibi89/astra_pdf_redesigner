import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync,writeFileSync,readFileSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const script=join(root,'scripts','verify-source-review.mjs');
const hash=(value:Buffer|string)=>createHash('sha256').update(value).digest('hex');
const source=Buffer.from('%PDF-1.4\nSYNTHETIC_SOURCE_PRIVATE_112\n%%EOF','utf8');
const project=()=>({format:'astra-local-document',formatVersion:1,
 document:{schemaVersion:2,content:{title:'SECRET_CUSTOMER_TITLE',sections:[]}},assets:[]});
const receipt=(proj=project())=>({
 format:'astra-local-source-review-receipt',version:1,
 source_sha256:hash(source),source_size_bytes:source.length,
 project_content_sha256:hash(JSON.stringify(proj.document.content)),
 anchored_block_count:2,acknowledged_block_count:1,unacknowledged_block_count:1,
 stale_acknowledgement_count:0,unanchored_block_count:1,anchored_source_page_count:2,
 status:'REVIEW_INCOMPLETE',source_fidelity_certified:false,
 owner_approval:'NOT_GRANTED',external_transfer:false,original_modified:false
});
function run(t:import('node:test').TestContext,modify?:(state:{
 receipt:ReturnType<typeof receipt>; source:Buffer; project:ReturnType<typeof project>;
})=>void){
 const dir=mkdtempSync(join(tmpdir(),'astra-review-verify-'));
 t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const state={receipt:receipt(),source:Buffer.from(source),project:project()};
 modify?.(state);
 const names=[join(dir,'review.json'),join(dir,'source.pdf'),join(dir,'backup.localdoc.json')];
 writeFileSync(names[0],JSON.stringify(state.receipt));
 writeFileSync(names[1],state.source);
 writeFileSync(names[2],JSON.stringify(state.project));
 const originals=names.map(x=>readFileSync(x));
 const result=spawnSync(process.execPath,[script,...names],{cwd:root,encoding:'utf8',timeout:10000});
 assert.deepEqual(names.map(x=>readFileSync(x)),originals,'Never rewrite local original/receipt/project');
 assert.doesNotMatch(result.stdout+result.stderr,/SECRET_CUSTOMER_TITLE|SYNTHETIC_SOURCE_PRIVATE|astra-review-verify-/, 'No private original text or path may be logged');
 return {result,report:JSON.parse(result.stdout),names,dir};
}
test('STEP7 independent offline verifier checks both original SHA and exact project content SHA',t=>{
 const {result,report}=run(t);
 assert.equal(result.status,0);
 assert.deepEqual(report,{status:'MATCHED_HASHES_NOT_FIDELITY_CERTIFIED',
  source_matches:true,project_content_matches:true,acknowledged_blocks:1,
  unacknowledged_blocks:1,source_fidelity_certified:false,manual_review_authenticated:false,
  owner_approval:'NOT_GRANTED',external_transfer:false,files_modified:false});
});
test('STEP7 one modified PDF byte is not accepted as matching the receipt',t=>{
 const {result,report}=run(t,x=>{x.source=Buffer.from(x.source);x.source[12]^=1;});
 assert.equal(result.status,2);assert.equal(report.status,'MISMATCH');
 assert.equal(report.source_matches,false);assert.equal(report.project_content_matches,true);
});
test('STEP7 modified project body fails content hash without exposing contents',t=>{
 const {result,report}=run(t,x=>{x.project.document.content.title='ALTERED_PRIVATE_VALUE';});
 assert.equal(result.status,2);assert.equal(report.source_matches,true);
 assert.equal(report.project_content_matches,false);
});
test('STEP7 forged certificate, approval and impossible review counts are blocked',t=>{
 const mutants=[
  x=>{(x.receipt as any).owner_approval='GRANTED';},
  x=>{(x.receipt as any).source_fidelity_certified=true;},
  x=>{x.receipt.anchored_block_count=0;},
  x=>{x.receipt.stale_acknowledgement_count=99;},
  x=>{(x.receipt as any).extra='injected';},
  x=>{(x.receipt as any).status='ALL_ANCHORED_BLOCKS_ACKNOWLEDGED';}
 ];
 for(const [i,change] of mutants.entries()){
  const {result,report}=run(t,x=>change(x));
  assert.equal(result.status,1,'mutation '+i);
  assert.equal(report.status,'SOURCE_RECEIPT_VERIFICATION_BLOCKED');
 }
});
test('STEP7 local source symlink or missing arguments are rejected',t=>{
 const {names,dir}=run(t);
 const alias=join(dir,'alias.pdf');
 try{symlinkSync(names[1],alias)}catch{return t.skip('Symlink is not available');}
 const result=spawnSync(process.execPath,[script,names[0],alias,names[2]],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,1);
 assert.equal(JSON.parse(result.stdout).status,'SOURCE_RECEIPT_VERIFICATION_BLOCKED');
 const missing=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8'});
 assert.equal(missing.status,1);
});
