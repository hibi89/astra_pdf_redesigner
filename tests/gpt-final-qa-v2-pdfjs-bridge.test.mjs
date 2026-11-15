import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {makeMixedLayoutPdf} from './fixtures/step3-mixed-layout-pdf.mjs';
import {inspectStep2V2ExportPdfParity} from '../tools/gpt-final-qa-v2-pdfjs-bridge.mjs';

const sha=b=>createHash('sha256').update(b).digest('hex');
const toBytes=x=>Buffer.from(JSON.stringify(x),'utf8');
async function splitText(pdfBytes) {
  const task=getDocument({data:new Uint8Array(pdfBytes),useSystemFonts:true,disableFontFace:true});
  try {
    const doc=await task.promise;
    const result=[];
    for(let i=1;i<=doc.numPages;i++) {
      const page=await doc.getPage(i);
      result.push((await page.getTextContent()).items.filter(x=>typeof x.str==='string').map(x=>x.str).join(' '));
      page.cleanup();
    }
    return result;
  }finally{await task.destroy();}
}
async function setup() {
  const source=makeMixedLayoutPdf(1),parts=await splitText(source);
  const content={title:'synthetic V2 original',author:'',date:'2026-11-15',
    sections:parts.map((part,i)=>({
      id:'section-'+i,title:'',blocks:[{id:'block-'+i,kind:'paragraph',text:part,
        origin:{page:i+1,x:40,y:40,width:400,height:700}}]
    }))};
  const document={schemaVersion:2,id:'test-document',name:'synthetic',createdAt:'2026-11-15T00:00:00Z',
    updatedAt:'2026-11-15T00:00:00Z',content,
    design:{theme:'report',accent:'#123456',font:'sans',textSize:'medium'}};
  const project={format:'astra-local-document',formatVersion:1,document,assets:[]};
  const receipt={
    format:'astra-local-source-review-receipt',version:1,
    source_sha256:sha(source),source_size_bytes:source.length,
    project_content_sha256:sha(toBytes(content)),
    anchored_block_count:2,acknowledged_block_count:2,unacknowledged_block_count:0,
    stale_acknowledgement_count:0,unanchored_block_count:0,anchored_source_page_count:2,
    status:'ALL_ANCHORED_BLOCKS_ACKNOWLEDGED',
    source_fidelity_certified:false,owner_approval:'NOT_GRANTED',
    external_transfer:false,original_modified:false,
  };
  const args=()=>({
    sourcePdfBefore:Buffer.from(source),sourcePdfAfter:Buffer.from(source),
    outputPdf:makeMixedLayoutPdf(2),projectExportBytes:toBytes(project),reviewReceiptBytes:toBytes(receipt),
  });
  return {source,project,receipt,args,bytes:toBytes};
}
test('G002 bridge consumes real product V2 export with bound receipt and PDF.js; no buyer approval',async()=>{
  const {args,project,receipt}=await setup();
  const report=await inspectStep2V2ExportPdfParity(args());
  assert.equal(report.schema,'astra-g002-step2-export-pdfjs-review-v1');
  assert.equal(report.anchoredBlocks,2);
  assert.equal(report.acknowledgedBlocksClaimed,2);
  assert.equal(report.sourcePages,2);
  assert.equal(report.sourceReceiptPdfHashMatched,true);
  assert.equal(report.projectContentSha256,receipt.project_content_sha256);
  assert.equal(report.storeReadAuthenticity,'EXPORTED_V2_DOCUMENT_NOT_LIVE_INDEXEDDB');
  assert.ok(report.issues.includes('RASTER_DRAW_COUNT_CHANGED'));
  assert.ok(report.issues.includes('SOURCE_RASTER_HAS_NO_ANCHORED_PROJECT_IMAGE'));
  assert.equal(report.ownerApproval,'NOT_GRANTED');
  assert.equal(report.buyerAcceptance,'UNASSESSED');
  assert.equal(report.release,'RELEASE HOLD');
  assert.equal(report.scoreDelta,0);
  assert.equal(project.document.content.sections.length,2);
});
test('G002 bridge refuses modified text after acknowledgement without uploading data',async()=>{
  const {args,project,bytes}=await setup();
  project.document.content.sections[0].blocks[0].text+='PRIVATE_NUMBER_999';
  await assert.rejects(inspectStep2V2ExportPdfParity({...args(),projectExportBytes:bytes(project)}),
    /G002_PROJECT_PDFJS_BRIDGE_BLOCKED/);
});
test('G002 bridge refuses modified original PDF before receipt verification',async()=>{
  const {args,source}=await setup();
  const modified=Buffer.from(source.toString('binary').replace('TABLE_A_906','TABLE_A_999'),'binary');
  await assert.rejects(inspectStep2V2ExportPdfParity({...args(),sourcePdfBefore:modified}),
    /G002_PROJECT_PDFJS_BRIDGE_BLOCKED/);
});
test('G002 bridge catches post-review original PDF modification',async()=>{
  const {args,source}=await setup();
  const changed=Buffer.concat([source,Buffer.from('\n%owner-extra')]);
  const r=await inspectStep2V2ExportPdfParity({...args(),sourcePdfAfter:changed});
  assert.equal(r.originalModified,true);
  assert.ok(r.issues.includes('ORIGINAL_PDF_BYTES_CHANGED'));
});
test('G002 bridge catches output numeric corruption using actual PDF.js extraction',async()=>{
  const {args}=await setup();
  const normal=makeMixedLayoutPdf(1).toString('binary');
  const bad=Buffer.from(normal.replace('TABLE_D_909','TABLE_D_999'),'binary');
  const r=await inspectStep2V2ExportPdfParity({...args(),outputPdf:bad});
  assert.ok(r.issues.includes('SOURCE_OUTPUT_NUMERIC_DIFFERENCE'));
});
test('G002 bridge detects that project text block order contradicts original PDF page anchors',async()=>{
  const {args,project,receipt,bytes}=await setup();
  project.document.content.sections.reverse();
  receipt.project_content_sha256=sha(bytes(project.document.content));
  const r=await inspectStep2V2ExportPdfParity({...args(),
    projectExportBytes:bytes(project),reviewReceiptBytes:bytes(receipt)});
  assert.ok(r.issues.includes('PROJECT_ORIGIN_PAGE_ORDER_REVERSED'));
  assert.ok(r.issues.includes('SOURCE_IMPORT_TEXT_DIFFERENCE'));
});
test('G002 bridge refuses fake acknowledgement count or omitted review',async()=>{
  const {args,receipt,bytes}=await setup();
  receipt.acknowledged_block_count=1;
  receipt.unacknowledged_block_count=1;
  receipt.status='REVIEW_INCOMPLETE';
  await assert.rejects(inspectStep2V2ExportPdfParity({...args(),reviewReceiptBytes:bytes(receipt)}),
    /G002_PROJECT_PDFJS_BRIDGE_BLOCKED/);
});
test('G002 bridge refuses phantom image references without real local backup asset bytes',async()=>{
  const {args,project,receipt,bytes}=await setup();
  project.document.content.sections[0].blocks.push({
    id:'image-1',kind:'image',assetId:'not-saved',caption:'',alignment:'left',size:'small',
    origin:{page:1,x:80,y:330,width:140,height:100}
  });
  receipt.anchored_block_count=3;receipt.acknowledged_block_count=3;
  receipt.project_content_sha256=sha(bytes(project.document.content));
  await assert.rejects(inspectStep2V2ExportPdfParity({...args(),
    projectExportBytes:bytes(project),reviewReceiptBytes:bytes(receipt)}),/G002_PROJECT_PDFJS_BRIDGE_BLOCKED/);
});
test('G002 bridge refuses duplicate project block IDs even with self-consistent forged receipt',async()=>{
  const {args,project,receipt,bytes}=await setup();
  project.document.content.sections[1].blocks[0].id=project.document.content.sections[0].blocks[0].id;
  receipt.project_content_sha256=sha(bytes(project.document.content));
  await assert.rejects(inspectStep2V2ExportPdfParity({...args(),
    projectExportBytes:bytes(project),reviewReceiptBytes:bytes(receipt)}),/G002_PROJECT_PDFJS_BRIDGE_BLOCKED/);
});
test('G002 bridge discloses only risk codes and hashes, not source text or file paths',async()=>{
  const {args}=await setup();
  const serialized=JSON.stringify(await inspectStep2V2ExportPdfParity(args()));
  for(const value of ['RUNNING_HEADER_P1_914','STEP3_SOURCE_P2_BEGIN_911',
    'TABLE_D_909','synthetic V2 original','/mnt/data/private'])assert.ok(!serialized.includes(value));
  assert.ok(serialized.includes('EXPORTED_V2_DOCUMENT_NOT_LIVE_INDEXEDDB'));
});
