// Owner-only, OFFLINE source/project/output PDF comparison. No raw PDF, text,
// page excerpts, private path or model included in review artifacts. NOT a visual
// equivalence, text fidelity or copyright/licensing certificate.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {getDocument, OPS} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {verifyReviewReceiptBytes} from './verify-source-review.mjs';

export const REVIEW_FORMAT='astra-owner-pdf-parity-review-v1';
const MAX_SOURCE=30*1024*1024,MAX_PROJECT=100*1024*1024,MAX_RECEIPT=16*1024;
const MAX_PAGES=50,MAX_TOKENS=300000,MAX_CHARS=1500000;
const deny=()=>{throw Error('ASTRA_PDF_PARITY_REVIEW_BLOCKED');};
const sha=b=>createHash('sha256').update(b).digest('hex');
const validHash=s=>typeof s==='string'&&/^[0-9a-f]{64}$/.test(s);
const isObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function noSymlinks(file){
 if(typeof file!=='string'||!path.isAbsolute(file))deny();
 const resolved=path.resolve(file),root=path.parse(resolved).root;
 let current=root;
 for(const part of path.relative(root,resolved).split(path.sep)){
  if(!part||part==='.'||part==='..')deny();
  current=path.join(current,part);
  if(fs.lstatSync(current).isSymbolicLink())deny();
 }
 return resolved;
}
function readLocal(file,extension,limit){
 const resolved=noSymlinks(file);
 if(!resolved.toLowerCase().endsWith(extension))deny();
 const prior=fs.lstatSync(resolved);
 if(!prior.isFile()||prior.size<1||prior.size>limit)deny();
 const fd=fs.openSync(resolved,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW??0));
 try{
  const before=fs.fstatSync(fd);
  if(!before.isFile()||before.dev!==prior.dev||before.ino!==prior.ino||
     before.size!==prior.size||before.mtimeMs!==prior.mtimeMs)deny();
  const bytes=fs.readFileSync(fd),after=fs.fstatSync(fd),current=fs.lstatSync(resolved);
  if(bytes.length!==before.size||after.dev!==before.dev||after.ino!==before.ino||
     after.size!==before.size||after.mtimeMs!==before.mtimeMs||
     current.isSymbolicLink()||current.dev!==before.dev||current.ino!==before.ino||
     current.size!==before.size||current.mtimeMs!==before.mtimeMs)deny();
  return bytes;
 }finally{fs.closeSync(fd);}
}
function requireNewOutput(file,extension,inputs){
 const resolved=path.resolve(file);
 if(typeof file!=='string'||!path.isAbsolute(file)||!resolved.toLowerCase().endsWith(extension)||
    inputs.includes(resolved)||fs.existsSync(resolved))deny();
 const parent=noSymlinks(path.dirname(resolved));
 if(!fs.lstatSync(parent).isDirectory())deny();
 return resolved;
}
const tokens=text=>(text.normalize('NFC').toLocaleLowerCase('und')
 .match(/(?:[+\-\u2212](?=\p{N}))?[\p{L}\p{N}]+(?:[.,:_-][\p{L}\p{N}]+)*/gu)||[])
 .map(value=>value.startsWith('\u2212')?'-'+value.slice(1):value);
function summarizeTokens(src,dst){
 const counts=new Map();
 for(const token of src)counts.set(token,(counts.get(token)||0)+1);
 let extra=0;
 for(const token of dst){
  const remaining=counts.get(token)||0;
  if(remaining)counts.set(token,remaining-1);
  else extra++;
 }
 let missing=0,numericMissing=0,missingDistinct=0;
 for(const [token,count] of counts){
  if(count){missing+=count;missingDistinct++;if(/\p{N}/u.test(token))numericMissing+=count;}
 }
 return{source_tokens:src.length,output_tokens:dst.length,
  missing_source_tokens:missing,missing_numeric_tokens:numericMissing,
  missing_distinct_tokens:missingDistinct,extra_output_tokens:extra};
}
async function textOnlyPdfEvidence(data){
 if(data.length<10||data.length>MAX_SOURCE||data.subarray(0,5).toString()!=='%PDF-')deny();
 const task=getDocument({data:new Uint8Array(data),stopAtErrors:true,useSystemFonts:true});
 try{
  const pdf=await task.promise;
  if(pdf.numPages<1||pdf.numPages>MAX_PAGES)deny();
  let tokenCount=0,charCount=0,textItems=0,rasterDraws=0,nonA4=0;
  const result=[],perPageTokens=[];
  for(let i=1;i<=pdf.numPages;i++){
   const page=await pdf.getPage(i);
   const view=page.getViewport({scale:1});
   const text=(await page.getTextContent()).items
    .filter(x=>typeof x.str==='string').map(x=>x.str);
   charCount+=text.reduce((n,s)=>n+s.length,0);
   textItems+=text.length;
   if(charCount>MAX_CHARS||textItems>MAX_TOKENS)deny();
   const pageTokens=tokens(text.join(' '));
   tokenCount+=pageTokens.length;
   if(tokenCount>MAX_TOKENS)deny();
   for(const value of pageTokens)result.push(value);
   perPageTokens.push(pageTokens);
   if(Math.abs(view.width-595.276)>2||Math.abs(view.height-841.89)>2)nonA4++;
   const {fnArray}=await page.getOperatorList();
   rasterDraws+=fnArray.filter(op=>[
    OPS.paintImageXObject,OPS.paintInlineImageXObject,
    OPS.paintImageXObjectRepeat,OPS.paintInlineImageXObjectGroup,
    OPS.paintImageMaskXObject,OPS.paintImageMaskXObjectGroup,
   ].includes(op)).length;
   page.cleanup();
  }
  return{pages:pdf.numPages,tokens:result,perPageTokens,textItems,rasterDraws,nonA4};
 }finally{await task.destroy();}
}
export async function reviewPdfPair(sourceBytes,outputBytes,receiptBytes,projectBytes,expectedOutputSha){
 if(!Buffer.isBuffer(sourceBytes)||!Buffer.isBuffer(outputBytes)||
    !Buffer.isBuffer(receiptBytes)||!Buffer.isBuffer(projectBytes)||
    !validHash(expectedOutputSha)||sha(outputBytes)!==expectedOutputSha||
    sha(sourceBytes)===sha(outputBytes))deny();
 const sourceReview=verifyReviewReceiptBytes(receiptBytes,sourceBytes,projectBytes);
 if(sourceReview.status!=='MATCHED_HASHES_NOT_FIDELITY_CERTIFIED'||
    sourceReview.owner_approval!=='NOT_GRANTED'||sourceReview.source_fidelity_certified!==false)deny();
 const [source,output]=await Promise.all([
  textOnlyPdfEvidence(sourceBytes),textOnlyPdfEvidence(outputBytes)
 ]);
 const compared=summarizeTokens(source.tokens,output.tokens);
 // A matching global multiset can conceal page swaps or relocated content.
 const perPageRiskPages=source.pages===output.pages
  ?source.perPageTokens.reduce((n,page,i)=>{
    const diff=summarizeTokens(page,output.perPageTokens[i]);
    return n+Number(diff.missing_source_tokens>0||diff.extra_output_tokens>0);
   },0):null;
 const perPageOrderRiskPages=source.pages===output.pages
  ?source.perPageTokens.reduce((n,page,i)=>{
    const other=output.perPageTokens[i];
    if(page.length!==other.length||page.every((token,j)=>token===other[j]))return n;
    const diff=summarizeTokens(page,other);
    return n+Number(diff.missing_source_tokens===0&&diff.extra_output_tokens===0);
   },0):null;
 const issues=[];
 if(!compared.source_tokens)issues.push('SOURCE_HAS_NO_SELECTABLE_TEXT');
 if(!compared.output_tokens)issues.push('OUTPUT_HAS_NO_SELECTABLE_TEXT');
 if(compared.missing_source_tokens)issues.push('SOURCE_TOKENS_NOT_FOUND_IN_OUTPUT');
 if(compared.missing_numeric_tokens)issues.push('SOURCE_NUMERIC_TOKENS_NOT_FOUND');
 if(compared.extra_output_tokens)issues.push('OUTPUT_HAS_ADDITIONAL_TOKENS');
 if(source.pages!==output.pages)issues.push('PDF_PAGE_COUNT_CHANGED');
 else if(perPageRiskPages>0)issues.push('PER_PAGE_TEXT_DIFFERENCES_REVIEW_REQUIRED');
 if(perPageOrderRiskPages>0)issues.push('PER_PAGE_TEXT_ORDER_DIFFERENCES_REVIEW_REQUIRED');
 if(source.rasterDraws!==output.rasterDraws)issues.push('RASTER_DRAW_COUNT_CHANGED');
 if(output.nonA4)issues.push('OUTPUT_NON_A4_PAGES');
 return Object.freeze({
  format:REVIEW_FORMAT,
  status:issues.length?'POTENTIAL_CONTENT_DIFFERENCES_REVIEW_REQUIRED':
                      'AUTOMATED_TOKENS_MATCH_NOT_FIDELITY_CERTIFIED',
  source_pdf_sha256:sha(sourceBytes),output_pdf_sha256:expectedOutputSha,
  source_pdf_pages:source.pages,output_pdf_pages:output.pages,
  source_text_items:source.textItems,output_text_items:output.textItems,
  source_raster_draws:source.rasterDraws,output_raster_draws:output.rasterDraws,
  output_non_a4_pages:output.nonA4,
  per_page_text_risk_pages:perPageRiskPages,
  per_page_order_risk_pages:perPageOrderRiskPages,
  ...compared,issues,
  original_receipt_and_project_hashes_matched:true,
  reviewed_source_blocks:sourceReview.acknowledged_blocks,
  unreviewed_source_blocks:sourceReview.unacknowledged_blocks,
  source_extraction_completeness:'NOT_CERTIFIED',
  exact_text_semantics:'NOT_CERTIFIED',
  layout_and_image_fidelity:'NOT_CERTIFIED',
  font_rights_and_license:'NOT_VERIFIED',
  actual_buyer_windows_acceptance:'NOT_VERIFIED',
  owner_sale_approval:'NOT_GRANTED',
  original_modified:false,external_transfer:false,
 });
}
function htmlReport(data){
 const e=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fields=[
  ['원본 PDF SHA256',data.source_pdf_sha256],['결과 PDF SHA256',data.output_pdf_sha256],
  ['원본 PDF 페이지',data.source_pdf_pages],['결과 PDF 페이지',data.output_pdf_pages],
  ['원본 선택텍스트 토큰',data.source_tokens],['출력 선택텍스트 토큰',data.output_tokens],
  ['출력에서 발견하지 못한 원본 토큰',data.missing_source_tokens],
  ['그중 숫자 포함 토큰',data.missing_numeric_tokens],
  ['출력에 추가된 토큰',data.extra_output_tokens],
  ['원본 래스터 그리기 수',data.source_raster_draws],
  ['출력 래스터 그리기 수',data.output_raster_draws],
  ['출력 비A4 페이지',data.output_non_a4_pages],
  ['페이지별 선택텍스트 위험',data.per_page_text_risk_pages===null?'페이지 수 달라 비교 불가':data.per_page_text_risk_pages],
  ['페이지 안 읽기 순서 위험',data.per_page_order_risk_pages===null?'페이지 수 달라 비교 불가':data.per_page_order_risk_pages],
 ];
 return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; connect-src 'none'; img-src 'none'; style-src 'unsafe-inline'; object-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ASTRA 원본/출력 PDF 로컬 검수</title>
<style>:root{font:15px/1.55 system-ui,'Malgun Gothic',sans-serif;background:#f4f7fa;color:#223}
body{max-width:980px;margin:auto;padding:24px}header,section{background:white;padding:18px;border:1px solid #dde4ea;border-radius:12px;margin:0 0 16px}
h1{font-size:1.45rem;margin:0 0 10px}h2{font-size:1.1rem}.hold{color:#963e24;font-weight:800}
table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:9px;border-bottom:1px solid #dde4ea}
code{overflow-wrap:anywhere;font-size:.8rem}@media print{body{background:white;padding:0}section,header{break-inside:avoid}}</style></head><body>
<header><h1>ASTRA — 소유자 오프라인 PDF 대조</h1>
<p class="hold">원본·출력 PDF의 선택 가능 텍스트 토큰만 비교합니다. 픽셀 동일성·OCR·원본 충실도·법적 판매 승인을 증명하지 않습니다.</p>
<p>결과: <strong>${e(data.status)}</strong></p></header>
<section><h2>SHA 및 구조 확인</h2><table><tbody>${fields.map(([name,value])=>`<tr><th scope="row">${e(name)}</th><td><code>${e(value)}</code></td></tr>`).join('')}</tbody></table></section>
<section><h2>추가 육안 검수 필요 항목</h2>
<p>${data.issues.length?data.issues.map(e).join(', '):'자동으로 확인한 토큰 차이가 없으나 육안 검수는 필수입니다.'}</p>
<ol><li>원본 누락·선택 제외된 표/머리말/숫자 및 문장 순서</li><li>이미지·표·다단·글꼴·페이지 분할과 한국어 출력</li>
<li>고객 문서 소유권·재배포 라이선스·실제 Windows PC 및 지원 조건</li></ol>
<p class="hold">원본 충실도 NOT_CERTIFIED · 고객 판매 승인 NOT_GRANTED · RELEASE HOLD</p></section></body></html>`;
}
export function createReviewHtml(report){
 if(!isObject(report)||report.format!==REVIEW_FORMAT||
    report.owner_sale_approval!=='NOT_GRANTED'||report.original_modified!==false||
    report.external_transfer!==false)deny();
 return htmlReport(report);
}
export async function generateOwnerPdfReview({receipt,source,project,output,outputSha256,jsonPath,htmlPath}){
 if(![receipt,source,project,output,jsonPath,htmlPath].every(x=>typeof x==='string'&&path.isAbsolute(x)))deny();
 const inputs=[receipt,source,project,output].map(value=>path.resolve(value));
 if(new Set(inputs).size!==4||!validHash(outputSha256))deny();
 const json=requireNewOutput(jsonPath,'.json',inputs),html=requireNewOutput(htmlPath,'.html',[...inputs,json]);
 if(json===html)deny();
 const r=readLocal(receipt,'.json',MAX_RECEIPT),s=readLocal(source,'.pdf',MAX_SOURCE),
       p=readLocal(project,'.json',MAX_PROJECT),o=readLocal(output,'.pdf',MAX_SOURCE);
 const report=await reviewPdfPair(s,o,r,p,outputSha256);
 // Recheck all four files immediately before creating final output artifacts.
 for(const [name,snapshot,size,ext] of [
  [receipt,r,MAX_RECEIPT,'.json'],[source,s,MAX_SOURCE,'.pdf'],
  [project,p,MAX_PROJECT,'.json'],[output,o,MAX_SOURCE,'.pdf']]){
  if(sha(readLocal(name,ext,size))!==sha(snapshot))deny();
 }
 // On failure, do not unlink by pathname: another owner writer could replace
 // a created report. Preserve partial outputs as HOLD for manual inspection.
 // O_EXCL ensures retries never overwrite owner data.
 for(const [name,content] of [[json,JSON.stringify(report,null,2)+'\n'],[html,createReviewHtml(report)]]){
  const fd=fs.openSync(name,fs.constants.O_WRONLY|fs.constants.O_CREAT|fs.constants.O_EXCL,0o600);
  try{fs.writeFileSync(fd,content,{encoding:'utf8'});}finally{fs.closeSync(fd);}
 }
 return report;
}
export async function main(argv=process.argv.slice(2)){
 try{
  if(argv.length!==7)deny();
  const [receipt,source,project,output,outputSha256,jsonPath,htmlPath]=argv;
  const report=await generateOwnerPdfReview({receipt,source,project,output,outputSha256,jsonPath,htmlPath});
  process.stdout.write(JSON.stringify({status:report.status,
   source_pdf_sha256:report.source_pdf_sha256,output_pdf_sha256:report.output_pdf_sha256,
   missing_source_tokens:report.missing_source_tokens,missing_numeric_tokens:report.missing_numeric_tokens,
   owner_sale_approval:'NOT_GRANTED'})+'\n');
  return 0;
 }catch{
  process.stdout.write(JSON.stringify({status:'ASTRA_PDF_PARITY_REVIEW_BLOCKED',owner_sale_approval:'NOT_GRANTED'})+'\n');
  return 1;
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)
 process.exitCode=await main();
