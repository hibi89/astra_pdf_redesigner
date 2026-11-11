import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {makeMixedLayoutPdf} from './fixtures/step3-mixed-layout-pdf.mjs';
import {reviewPdfPair,generateOwnerPdfReview,createReviewHtml,main,REVIEW_FORMAT}
 from '../scripts/owner-pdf-source-output-review.mjs';

const sha=b=>createHash('sha256').update(b).digest('hex');
function fixture(){
 const source=makeMixedLayoutPdf(1);
 const project={format:'astra-local-document',formatVersion:1,
  document:{schemaVersion:2,content:{title:'synthetic',sections:[]}},assets:[]};
 const body=Buffer.from(JSON.stringify(project));
 const receipt={format:'astra-local-source-review-receipt',version:1,
  source_sha256:sha(source),source_size_bytes:source.length,
  project_content_sha256:sha(Buffer.from(JSON.stringify(project.document.content))),
  anchored_block_count:1,acknowledged_block_count:1,unacknowledged_block_count:0,
  stale_acknowledgement_count:0,unanchored_block_count:0,anchored_source_page_count:1,
  status:'ALL_ANCHORED_BLOCKS_ACKNOWLEDGED',source_fidelity_certified:false,
  owner_approval:'NOT_GRANTED',external_transfer:false,original_modified:false};
 return{source,project:body,receipt:Buffer.from(JSON.stringify(receipt)),
  output:makeMixedLayoutPdf(2)};
}
const mk=()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'astra-owner-qa-'));
 return{dir,close:()=>fs.rmSync(dir,{recursive:true,force:true})};};
function files(dir,f=fixture()){
 const names={receipt:path.join(dir,'original-review.json'),source:path.join(dir,'original.pdf'),
  project:path.join(dir,'project.localdoc.json'),output:path.join(dir,'redesigned.pdf'),
  jsonPath:path.join(dir,'NEW-review.json'),htmlPath:path.join(dir,'NEW-review.html'),
  outputSha256:sha(f.output)};
 for(const key of ['receipt','source','project','output'])fs.writeFileSync(names[key],f[key]);
 return names;
}
test('P71 source/project receipt and rendered output actual PDFs: hashes and token counts, no approval',async()=>{
 const f=fixture();
 const r=await reviewPdfPair(f.source,f.output,f.receipt,f.project,sha(f.output));
 assert.equal(r.format,REVIEW_FORMAT);
 assert.equal(r.source_pdf_pages,2);assert.equal(r.output_pdf_pages,2);
 assert.equal(r.source_pdf_sha256,sha(f.source));assert.equal(r.output_pdf_sha256,sha(f.output));
 assert.equal(r.missing_source_tokens,0);assert.equal(r.missing_numeric_tokens,0);
 assert.equal(r.extra_output_tokens,0);assert.equal(r.output_non_a4_pages,0);
 assert.equal(r.source_raster_draws,1);assert.equal(r.output_raster_draws,2);
 assert.equal(r.owner_sale_approval,'NOT_GRANTED');assert.equal(r.original_receipt_and_project_hashes_matched,true);
 assert.equal(r.exact_text_semantics,'NOT_CERTIFIED');
 assert.equal(r.layout_and_image_fidelity,'NOT_CERTIFIED');
 assert.equal(r.external_transfer,false);
});
test('P71 changed value in real output PDF flags missing token and missing numeric',async()=>{
 const f=fixture(),binary=f.output.toString('binary');
 assert.ok(binary.includes('STEP3_SOURCE_P2_END_913'));
 f.output=Buffer.from(binary.replace('STEP3_SOURCE_P2_END_913','STEP3_SOURCE_P2_END_998'),'binary');
 const r=await reviewPdfPair(f.source,f.output,f.receipt,f.project,sha(f.output));
 assert.ok(r.missing_source_tokens>0);
 assert.ok(r.missing_numeric_tokens>0);
 assert.ok(r.issues.includes('SOURCE_NUMERIC_TOKENS_NOT_FOUND'));
 assert.equal(r.status,'POTENTIAL_CONTENT_DIFFERENCES_REVIEW_REQUIRED');
 assert.equal(r.owner_sale_approval,'NOT_GRANTED');
});
test('P71 missing text in actual output flags omitted source token',async()=>{
 const f=fixture(),raw=f.output.toString('binary');
 f.output=Buffer.from(raw.replace('PAGE_TWO_TOKEN_912','PAGE_TWO_OMIT_999'),'binary');
 const r=await reviewPdfPair(f.source,f.output,f.receipt,f.project,sha(f.output));
 assert.ok(r.missing_source_tokens>0);
 assert.ok(r.issues.includes('SOURCE_TOKENS_NOT_FOUND_IN_OUTPUT'));
});
test('P71 non-A4 output only flags risk without corrupting source',async()=>{
 const f=fixture(),old=sha(f.source);
 f.output=Buffer.from(f.output.toString('binary')
  .replaceAll('/MediaBox [0 0 595 842]','/MediaBox [0 0 700 900]'),'binary');
 const r=await reviewPdfPair(f.source,f.output,f.receipt,f.project,sha(f.output));
 assert.equal(r.output_non_a4_pages,2);
 assert.ok(r.issues.includes('OUTPUT_NON_A4_PAGES'));
 assert.equal(sha(f.source),old);
});
test('P71 wrong independent output SHA is refused',async()=>{
 const f=fixture();
 await assert.rejects(reviewPdfPair(f.source,f.output,f.receipt,f.project,'0'.repeat(64)),/BLOCKED/);
});
test('P71 modified project after acknowledgement blocks evidence',async()=>{
 const f=fixture();const proj=JSON.parse(f.project.toString());
 proj.document.content.title='CHANGED_PRIVATE_VALUE';
 await assert.rejects(reviewPdfPair(f.source,f.output,f.receipt,Buffer.from(JSON.stringify(proj)),sha(f.output)),/BLOCKED/);
});
test('P71 original source PDF mutation without matching receipt blocks',async()=>{
 const f=fixture();
 const bad=Buffer.from(f.source.toString('binary').replace('TABLE_D_909','TABLE_D_999'),'binary');
 await assert.rejects(reviewPdfPair(bad,f.output,f.receipt,f.project,sha(f.output)),/BLOCKED/);
});
test('P71 same PDF bytes cannot masquerade as a redesign',async()=>{
 const f=fixture();
 await assert.rejects(reviewPdfPair(f.source,f.source,f.receipt,f.project,sha(f.source)),/BLOCKED/);
});
test('P71 forged source fidelity certification or approval blocks',async()=>{
 const f=fixture(),rec=JSON.parse(f.receipt.toString());
 rec.owner_approval='GRANTED';
 await assert.rejects(reviewPdfPair(f.source,f.output,Buffer.from(JSON.stringify(rec)),f.project,sha(f.output)),/BLOCKED/);
});
test('P72 owner reviewer writes only new offline JSON+HTML without raw source values or paths',async t=>{
 const tmp=mk();t.after(tmp.close);const f=fixture(),opts=files(tmp.dir,f);
 const inputs=Object.fromEntries(['receipt','source','project','output'].map(k=>[k,fs.readFileSync(opts[k])]));
 const r=await generateOwnerPdfReview(opts);
 assert.equal(r.format,REVIEW_FORMAT);
 const report=JSON.parse(fs.readFileSync(opts.jsonPath,'utf8'));
 assert.deepEqual(report,r);
 const html=fs.readFileSync(opts.htmlPath,'utf8');
 assert.match(html,/script-src 'none'/);
 assert.match(html,/connect-src 'none'/);
 assert.doesNotMatch(html,/<script/i);
 assert.doesNotMatch(html,/https?:\/\//);
 const data=html+fs.readFileSync(opts.jsonPath,'utf8');
 assert.ok(!data.includes(tmp.dir));
 assert.ok(!data.includes('STEP3_SOURCE_P1_BEGIN_901'));
 assert.ok(!data.includes('synthetic'));
 assert.ok(!data.includes('RUNNING_HEADER'));
 for(const key in inputs)assert.deepEqual(fs.readFileSync(opts[key]),inputs[key]);
});
test('P72 existing output refuses to overwrite either owner file',async t=>{
 const tmp=mk();t.after(tmp.close);const opts=files(tmp.dir);
 fs.writeFileSync(opts.jsonPath,'OWNER ORIGINAL FILE');
 await assert.rejects(generateOwnerPdfReview(opts),/BLOCKED/);
 assert.equal(fs.readFileSync(opts.jsonPath,'utf8'),'OWNER ORIGINAL FILE');
 assert.equal(fs.existsSync(opts.htmlPath),false);
});
test('P72 a second run never overwrites generated reports',async t=>{
 const tmp=mk();t.after(tmp.close);const opts=files(tmp.dir);
 await generateOwnerPdfReview(opts);const prior=fs.readFileSync(opts.jsonPath);
 await assert.rejects(generateOwnerPdfReview(opts),/BLOCKED/);
 assert.deepEqual(fs.readFileSync(opts.jsonPath),prior);
});
test('P72 linked source PDF or symlinked parent is rejected',async t=>{
 if(process.platform==='win32')return t.skip('Windows junction/symlink rights vary');
 const tmp=mk();t.after(tmp.close);const opts=files(tmp.dir),ln=path.join(tmp.dir,'alias.pdf');
 fs.symlinkSync(opts.source,ln);
 await assert.rejects(generateOwnerPdfReview({...opts,source:ln}),/BLOCKED/);
});
test('P72 invalid actual output PDF refuses report and preserves all owner input',async t=>{
 const tmp=mk();t.after(tmp.close);const opts=files(tmp.dir);
 fs.writeFileSync(opts.output,Buffer.from('%PDF-this-is-not-a-valid-document'));
 opts.outputSha256=sha(fs.readFileSync(opts.output));
 await assert.rejects(generateOwnerPdfReview(opts));
 assert.equal(fs.existsSync(opts.jsonPath),false);
 assert.equal(fs.existsSync(opts.htmlPath),false);
});
test('P72 refuses relative paths and wrong output suffix',async t=>{
 const tmp=mk();t.after(tmp.close);const opts=files(tmp.dir);
 await assert.rejects(generateOwnerPdfReview({...opts,source:'relative.pdf'}),/BLOCKED/);
 await assert.rejects(generateOwnerPdfReview({...opts,htmlPath:path.join(tmp.dir,'report.txt')}),/BLOCKED/);
 assert.equal(fs.existsSync(opts.jsonPath),false);
});
test('P72 approval cannot be forged into HTML from altered report',async()=>{
 const f=fixture(),r=await reviewPdfPair(f.source,f.output,f.receipt,f.project,sha(f.output));
 assert.throws(()=>createReviewHtml({...r,owner_sale_approval:'GRANTED'}),/BLOCKED/);
 assert.throws(()=>createReviewHtml({...r,external_transfer:true}),/BLOCKED/);
});
test('P73 CLI returns hashes/status not customer content; no overwrite on repeated call',async t=>{
 const tmp=mk();t.after(tmp.close);const opts=files(tmp.dir);
 const args=[opts.receipt,opts.source,opts.project,opts.output,opts.outputSha256,opts.jsonPath,opts.htmlPath];
 const written=[];const old=process.stdout.write;
 process.stdout.write=function(chunk){written.push(String(chunk));return true;};
 try{
  assert.equal(await main(args),0);
  assert.equal(await main(args),1);
 }finally{process.stdout.write=old;}
 assert.match(written[0],/NOT_GRANTED/);
 assert.doesNotMatch(written.join(''),/RUNNING_HEADER|STEP3_SOURCE|project\.localdoc\.json/);
 assert.equal(written.join('').includes(tmp.dir),false);
});
