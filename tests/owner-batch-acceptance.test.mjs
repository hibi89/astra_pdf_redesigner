import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {generateOwnerBatchEvidence,MANIFEST_FORMAT,EVIDENCE_FORMAT} from '../scripts/owner-batch-acceptance.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const items=['text','numbers','tables','images','pagination','typography','clipping'];
function fixture(){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'astra-owner-batch-'));
  const cases=[];
  for(let i=0;i<5;i++){
    // Synthetic, PDF-header-only bytes: tests do not attest valid PDF rendering.
    const source=Buffer.from('%PDF-1.4\nFAKE-SYNTHETIC-SOURCE-PRIVATE-'+i+'\n');
    const output=Buffer.from('%PDF-1.4\nFAKE-SYNTHETIC-OUTPUT-PRIVATE-'+i+'\n');
    const sourcePdf=path.join(dir,'customer-private-'+i+'.pdf');
    const outputPdf=path.join(dir,'finished-private-'+i+'.pdf');
    const reviewJson=path.join(dir,'review-private-'+i+'.json');
    fs.writeFileSync(sourcePdf,source);fs.writeFileSync(outputPdf,output);
    const review={format:'astra-step7-local-pdf-parity-v1',
      sourceSha256:hash(source),outputSha256:hash(output),sourcePages:1,outputPages:1,
      status:'LEXICAL_PARITY_NOT_FIDELITY_CERTIFIED',issues:[],
      ownerApproval:'NOT_GRANTED',contentFidelityCertified:false,visualFidelityCertified:false,
      originalSourceModified:false,externalTransfer:false,
      manualVisualReview:{scope:'LOCAL_VISUAL_CHECK_ONLY_NOT_SALE_APPROVAL',completed:true,
        items:items.map(id=>({id,checked:true}))}};
    fs.writeFileSync(reviewJson,JSON.stringify(review));
    cases.push({category:['text','table','image','mixed','korean'][i],sourcePdf,outputPdf,reviewJson});
  }
  const manifest=path.join(dir,'manifest.json');
  fs.writeFileSync(manifest,JSON.stringify({format:MANIFEST_FORMAT,cases}));
  return {dir,cases,manifest,output:path.join(dir,'evidence.json'),
    close:()=>fs.rmSync(dir,{recursive:true,force:true})};
}
test('five SHA-linked owner self-reviews create path-free evidence, never seller approval',()=>{
  const f=fixture();
  try{
    const x=generateOwnerBatchEvidence(f.manifest,f.output);
    assert.equal(x.format,EVIDENCE_FORMAT);
    assert.equal(x.status,'ALL_LOCAL_SELF_REVIEWS_COMPLETE_NOT_CERTIFIED');
    assert.equal(x.totalCases,5);assert.equal(x.reviewHoldCases,0);
    assert.equal(x.ownerApproval,'NOT_GRANTED');assert.equal(x.saleReady,false);
    assert.equal(x.contentFidelityCertified,false);
    const output=fs.readFileSync(f.output,'utf8');
    assert.ok(!output.includes(f.dir));
    assert.doesNotMatch(output,/customer-private|finished-private|FAKE-SYNTHETIC|review-private/);
    assert.throws(()=>generateOwnerBatchEvidence(f.manifest,f.output),/ASTRA_OWNER_BATCH_BLOCKED/);
  }finally{f.close();}
});
test('source or output bytes changed after GUI SHA receipt refuses the batch',()=>{
  const f=fixture();
  try{
    fs.appendFileSync(f.cases[2].sourcePdf,'TAMPER');
    assert.throws(()=>generateOwnerBatchEvidence(f.manifest,f.output),/ASTRA_OWNER_BATCH_BLOCKED/);
    assert.equal(fs.existsSync(f.output),false);
  }finally{f.close();}
});
test('missing visual check and reported image risk force REVIEW_HOLD rather than PASS',()=>{
  const f=fixture();
  try{
    const file=f.cases[3].reviewJson,r=JSON.parse(fs.readFileSync(file,'utf8'));
    r.manualVisualReview.items.find(x=>x.id==='images').checked=false;
    r.manualVisualReview.completed=false;
    r.status='RISK_SIGNALS_REVIEW_REQUIRED';r.issues=['이미지 수 다름'];
    fs.writeFileSync(file,JSON.stringify(r));
    const result=generateOwnerBatchEvidence(f.manifest,f.output);
    assert.equal(result.status,'REVIEW_HOLD');
    assert.equal(result.reviewHoldCases,1);
    assert.equal(result.cases[3].manualChecks,6);
    assert.equal(result.saleReady,false);
  }finally{f.close();}
});
test('forged claim of approved sale and mismatched checked flag are rejected',()=>{
  const f=fixture();
  try{
    const file=f.cases[0].reviewJson,r=JSON.parse(fs.readFileSync(file,'utf8'));
    r.ownerApproval='GRANTED';fs.writeFileSync(file,JSON.stringify(r));
    assert.throws(()=>generateOwnerBatchEvidence(f.manifest,f.output),/ASTRA_OWNER_BATCH_BLOCKED/);
    r.ownerApproval='NOT_GRANTED';r.manualVisualReview.completed=false;
    fs.writeFileSync(file,JSON.stringify(r));
    assert.throws(()=>generateOwnerBatchEvidence(f.manifest,f.output),/ASTRA_OWNER_BATCH_BLOCKED/);
  }finally{f.close();}
});
test('symlink and a manifest of fewer than five cases are rejected',()=>{
  const f=fixture();
  try{
    const old=JSON.parse(fs.readFileSync(f.manifest,'utf8'));
    fs.writeFileSync(f.manifest,JSON.stringify({...old,cases:old.cases.slice(0,4)}));
    assert.throws(()=>generateOwnerBatchEvidence(f.manifest,f.output),/ASTRA_OWNER_BATCH_BLOCKED/);
    fs.writeFileSync(f.manifest,JSON.stringify(old));
    if(process.platform!=='win32'){
      const link=path.join(f.dir,'alias.pdf');
      fs.symlinkSync(f.cases[0].sourcePdf,link);
      old.cases[0].sourcePdf=link;
      fs.writeFileSync(f.manifest,JSON.stringify(old));
      assert.throws(()=>generateOwnerBatchEvidence(f.manifest,f.output),/ASTRA_OWNER_BATCH_BLOCKED/);
    }
  }finally{f.close();}
});
