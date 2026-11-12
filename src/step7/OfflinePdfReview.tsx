import {useEffect,useRef,useState} from 'react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {comparePdfTokenLists,countPdfPerPageTokenDifferences,countPdfPerPageOrderRisks,tokenizePdfText,type TokenParity} from './tokenParity.ts';

// Independent owner-chosen PDF A and output PDF B. No file name/bytes/text is
// logged, stored, transmitted, or embedded in exported metadata. No OCR or model.
interface PdfSignal {sha256:string;pages:number;textItems:number;tokens:string[];perPageTokens:string[][];rasterDraws:number;nonA4:number}
interface PdfReviewReport extends TokenParity {
 format:'astra-step7-local-pdf-parity-v1';
 sourceSha256:string;outputSha256:string;
 sourcePages:number;outputPages:number;
 sourceRasterDraws:number;outputRasterDraws:number;
 outputNonA4Pages:number;perPageTextRiskPages:number|null;perPageOrderRiskPages:number|null;
 status:'RISK_SIGNALS_REVIEW_REQUIRED'|'LEXICAL_PARITY_NOT_FIDELITY_CERTIFIED';
 issues:string[];
 contentFidelityCertified:false;visualFidelityCertified:false;
 originalSourceModified:false;externalTransfer:false;ownerApproval:'NOT_GRANTED';
}
const MAX_FILE=30*1024*1024,MAX_PAGES=50,MAX_CHARS=1_500_000,MAX_ITEMS=300_000;
const validPdf=(file:File)=>file.size>=10&&file.size<=MAX_FILE&&/\.pdf$/i.test(file.name);
function hex(bytes:ArrayBuffer):string{
 return [...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
async function inspectPdf(file:File,signal:AbortSignal):Promise<PdfSignal>{
 const ensureActive=()=>{if(signal.aborted)throw Error('변경된 PDF 검수는 취소되었습니다.');};
 ensureActive();
 if(!validPdf(file)||!globalThis.crypto?.subtle)throw Error('지원하는 로컬 PDF만 검사할 수 있습니다.');
 const bytes=await file.arrayBuffer();
 ensureActive();
 if(String.fromCharCode(...new Uint8Array(bytes.slice(0,5)))!=='%PDF-')
  throw Error('유효하지 않은 PDF 파일입니다.');
 const digest=hex(await crypto.subtle.digest('SHA-256',bytes));
 ensureActive();
 const {getDocument,GlobalWorkerOptions,OPS}=await import('pdfjs-dist');
 ensureActive();
 GlobalWorkerOptions.workerSrc=workerUrl;
 const loader=getDocument({data:new Uint8Array(bytes.slice(0)),stopAtErrors:true,useSystemFonts:true});
 // Cancel the active PDF.js worker when owner changes either selected file.
 // One shared destroy Promise makes abort/finally cleanup idempotent.
 let destroyPromise:Promise<void>|null=null;
 const destroy=()=>destroyPromise??(destroyPromise=loader.destroy());
 const abort=()=>{void destroy().catch(()=>{});};
 signal.addEventListener('abort',abort,{once:true});
 try{
  ensureActive();
  const document=await loader.promise;
  ensureActive();
  if(document.numPages<1||document.numPages>MAX_PAGES)
   throw Error('50페이지 이하 PDF만 검수할 수 있습니다.');
  let items=0,chars=0,raster=0,nonA4=0;
  const tokens:string[]=[],perPageTokens:string[][]=[];
  for(let pageNo=1;pageNo<=document.numPages;pageNo++){
   ensureActive();
   const page=await document.getPage(pageNo);
   ensureActive();
   const view=page.getViewport({scale:1});
   if(Math.abs(view.width-595.276)>2||Math.abs(view.height-841.89)>2)nonA4++;
   const text=(await page.getTextContent()).items.flatMap(item=>
    'str' in item && typeof item.str==='string'?[item.str]:[]);
   ensureActive();
   items+=text.length;chars+=text.reduce((sum,value)=>sum+value.length,0);
   if(items>MAX_ITEMS||chars>MAX_CHARS)throw Error('PDF 분석 크기 제한을 초과했습니다.');
   const pageTokens=tokenizePdfText(text);
   tokens.push(...pageTokens);perPageTokens.push(pageTokens);
   if(tokens.length>MAX_ITEMS)throw Error('PDF 토큰 제한을 초과했습니다.');
   const ops=(await page.getOperatorList()).fnArray;
   ensureActive();
   raster+=ops.filter(op=>[
    OPS.paintImageXObject,OPS.paintInlineImageXObject,
    OPS.paintImageXObjectRepeat,OPS.paintInlineImageXObjectGroup,
    OPS.paintImageMaskXObject,OPS.paintImageMaskXObjectGroup,
   ].includes(op)).length;
   page.cleanup();
  }
  return{sha256:digest,pages:document.numPages,textItems:items,
   tokens,perPageTokens,rasterDraws:raster,nonA4};
 }finally{
  signal.removeEventListener('abort',abort);
  await destroy();
 }
}
export function downloadPdfReview(report:PdfReviewReport):void{
 if(report.ownerApproval!=='NOT_GRANTED'||report.contentFidelityCertified!==false||
    report.externalTransfer!==false)throw Error('승인되지 않은 검수 영수증입니다.');
 const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)+'\n'],{type:'application/json'}));
 try{
  const a=document.createElement('a');a.href=url;a.download='astra-pdf-parity-review.json';
  document.body.appendChild(a);a.click();a.remove();
 }finally{window.setTimeout(()=>URL.revokeObjectURL(url),60_000);}
}
export default function OfflinePdfReview(){
 const [source,setSource]=useState<File|null>(null);
 const [output,setOutput]=useState<File|null>(null);
 const [report,setReport]=useState<PdfReviewReport|null>(null);
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 const epoch=useRef(0);
 const activeController=useRef<AbortController|null>(null);
 useEffect(()=>()=>{epoch.current++;activeController.current?.abort();},[]);
 const choose=(role:'source'|'output',file:File|null)=>{
  epoch.current++;
  activeController.current?.abort();
  activeController.current=null;
  setBusy(false);setReport(null);setError('');
  if(role==='source')setSource(file);else setOutput(file);
 };
 const review=async()=>{
  const now=++epoch.current;
  activeController.current?.abort();
  const controller=new AbortController();
  activeController.current=controller;
  setReport(null);setError('');setBusy(true);
  try{
   if(!source||!output)throw Error('원본과 저장한 PDF를 각각 지정하세요.');
   const s=await inspectPdf(source,controller.signal);
   if(epoch.current!==now)return;
   const o=await inspectPdf(output,controller.signal);
   if(epoch.current!==now)return;
   const comparison=comparePdfTokenLists(s.tokens,o.tokens);
   const perPageTextRiskPages=countPdfPerPageTokenDifferences(s.perPageTokens,o.perPageTokens);
   const perPageOrderRiskPages=countPdfPerPageOrderRisks(s.perPageTokens,o.perPageTokens);
   const issues:string[]=[];
   if(s.sha256===o.sha256)issues.push('원본과 결과 파일 해시가 같습니다. 실제 재디자인 PDF인지 확인하세요.');
   if(!s.tokens.length)issues.push('원본에 선택 가능한 텍스트가 없습니다. OCR이나 원문 보존을 검증하지 못했습니다.');
   if(!o.tokens.length)issues.push('출력 PDF에 선택 가능한 텍스트가 없습니다.');
   if(comparison.missingTokens)issues.push('결과 PDF에 없는 원본 토큰이 있습니다.');
   if(comparison.missingNumericTokens)issues.push('결과 PDF에 없는 숫자 포함 토큰이 있습니다.');
   if(comparison.addedTokens)issues.push('원본에 없는 출력 토큰이 있습니다. 추가·중복 여부를 확인하세요.');
   if(s.pages!==o.pages)issues.push('원본과 결과의 페이지 수가 다릅니다. 페이지 배치와 누락을 확인하세요.');
   else if(perPageTextRiskPages!==null&&perPageTextRiskPages>0)
    issues.push('전체 텍스트 수는 같아도 같은 번호 페이지의 내용이 다릅니다. 재배치·누락을 확인하세요.');
   if(perPageOrderRiskPages!==null&&perPageOrderRiskPages>0)
    issues.push('같은 페이지에서 추출된 텍스트 순서가 바뀌었습니다. 표·숫자 연결과 읽기 순서를 확인하세요.');
   if(s.rasterDraws!==o.rasterDraws)issues.push('원본과 결과의 이미지 그리기 수가 다릅니다.');
   if(o.nonA4)issues.push('출력 중 A4가 아닌 페이지가 있습니다.');
   setReport({
    format:'astra-step7-local-pdf-parity-v1',
    sourceSha256:s.sha256,outputSha256:o.sha256,
    sourcePages:s.pages,outputPages:o.pages,
    sourceRasterDraws:s.rasterDraws,outputRasterDraws:o.rasterDraws,
    outputNonA4Pages:o.nonA4,perPageTextRiskPages,perPageOrderRiskPages,
    ...comparison,issues,
    status:issues.length?'RISK_SIGNALS_REVIEW_REQUIRED':'LEXICAL_PARITY_NOT_FIDELITY_CERTIFIED',
    contentFidelityCertified:false,visualFidelityCertified:false,
    originalSourceModified:false,externalTransfer:false,ownerApproval:'NOT_GRANTED',
   });
  }catch{
   if(epoch.current===now)setError('PDF를 자동 대조하지 못했습니다. 파일 형식·30MiB·50페이지 제한과 원본을 확인하세요.');
  }finally{
   if(epoch.current===now){
    activeController.current=null;
    setBusy(false);
   }
  }
 };
 return <main className="app-layout" data-step7-pdf-review>
  <section className="panel" aria-label="PDF 원본과 결과 검수">
   <div className="panel-heading"><h2>최종 PDF 원본 대조</h2>
    <span className="panel-caption">이 PC 내부에서만 분석 · 자동 승인 없음</span></div>
   <p className="help-text">STEP3에서 사용한 원본 PDF와 새로 저장한 PDF를 직접 선택하세요.
     저장된 문서·원본 파일은 변경하지 않고, 선택 가능한 텍스트 토큰과 숫자·A4·이미지 그리기 수를 비교합니다.
     표·다단·스캔·글꼴의 시각적 일치는 자동 검증되지 않습니다.</p>
   <div className="form-grid">
    <label className="field">원본 PDF 파일
     <input data-pdf-review-source type="file" accept=".pdf,application/pdf"
      onChange={event=>choose('source',event.target.files?.[0]??null)}/></label>
    <label className="field">저장한 결과 PDF 파일
     <input data-pdf-review-output type="file" accept=".pdf,application/pdf"
      onChange={event=>choose('output',event.target.files?.[0]??null)}/></label>
   </div>
   <div className="toolbar">
    <button type="button" className="secondary-button" data-pdf-review-start
     disabled={busy||!source||!output} onClick={()=>void review()}>
      {busy?'로컬 분석 중…':'두 PDF 대조하기'}</button>
    {report&&<button type="button" className="secondary-button" data-pdf-review-download
     onClick={()=>downloadPdfReview(report)}>검수 결과 JSON 저장</button>}
   </div>
   {error&&<p role="alert" className="warning" data-pdf-review-error>{error}</p>}
   {report&&<section className="panel" aria-label="자동 원본 대조 결과" data-pdf-review-result>
    <h3>원본/결과 구조 확인 — 출시 승인 아님</h3>
    <p role="status">{report.status==='RISK_SIGNALS_REVIEW_REQUIRED'?
     '차이 또는 미확인 위험이 있습니다. 아래 항목을 직접 검토하세요.':
     '자동 텍스트 대조상 차이가 없지만 실제 충실도는 확인되지 않았습니다.'}</p>
    <dl>
     <dt>PDF 페이지</dt><dd>원본 {report.sourcePages} / 결과 {report.outputPages}</dd>
     <dt>원본 PDF SHA256</dt><dd><code>{report.sourceSha256}</code></dd>
     <dt>결과 PDF SHA256</dt><dd><code>{report.outputSha256}</code></dd>
     <dt>선택텍스트</dt><dd>원본 {report.sourceTokens}토큰 / 결과 {report.outputTokens}토큰</dd>
     <dt>누락된 원본 토큰</dt><dd>{report.missingTokens}</dd>
     <dt>숫자 포함 누락 토큰</dt><dd>{report.missingNumericTokens}</dd>
     <dt>출력에만 있는 토큰</dt><dd>{report.addedTokens}</dd>
     <dt>이미지 그리기</dt><dd>원본 {report.sourceRasterDraws} / 결과 {report.outputRasterDraws}</dd>
     <dt>출력 비A4 페이지</dt><dd>{report.outputNonA4Pages}</dd>
     <dt>페이지별 텍스트 위험</dt><dd>{report.perPageTextRiskPages===null?'페이지 수 달라 비교 불가':report.perPageTextRiskPages}</dd>
     <dt>페이지 내 텍스트 순서 위험</dt><dd>{report.perPageOrderRiskPages===null?'페이지 수 달라 비교 불가':report.perPageOrderRiskPages}</dd>
    </dl>
    {report.issues.length>0&&<ul>{report.issues.map((issue,i)=><li key={i}>{issue}</li>)}</ul>}
    <p className="warning">원문 충실도 미인증 · 법적 권리/라이선스 미검증 · 실제 고객 Windows 검증 미실행 · 판매 승인 NOT_GRANTED</p>
   </section>}
  </section>
 </main>;
}
