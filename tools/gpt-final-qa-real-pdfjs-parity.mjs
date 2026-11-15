// G002 follow-up: independent PDF.js read of both actual PDF byte streams.
// Do not use customer files in GitHub Actions. Owner inputs must remain local.
// This is a conservative structural DIFFERENCE REPORT, never auto-approval.
import {createHash} from 'node:crypto';
import {getDocument,OPS} from 'pdfjs-dist/legacy/build/pdf.mjs';
import fidelity from './gpt-final-qa-text-fidelity.cjs';

const {checkSnapshots}=fidelity;
const MAX_BYTES=32*1024*1024;
const MAX_PAGES=30;
const MAX_OUTPUT_CHARS=2_000_000;
const PICTURE_OPS=new Set([
  OPS.paintImageXObject,OPS.paintInlineImageXObject,OPS.paintImageXObjectRepeat,
  OPS.paintInlineImageXObjectGroup,OPS.paintImageMaskXObject,
  OPS.paintImageMaskXObjectGroup,OPS.paintImageMaskXObjectRepeat,
]);
// PDF.js batches PDF m/l/re commands as OPS.constructPath; do not equate with rendered strokes.
const VECTOR_OPS=new Set([OPS.constructPath,OPS.stroke,OPS.closeStroke,OPS.fillStroke,OPS.eoFillStroke,
  OPS.closeFillStroke,OPS.closeEOFillStroke]);
const hash=b=>createHash('sha256').update(b).digest('hex');
const norm=s=>s.normalize('NFC').replace(/\s+/gu,' ').trim();

function requireBytes(bytes) {
  if(!Buffer.isBuffer(bytes)||bytes.length<24||bytes.length>MAX_BYTES||
     bytes.toString('ascii',0,5)!=='%PDF-')throw Error('G002_INVALID_PDF_INPUT');
}
async function pdfFacts(bytes){
  requireBytes(bytes);
  let task;
  try{
    task=getDocument({data:new Uint8Array(bytes),useSystemFonts:true,disableFontFace:true});
    const document=await task.promise;
    if(document.numPages<1||document.numPages>MAX_PAGES)throw Error('G002_PAGE_LIMIT');
    const pages=[];
    let allChars=0;
    for(let i=1;i<=document.numPages;i++){
      const page=await document.getPage(i),view=page.getViewport({scale:1});
      const items=(await page.getTextContent()).items.filter(x=>typeof x.str==='string'&&x.str.length);
      const content=items.map(x=>x.str).join(' ');
      allChars+=content.length;
      if(allChars>MAX_OUTPUT_CHARS)throw Error('G002_TEXT_LIMIT');
      let clipped=0,rotated=0;
      for(const item of items) {
        const t=item.transform;
        if(!Array.isArray(t)||t.length<6||!t.slice(0,6).every(Number.isFinite)) {clipped++;continue;}
        if(Math.abs(t[1])>0.05||Math.abs(t[2])>0.05){rotated++;continue;}
        const x=t[4],right=x+Number(item.width),bottom=view.height-t[5],
          top=bottom-Number(item.height);
        if(![x,right,bottom,top].every(Number.isFinite)||x < -3||right>view.width+3||
           top < -3||bottom>view.height+3)clipped++;
      }
      const operators=(await page.getOperatorList()).fnArray;
      pages.push({
        text:norm(content),
        isA4:Math.abs(view.width-595.276)<2&&Math.abs(view.height-841.89)<2,
        clipped,rotated,empty:items.length===0,
        raster:operators.filter(op=>PICTURE_OPS.has(op)).length,
        vector:operators.filter(op=>VECTOR_OPS.has(op)).length,
      });
      page.cleanup();
    }
    return pages;
  }finally{
    if(task)await task.destroy().catch(()=>{});
  }
}
export async function inspectRealPdfPair({
  sourcePdfBefore,sourcePdfAfter,outputPdf,importedText,expectedTableRows=[],
}={}) {
  // Do not pass PDF.js exception strings to reports; some may contain document data.
  requireBytes(sourcePdfBefore);requireBytes(sourcePdfAfter);requireBytes(outputPdf);
  if(typeof importedText!=='string')throw Error('G002_IMPORTED_TEXT_REQUIRED');
  let source,output;
  try{source=await pdfFacts(sourcePdfBefore);output=await pdfFacts(outputPdf);}
  catch{throw Error('G002_PDF_PARSING_OR_LIMIT_FAILED');}
  const sourceText=source.map(x=>x.text).join(' ');
  const outputText=output.map(x=>x.text).join(' ');
  const snapshot=checkSnapshots({
    sourcePdfBefore,sourcePdfAfter,sourceText,importedText,outputText,expectedTableRows,
  });
  const issues=[...snapshot.issues];
  if(hash(sourcePdfBefore)===hash(outputPdf))issues.push('OUTPUT_IDENTICAL_TO_ORIGINAL_BYTES');
  if(source.length!==output.length)issues.push('PAGE_COUNT_CHANGED_MANUAL_REVIEW');
  if(!output.every(p=>p.isA4))issues.push('OUTPUT_NOT_A4');
  if(output.some(p=>p.clipped>0))issues.push('OUTPUT_TEXT_OVERFLOW');
  if(source.some(p=>p.rotated>0)||output.some(p=>p.rotated>0))issues.push('ROTATED_TEXT_GEOMETRY_UNVERIFIED');
  if(source.some(p=>p.empty)||output.some(p=>p.empty))issues.push('BLANK_OR_SCANNED_PAGE_MANUAL_REVIEW');
  if(source.reduce((a,p)=>a+p.raster,0)!==output.reduce((a,p)=>a+p.raster,0))
    issues.push('RASTER_DRAW_COUNT_CHANGED');
  if(source.reduce((a,p)=>a+p.vector,0)!==output.reduce((a,p)=>a+p.vector,0))
    issues.push('VECTOR_PATH_OPERATOR_COUNT_CHANGED');
  const pageOverlap=Math.min(source.length,output.length);
  for(let i=0;i<pageOverlap;i++){
    if(source[i].text!==output[i].text){issues.push('PAGE_LEVEL_TEXT_REVIEW_REQUIRED');break;}
  }
  return Object.freeze({
    schema:'astra-g002-real-pdfjs-parity-v1',status:issues.length?
      'POTENTIAL_DIFFERENCES_REQUIRE_MANUAL_REVIEW':'PDFJS_STRUCTURAL_PARITY_MANUAL_REVIEW_REQUIRED',
    issues:[...new Set(issues)],sourcePdfSha256Before:hash(sourcePdfBefore),
    sourcePdfSha256After:hash(sourcePdfAfter),outputPdfSha256:hash(outputPdf),
    sourcePages:source.length,outputPages:output.length,
    rasterSource:source.reduce((a,p)=>a+p.raster,0),
    rasterOutput:output.reduce((a,p)=>a+p.raster,0),
    vectorSource:source.reduce((a,p)=>a+p.vector,0),
    vectorOutput:output.reduce((a,p)=>a+p.vector,0),
    sourceTextItems:source.map(x=>x.text.length).reduce((a,b)=>a+b,0),
    outputTextItems:output.map(x=>x.text.length).reduce((a,b)=>a+b,0),
    importTextProvenance:'CALLER_ASSERTION_NOT_AUTHENTICATED',
    imageTableGeometryAndRendering:'NOT_VERIFIED',
    humanApproval:'UNASSESSED',release:'RELEASE HOLD',scoreDelta:0,
  });
}
