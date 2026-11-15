// G002 independent bridge from ASTRA STEP2 exported V2 project + STEP7 receipt
// to actual PDF.js source/output structural comparison.
// Works only on in-memory Buffer inputs: never log or persist a document payload.
import {createHash} from 'node:crypto';
import {verifyReviewReceiptBytes} from '../scripts/verify-source-review.mjs';
import {inspectRealPdfPair} from './gpt-final-qa-real-pdfjs-parity.mjs';

const MAX_PROJECT_BYTES=100*1024*1024;
const MAX_RECEIPT_BYTES=16*1024;
const MAX_BLOCKS=3000;
const MAX_SECTIONS=200;
const MAX_TEXT=500_000;
const SHA=b=>createHash('sha256').update(b).digest('hex');
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const fail=()=>{throw Error('G002_PROJECT_PDFJS_BRIDGE_BLOCKED');};
const hasOnly=(o,keys)=>record(o)&&Object.keys(o).every(x=>keys.includes(x));
const text=(x,max=MAX_TEXT)=>typeof x==='string'&&x.length<=max&&!x.includes('\0');
const ident=x=>text(x,150)&&x.length>0;
const coord=o=>record(o)&&Number.isSafeInteger(o.page)&&o.page>=1&&o.page<=50&&
  ['x','y','width','height'].every(k=>typeof o[k]==='number'&&Number.isFinite(o[k])&&o[k]>=0&&o[k]<=100000);
function parseSafeBytes(bytes,limit) {
  if(!Buffer.isBuffer(bytes)||!bytes.length||bytes.length>limit)fail();
  try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}
  catch{fail();}
}
function extractExportedProject(projectBytes) {
  const x=parseSafeBytes(projectBytes,MAX_PROJECT_BYTES);
  if(!hasOnly(x,['format','formatVersion','document','assets'])||
     x.format!=='astra-local-document'||x.formatVersion!==1||!record(x.document)||
     x.document.schemaVersion!==2||!ident(x.document.id)||!record(x.document.content)||
     !Array.isArray(x.document.content.sections)||x.document.content.sections.length>MAX_SECTIONS||
     !Array.isArray(x.assets)||x.assets.length>MAX_BLOCKS)fail();
  const sections=x.document.content.sections;
  const allIds=new Set(),anchors=[],rows=[];
  let blocks=0,imageCount=0,unanchoredCount=0;
  const assetIds=new Set();
  for(const section of sections) {
    if(!ident(section.id)||allIds.has(section.id)||!text(section.title,2000)||
       !Array.isArray(section.blocks))fail();
    allIds.add(section.id);
    for(const block of section.blocks) {
      blocks++;
      if(blocks>MAX_BLOCKS||!record(block)||!ident(block.id)||allIds.has(block.id))fail();
      allIds.add(block.id);
      if(block.origin!==undefined&&!coord(block.origin))fail();
      if(block.kind==='image'){
        if(!ident(block.assetId)||!text(block.caption)||!['small','medium','large'].includes(block.size)||
           !['left','center','right'].includes(block.alignment))fail();
        imageCount++;assetIds.add(block.assetId);
        if(block.origin)anchors.push({page:block.origin.page,kind:'image'});
        else unanchoredCount++;
      }else if(['heading','paragraph','caption'].includes(block.kind)){
        if(!text(block.text))fail();
        if(block.origin){
          anchors.push({page:block.origin.page,kind:block.kind});
          if(block.text.trim())rows.push(block.text);
        }else unanchoredCount++;
      }else fail();
    }
  }
  if(x.assets.length!==assetIds.size)fail();
  for(const asset of x.assets){
    if(!record(asset)||!ident(asset.id)||!assetIds.has(asset.id)||
       !['image/png','image/jpeg','image/webp'].includes(asset.mimeType)||
       !Number.isSafeInteger(asset.byteSize)||asset.byteSize<1||asset.byteSize>10*1024*1024||
       !Number.isSafeInteger(asset.width)||!Number.isSafeInteger(asset.height)||
       asset.width<1||asset.height<1||!text(asset.base64,15*1024*1024))fail();
    // Validate that bytes associated with the declared image ID really exist.
    if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(asset.base64)||
       Buffer.from(asset.base64,'base64').length!==asset.byteSize)fail();
  }
  if(anchors.length<1||rows.length<1)fail();
  const pageOrder=anchors.map(a=>a.page);
  return {
    importedText:rows.join(' '),
    anchoredCount:anchors.length,
    anchoredTextCount:rows.length,
    anchoredImageCount:anchors.filter(x=>x.kind==='image').length,
    unanchoredCount,
    pagesReferenced:[...new Set(pageOrder)].sort((a,b)=>a-b),
    anchorPageInversions:pageOrder.slice(1).filter((p,i)=>p<pageOrder[i]).length,
    projectContentSha256:SHA(Buffer.from(JSON.stringify(x.document.content),'utf8')),
    projectExportSha256:SHA(projectBytes)
  };
}

export async function inspectStep2V2ExportPdfParity({
  sourcePdfBefore,sourcePdfAfter,outputPdf,projectExportBytes,reviewReceiptBytes,
}={}) {
  const project=extractExportedProject(projectExportBytes);
  const receipt=parseSafeBytes(reviewReceiptBytes,MAX_RECEIPT_BYTES);
  // Existing product receipt contract cross-check binds raw PDF + full V2
  // exported document.content hash, but is not proof user actually inspected it.
  let checked;
  try{checked=verifyReviewReceiptBytes(reviewReceiptBytes,sourcePdfBefore,projectExportBytes);}
  catch{fail();}
  if(checked.status!=='MATCHED_HASHES_NOT_FIDELITY_CERTIFIED'||
     checked.acknowledged_blocks!==project.anchoredCount||
     checked.unacknowledged_blocks!==0||
     receipt.unanchored_block_count!==project.unanchoredCount||
     receipt.owner_approval!=='NOT_GRANTED'||receipt.source_fidelity_certified!==false)fail();
  const parsed=await inspectRealPdfPair({
    sourcePdfBefore,sourcePdfAfter,outputPdf,
    importedText:project.importedText,
    expectedTableRows:[],
  });
  const issues=[...parsed.issues];
  if(project.anchorPageInversions>0)issues.push('PROJECT_ORIGIN_PAGE_ORDER_REVERSED');
  if(project.pagesReferenced.some(x=>x>parsed.sourcePages))issues.push('PROJECT_ANCHOR_PAGE_OUTSIDE_SOURCE');
  if(parsed.rasterSource>0&&project.anchoredImageCount===0)
    issues.push('SOURCE_RASTER_HAS_NO_ANCHORED_PROJECT_IMAGE');
  if(project.unanchoredCount>0)issues.push('UNANCHORED_PROJECT_BLOCKS_MANUAL_REVIEW');
  if(parsed.sourcePages>0&&project.pagesReferenced.length<parsed.sourcePages)
    issues.push('SOURCE_PAGES_WITHOUT_ANCHORED_PROJECT_BLOCKS');
  return Object.freeze({
    schema:'astra-g002-step2-export-pdfjs-review-v1',
    status:issues.length?'PROJECT_SOURCE_OUTPUT_DIFFERENCES_REVIEW_REQUIRED':
      'PROJECT_PDFJS_PARITY_MANUAL_REVIEW_REQUIRED',
    issues:[...new Set(issues)],
    projectExportSha256:project.projectExportSha256,
    projectContentSha256:project.projectContentSha256,
    sourcePdfSha256:parsed.sourcePdfSha256Before,
    outputPdfSha256:parsed.outputPdfSha256,
    sourcePages:parsed.sourcePages,outputPages:parsed.outputPages,
    anchoredBlocks:project.anchoredCount,anchoredTextBlocks:project.anchoredTextCount,
    anchoredImageBlocks:project.anchoredImageCount,unanchoredBlocks:project.unanchoredCount,
    acknowledgedBlocksClaimed:checked.acknowledged_blocks,
    sourceReceiptContentHashMatched:checked.project_content_matches,
    sourceReceiptPdfHashMatched:checked.source_matches,
    provenance:'SIGNED_DOCUMENT_NOT_VERIFIED_RECEIPT_IS_SELF_REPORTED',
    storeReadAuthenticity:'EXPORTED_V2_DOCUMENT_NOT_LIVE_INDEXEDDB',
    actualSourceTextSemantics:'NOT_CERTIFIED',
    imageTableGeometry:'NOT_VERIFIED',
    originalModified:parsed.sourcePdfSha256Before!==parsed.sourcePdfSha256After,
    externalTransfer:false,
    ownerApproval:'NOT_GRANTED',
    buyerAcceptance:'UNASSESSED',
    release:'RELEASE HOLD',
    scoreDelta:0,
  });
}
