// G002 independent synthetic-only cross-engine PDF text evidence.
// Compares PDF.js extraction with local Poppler pdftotext via stdin/stdout.
// Never return or log PDF text, markers, file paths, or external transfers.
import {spawnSync} from 'node:child_process';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {createHash} from 'node:crypto';

const MAX_PDF=32*1024*1024, MAX_CHARS=2_000_000, MAX_PAGES=30;
const MARKER=/^[A-Z][A-Z0-9_]{7,79}$/;
const sha=b=>createHash('sha256').update(b).digest('hex');
const deny=()=>{throw Error('G002_CROSS_ENGINE_EVIDENCE_BLOCKED');};
const validPdf=b=>Buffer.isBuffer(b)&&b.length>=24&&b.length<=MAX_PDF&&b.subarray(0,5).toString('ascii')==='%PDF-';
function checkMarkers(markers) {
  if(!Array.isArray(markers)||markers.length<1||markers.length>64||
     !markers.every(x=>typeof x==='string'&&MARKER.test(x))||
     new Set(markers).size!==markers.length)deny();
}
function countNuls(s) {
  return s.length-s.replace(/\u0000/gu,'').length;
}
function flags(s,markers) {
  // Some PDF generators separate a single synthetic marker into several text
  // items. Permit that extraction variation; do not compare raw private strings.
  const compact=s.replace(/\s+/gu,'');
  return markers.map(x=>compact.includes(x));
}
async function pdfjsText(pdfBytes) {
  let task;
  try {
    task=getDocument({data:new Uint8Array(pdfBytes),disableFontFace:true,useSystemFonts:true});
    const doc=await task.promise;
    if(doc.numPages<1||doc.numPages>MAX_PAGES)deny();
    let spaced='',nul=0,count=0;
    for(let p=1;p<=doc.numPages;p++){
      const page=await doc.getPage(p);
      const items=(await page.getTextContent()).items.filter(x=>typeof x.str==='string');
      const one=items.map(x=>x.str).join('');
      nul+=countNuls(one);
      count+=one.length;
      if(count>MAX_CHARS)deny();
      spaced+=one+' ';
      page.cleanup();
    }
    return {text:spaced,nul,characters:count,pages:doc.numPages};
  }catch{deny();}
  finally{if(task)await task.destroy().catch(()=>{});}
}
function popplerText(pdfBytes) {
  // "-" for stdin/stdout, no filename, network or shell. Nonzero exit is
  // *not* classified as a content mismatch or proof of fidelity.
  const run=spawnSync('pdftotext',['-enc','UTF-8','-layout','-','-'],{
    input:pdfBytes,timeout:20_000,maxBuffer:5*1024*1024,shell:false,windowsHide:true,
  });
  if(run.error||run.status!==0||!Buffer.isBuffer(run.stdout)||run.stdout.length>MAX_CHARS*4)deny();
  let result;
  try{result=new TextDecoder('utf-8',{fatal:true}).decode(run.stdout);}catch{deny();}
  if(result.length>MAX_CHARS)deny();
  return {text:result,nul:countNuls(result),characters:result.length};
}
export async function compareSyntheticPdfCrossEngine({sourcePdf,outputPdf,expectedMarkers}={}) {
  if(!validPdf(sourcePdf)||!validPdf(outputPdf))deny();
  checkMarkers(expectedMarkers);
  // All extraction happens locally and only aggregate values are returned.
  const [sourceJs,outputJs]=await Promise.all([pdfjsText(sourcePdf),pdfjsText(outputPdf)]);
  const sourcePop=popplerText(sourcePdf),outputPop=popplerText(outputPdf);
  const sourceJ=flags(sourceJs.text,expectedMarkers);
  const sourceP=flags(sourcePop.text,expectedMarkers);
  const outputJ=flags(outputJs.text,expectedMarkers);
  const outputP=flags(outputPop.text,expectedMarkers);
  let sourceOnlyJS=0,sourceOnlyPoppler=0,sourceMissingBoth=0;
  let outputJSOnly=0,outputPopplerOnly=0,outputMissingBoth=0;
  let sourcePresentBoth=0,outputPresentBoth=0;
  for(let i=0;i<expectedMarkers.length;i++){
    if(sourceJ[i]&&sourceP[i])sourcePresentBoth++;
    else if(sourceJ[i])sourceOnlyJS++;
    else if(sourceP[i])sourceOnlyPoppler++;
    else sourceMissingBoth++;
    if(outputJ[i]&&outputP[i])outputPresentBoth++;
    else if(outputJ[i])outputJSOnly++;
    else if(outputP[i])outputPopplerOnly++;
    else outputMissingBoth++;
  }
  const issues=[];
  if(sourceMissingBoth||sourceOnlyJS||sourceOnlyPoppler)
    issues.push('SOURCE_CROSS_PARSER_MARKERS_NOT_PROVEN');
  if(outputMissingBoth)issues.push('OUTPUT_MARKERS_MISSING_BOTH_PARSERS');
  if(outputJSOnly||outputPopplerOnly)
    issues.push('OUTPUT_PARSER_MARKER_DISAGREEMENT');
  if(sourceJs.nul)issues.push('SOURCE_PDFJS_NUL_GLYPHS');
  if(sourcePop.nul)issues.push('SOURCE_POPPLER_NUL_GLYPHS');
  if(outputJs.nul)issues.push('OUTPUT_PDFJS_NUL_GLYPHS');
  if(outputPop.nul)issues.push('OUTPUT_POPPLER_NUL_GLYPHS');
  if(outputJs.nul>0&&outputPop.nul===0)
    issues.push('PDFJS_ONLY_NUL_EXTRACTION_POSSIBLE_NOT_PROVEN');
  if(outputJs.nul>0&&outputPop.nul>0)
    issues.push('BOTH_PARSERS_NUL_EXTRACTION_REVIEW_REQUIRED');
  if(sourceJs.pages!==outputJs.pages)
    issues.push('PAGE_COUNT_CHANGED_REVIEW_REQUIRED');
  return Object.freeze({
    schema:'astra-g002-cross-parser-synthetic-v1',
    status:'CROSS_PARSER_RISK_REPORT_NOT_FIDELITY_CERTIFICATION',
    issues:Object.freeze(issues),
    markersExpected:expectedMarkers.length,
    sourceMarkersPresentBoth:sourcePresentBoth,
    sourceOnlyPdfjs:sourceOnlyJS,
    sourceOnlyPoppler:sourceOnlyPoppler,
    sourceMissingBothParsers:sourceMissingBoth,
    outputMarkersPresentBoth:outputPresentBoth,
    outputOnlyPdfjs:outputJSOnly,
    outputOnlyPoppler:outputPopplerOnly,
    outputMissingBothParsers:outputMissingBoth,
    sourcePdfjsNul:sourceJs.nul,sourcePopplerNul:sourcePop.nul,
    outputPdfjsNul:outputJs.nul,outputPopplerNul:outputPop.nul,
    sourcePages:sourceJs.pages,outputPages:outputJs.pages,
    sourceSha256:sha(sourcePdf),outputSha256:sha(outputPdf),
    possibleGlyphMapArtifactNotCertified:
      outputJs.nul>0&&outputPop.nul===0,
    actualVisualLoss:'UNASSESSED',
    numericSemanticFidelity:'NOT_CERTIFIED',
    ownerApproval:'NOT_GRANTED',
    externalTransfer:false,filesModified:false,scoreDelta:0,
    release:'RELEASE HOLD',
  });
}
