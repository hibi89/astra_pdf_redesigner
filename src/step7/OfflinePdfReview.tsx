import {useEffect,useRef,useState} from 'react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {comparePdfTokenLists,comparePdfValueLists,countPdfPerPageTokenDifferences,countPdfPerPageOrderRisks,hasPdfDocumentTextOrderRisk,normalizePdfLinkTarget,tokenizePdfLinks,tokenizePdfNegationTokens,tokenizePdfSymbols,tokenizePdfText,type TokenParity} from './tokenParity.ts';
import {countPdfVectorStrokes,countPdfPageStrokeDrift,countPdfPageRasterDrift} from './pdfPaintSignals.ts';

// Independent owner-chosen PDF A and output PDF B. No file name/bytes/text is
// logged, stored, transmitted, or embedded in exported metadata. No OCR or model.
interface PdfSignal {sha256:string;pages:number;textItems:number;tokens:string[];perPageTokens:string[][];symbols:string[];perPageSymbols:string[][];negations:string[];perPageNegations:string[][];links:string[];perPageLinks:string[][];unsupportedLinks:number;perPageUnsupportedLinks:number[];rasterDraws:number;rasterPerPage:number[];vectorStrokes:number;vectorPerPage:number[];nonA4:number}
interface PdfPageDifference {page:number;missingTokens:number;addedTokens:number;missingNumericTokens:number;missingSymbols:number;addedSymbols:number;missingNegations:number;addedNegations:number;missingLinks:number;addedLinks:number;unsupportedLinks:number}
interface PdfReviewReport extends TokenParity {
 format:'astra-step7-local-pdf-parity-v1';
 sourceSha256:string;outputSha256:string;
 sourcePages:number;outputPages:number;
 sourceRasterDraws:number;outputRasterDraws:number;
 sourceVectorStrokes:number;outputVectorStrokes:number;vectorPageRiskPages:number|null;rasterPageRiskPages:number|null;
 sourceNonA4Pages:number;outputNonA4Pages:number;sourceSymbolCount:number;outputSymbolCount:number;missingSymbols:number;addedSymbols:number;sourceNegationCount:number;outputNegationCount:number;missingNegations:number;addedNegations:number;sourceLinkTargets:number;outputLinkTargets:number;missingLinkTargets:number;addedLinkTargets:number;sourceUnsupportedLinkAnnotations:number;outputUnsupportedLinkAnnotations:number;perPageDifferences:PdfPageDifference[]|null;perPageTextRiskPages:number|null;perPageOrderRiskPages:number|null;documentTextOrderRisk:boolean;
 status:'RISK_SIGNALS_REVIEW_REQUIRED'|'LEXICAL_PARITY_NOT_FIDELITY_CERTIFIED';
 issues:string[];
 contentFidelityCertified:false;visualFidelityCertified:false;
 originalSourceModified:false;externalTransfer:false;ownerApproval:'NOT_GRANTED';
}

// Owner-only visual checklist; intentionally transient and not a sale approval.
const MANUAL_REVIEW_ITEMS=[
 {id:'text',label:'원문 문장·제목·순서를 육안으로 대조'},
 {id:'numbers',label:'금액·날짜·숫자·부호를 확인'},
 {id:'tables',label:'표 셀·테두리·다단 배치를 확인'},
 {id:'images',label:'사진·로고·캡션의 존재 여부를 확인'},
 {id:'pagination',label:'페이지 분할·머리말·꼬리말을 확인'},
 {id:'typography',label:'한글·글꼴·기호 표시를 확인'},
 {id:'clipping',label:'잘림·겹침·누락 여부를 확인'},
 {id:'symbols',label:'기호·부호·괄호·통화/퍼센트 표기를 확인'},
 {id:'negation',label:'부정·금지·승인/미승인 표현을 확인'},
 {id:'links',label:'표시 URL 및 PDF 링크 이동 대상을 확인'},
] as const;
type ReviewItemId=(typeof MANUAL_REVIEW_ITEMS)[number]['id'];
type VisualReviewState=Partial<Record<ReviewItemId,boolean>>;
function visualReviewEvidence(checked:VisualReviewState){
 const items=MANUAL_REVIEW_ITEMS.map(item=>({id:item.id,checked:checked[item.id]===true}));
 return {scope:'LOCAL_VISUAL_CHECK_ONLY_NOT_SALE_APPROVAL' as const,
  completed:items.every(item=>item.checked),items};
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
  let items=0,chars=0,raster=0,vector=0,nonA4=0,unsupportedLinks=0;
  const tokens:string[]=[],perPageTokens:string[][]=[],symbols:string[]=[],perPageSymbols:string[][]=[],negations:string[]=[],perPageNegations:string[][]=[],links:string[]=[],perPageLinks:string[][]=[],perPageUnsupportedLinks:number[]=[],vectorPerPage:number[]=[],rasterPerPage:number[]=[];
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
   if(tokens.length+pageTokens.length>MAX_ITEMS)throw Error('PDF 토큰 제한을 초과했습니다.');
   for(const value of pageTokens)tokens.push(value);
   perPageTokens.push(pageTokens);
   const pageSymbols=tokenizePdfSymbols(text);symbols.push(...pageSymbols);perPageSymbols.push(pageSymbols);
   const pageNegations=tokenizePdfNegationTokens(text);negations.push(...pageNegations);perPageNegations.push(pageNegations);
   const pageLinks=tokenizePdfLinks(text);const annotations=await page.getAnnotations();let pageUnsupportedLinks=0;
   for(const value of annotations as unknown as Array<{subtype?:string;url?:unknown;dest?:unknown}>){
    if(value.subtype!=='Link')continue;
    if(typeof value.url==='string'&&value.url){const target=normalizePdfLinkTarget(value.url);if(target)pageLinks.push(target);else pageUnsupportedLinks++;}
    else if(typeof value.dest==='string'&&value.dest)pageLinks.push('pdf-dest:'+value.dest.normalize('NFC'));
    else if(Array.isArray(value.dest))pageLinks.push('pdf-dest:'+JSON.stringify(value.dest));
    else pageUnsupportedLinks++;
   }
   links.push(...pageLinks);perPageLinks.push(pageLinks);unsupportedLinks+=pageUnsupportedLinks;perPageUnsupportedLinks.push(pageUnsupportedLinks);
   ensureActive();
   const operatorList=await page.getOperatorList();
   ensureActive();
   const {fnArray:ops,argsArray}=operatorList;
   const strokeCount=countPdfVectorStrokes(ops,argsArray,OPS);
   vector+=strokeCount;vectorPerPage.push(strokeCount);
   const rasterCount=ops.filter(op=>[
    OPS.paintImageXObject,OPS.paintInlineImageXObject,
    OPS.paintImageXObjectRepeat,OPS.paintInlineImageXObjectGroup,
    OPS.paintImageMaskXObject,OPS.paintImageMaskXObjectGroup,
   ].includes(op)).length;
   raster+=rasterCount;rasterPerPage.push(rasterCount);
   page.cleanup();
  }
  return{sha256:digest,pages:document.numPages,textItems:items,
   tokens,perPageTokens,symbols,perPageSymbols,negations,perPageNegations,links,perPageLinks,unsupportedLinks,perPageUnsupportedLinks,rasterDraws:raster,rasterPerPage,vectorStrokes:vector,vectorPerPage,nonA4};
 }finally{
  signal.removeEventListener('abort',abort);
  await destroy();
 }
}
export function downloadPdfReview(report:PdfReviewReport,checked:VisualReviewState={}):void{
 if(report.ownerApproval!=='NOT_GRANTED'||report.contentFidelityCertified!==false||
    report.externalTransfer!==false)throw Error('승인되지 않은 검수 영수증입니다.');
 const safeReport={...report,manualVisualReview:visualReviewEvidence(checked)};
 const url=URL.createObjectURL(new Blob([JSON.stringify(safeReport,null,2)+'\n'],{type:'application/json'}));
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
 const [manualChecked,setManualChecked]=useState<VisualReviewState>({});
 const manualCount=MANUAL_REVIEW_ITEMS.filter(item=>manualChecked[item.id]===true).length;
 const epoch=useRef(0);
 const activeController=useRef<AbortController|null>(null);
 useEffect(()=>()=>{epoch.current++;activeController.current?.abort();},[]);
 const choose=(role:'source'|'output',file:File|null)=>{
  epoch.current++;
  activeController.current?.abort();
  activeController.current=null;
  setBusy(false);setReport(null);setError('');setManualChecked({});
  if(role==='source')setSource(file);else setOutput(file);
 };
 const review=async()=>{
  const now=++epoch.current;
  activeController.current?.abort();
  const controller=new AbortController();
  activeController.current=controller;
  setReport(null);setError('');setBusy(true);setManualChecked({});
  try{
   if(!source||!output)throw Error('원본과 저장한 PDF를 각각 지정하세요.');
   const s=await inspectPdf(source,controller.signal);
   if(epoch.current!==now)return;
   const o=await inspectPdf(output,controller.signal);
   if(epoch.current!==now)return;
   const comparison=comparePdfTokenLists(s.tokens,o.tokens);
   const documentTextOrderRisk=hasPdfDocumentTextOrderRisk(s.tokens,o.tokens);
   const perPageTextRiskPages=countPdfPerPageTokenDifferences(s.perPageTokens,o.perPageTokens);
   const perPageOrderRiskPages=countPdfPerPageOrderRisks(s.perPageTokens,o.perPageTokens);
   const vectorPageRiskPages=countPdfPageStrokeDrift(s.vectorPerPage,o.vectorPerPage);
   const rasterPageRiskPages=countPdfPageRasterDrift(s.rasterPerPage,o.rasterPerPage);
   const symbolParity=comparePdfValueLists(s.symbols,o.symbols),negationParity=comparePdfValueLists(s.negations,o.negations),linkParity=comparePdfValueLists(s.links,o.links);
    const perPageDifferences:PdfPageDifference[]|null=s.pages===o.pages?s.perPageTokens.map((source,pageIndex)=>{
     const tokenDiff=comparePdfTokenLists(source,o.perPageTokens[pageIndex]),symbolDiff=comparePdfValueLists(s.perPageSymbols[pageIndex],o.perPageSymbols[pageIndex]),negationDiff=comparePdfValueLists(s.perPageNegations[pageIndex],o.perPageNegations[pageIndex]),linkDiff=comparePdfValueLists(s.perPageLinks[pageIndex],o.perPageLinks[pageIndex]);
     const unsupported=Math.max(s.perPageUnsupportedLinks[pageIndex],o.perPageUnsupportedLinks[pageIndex]);
     return{page:pageIndex+1,missingTokens:tokenDiff.missingTokens,addedTokens:tokenDiff.addedTokens,missingNumericTokens:tokenDiff.missingNumericTokens,missingSymbols:symbolDiff.missingValues,addedSymbols:symbolDiff.addedValues,missingNegations:negationDiff.missingValues,addedNegations:negationDiff.addedValues,missingLinks:linkDiff.missingValues,addedLinks:linkDiff.addedValues,unsupportedLinks:unsupported};
    }).filter(risk=>risk.missingTokens||risk.addedTokens||risk.missingSymbols||risk.addedSymbols||risk.missingNegations||risk.addedNegations||risk.missingLinks||risk.addedLinks||risk.unsupportedLinks):null;
    const issues:string[]=[];
   if(s.sha256===o.sha256)issues.push('원본과 결과 파일 해시가 같습니다. 실제 재디자인 PDF인지 확인하세요.');
   if(!s.tokens.length)issues.push('원본에 선택 가능한 텍스트가 없습니다. OCR이나 원문 보존을 검증하지 못했습니다.');
   if(!o.tokens.length)issues.push('출력 PDF에 선택 가능한 텍스트가 없습니다.');
   if(comparison.missingTokens)issues.push('결과 PDF에 없는 원본 토큰이 있습니다.');
   if(comparison.missingNumericTokens)issues.push('결과 PDF에 없는 숫자 포함 토큰이 있습니다.');
   if(comparison.addedTokens)issues.push('원본에 없는 출력 토큰이 있습니다. 추가·중복 여부를 확인하세요.');
    if(symbolParity.missingValues||symbolParity.addedValues)issues.push('기호·구두점·부호 차이가 감지되었습니다. 통화·괄호·숫자 부호를 원본과 대조하세요.');
    if(negationParity.missingValues||negationParity.addedValues)issues.push('부정·금지·미승인 표현 차이가 감지되었습니다. 문장 의미를 수동 대조하세요.');
    if(linkParity.missingValues||linkParity.addedValues)issues.push('보이는 URL 또는 PDF 링크 대상 차이가 감지되었습니다.');
    if(s.unsupportedLinks||o.unsupportedLinks)issues.push('일부 PDF 링크 대상을 자동 분류하지 못했습니다. 해당 링크를 직접 확인하세요.');
   if(documentTextOrderRisk)issues.push('문서 전체의 추출 텍스트 순서가 변경되었습니다. 섹션·표·다단 읽기 순서를 검수하세요.');
   if(s.pages!==o.pages)issues.push('원본과 결과의 페이지 수가 다릅니다. 페이지 배치와 누락을 확인하세요.');
   else if(perPageTextRiskPages!==null&&perPageTextRiskPages>0)
    issues.push('전체 텍스트 수는 같아도 같은 번호 페이지의 내용이 다릅니다. 재배치·누락을 확인하세요.');
   if(perPageOrderRiskPages!==null&&perPageOrderRiskPages>0)
    issues.push('같은 페이지에서 추출된 텍스트 순서가 바뀌었습니다. 표·숫자 연결과 읽기 순서를 확인하세요.');
   if(s.rasterDraws!==o.rasterDraws)issues.push('원본과 결과의 이미지 그리기 수가 다릅니다.');
   if(rasterPageRiskPages!==null&&rasterPageRiskPages>0)
    issues.push('전체 이미지 수가 같더라도 페이지별 이미지 그리기 수가 다릅니다. 이미지 위치·누락을 확인하세요.');
   if(s.vectorStrokes!==o.vectorStrokes)
    issues.push('원본과 결과의 벡터 선 그리기 수가 다릅니다. 표 테두리·구분선 누락 여부를 확인하세요.');
   if(vectorPageRiskPages!==null&&vectorPageRiskPages>0)
    issues.push('같은 번호 페이지에서 벡터 선 그리기 수가 다릅니다. 표·도형 위치 변경을 확인하세요.');
   if(s.nonA4)issues.push('원본에 A4가 아닌 페이지가 있습니다.');
    if(o.nonA4)issues.push('출력 중 A4가 아닌 페이지가 있습니다.');
   setReport({
    format:'astra-step7-local-pdf-parity-v1',
    sourceSha256:s.sha256,outputSha256:o.sha256,
    sourcePages:s.pages,outputPages:o.pages,
    sourceRasterDraws:s.rasterDraws,outputRasterDraws:o.rasterDraws,
    sourceVectorStrokes:s.vectorStrokes,outputVectorStrokes:o.vectorStrokes,vectorPageRiskPages,rasterPageRiskPages,
    sourceNonA4Pages:s.nonA4,outputNonA4Pages:o.nonA4,sourceSymbolCount:s.symbols.length,outputSymbolCount:o.symbols.length,missingSymbols:symbolParity.missingValues,addedSymbols:symbolParity.addedValues,sourceNegationCount:s.negations.length,outputNegationCount:o.negations.length,missingNegations:negationParity.missingValues,addedNegations:negationParity.addedValues,sourceLinkTargets:s.links.length,outputLinkTargets:o.links.length,missingLinkTargets:linkParity.missingValues,addedLinkTargets:linkParity.addedValues,sourceUnsupportedLinkAnnotations:s.unsupportedLinks,outputUnsupportedLinkAnnotations:o.unsupportedLinks,perPageDifferences,perPageTextRiskPages,perPageOrderRiskPages,documentTextOrderRisk,
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
     저장된 문서·원본 파일은 변경하지 않고, 선택 텍스트·숫자·기호·부정 표현·URL/PDF 링크 대상·페이지별 차이와 A4·이미지 신호를 비교합니다.
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
     onClick={()=>downloadPdfReview(report,manualChecked)}>검수 결과 JSON 저장</button>}
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
      <dt>기호·구두점 수</dt><dd>원본 {report.sourceSymbolCount} / 결과 {report.outputSymbolCount}</dd>
      <dt>빠진 기호/구두점</dt><dd>{report.missingSymbols}</dd>
      <dt>추가 기호/구두점</dt><dd>{report.addedSymbols}</dd>
      <dt>부정 표현 수</dt><dd>원본 {report.sourceNegationCount} / 결과 {report.outputNegationCount}</dd>
      <dt>빠진 부정 표현</dt><dd>{report.missingNegations}</dd>
      <dt>추가 부정 표현</dt><dd>{report.addedNegations}</dd>
      <dt>링크 신호 수</dt><dd>원본 {report.sourceLinkTargets} / 결과 {report.outputLinkTargets}</dd>
      <dt>빠진 링크 대상</dt><dd>{report.missingLinkTargets}</dd>
      <dt>추가 링크 대상</dt><dd>{report.addedLinkTargets}</dd>
      <dt>분류하지 못한 링크</dt><dd>원본 {report.sourceUnsupportedLinkAnnotations} / 결과 {report.outputUnsupportedLinkAnnotations}</dd>
      <dt>페이지별 차이 위치</dt><dd data-pdf-review-page-differences>{report.perPageDifferences===null?'페이지 수 달라 비교 불가':report.perPageDifferences.length?report.perPageDifferences.map(item=>item.page+'페이지').join(', '):'신호 없음'}</dd>
     <dt>이미지 그리기</dt><dd>원본 {report.sourceRasterDraws} / 결과 {report.outputRasterDraws}</dd>
     <dt>벡터 선 그리기</dt><dd>원본 {report.sourceVectorStrokes} / 결과 {report.outputVectorStrokes}</dd>
     <dt>페이지별 벡터 위험</dt><dd>{report.vectorPageRiskPages===null?'페이지 수 달라 비교 불가':report.vectorPageRiskPages}</dd>
     <dt>페이지별 이미지 위험</dt><dd>{report.rasterPageRiskPages===null?'페이지 수 달라 비교 불가':report.rasterPageRiskPages}</dd>
     <dt>원본 비A4 페이지</dt><dd>{report.sourceNonA4Pages}</dd>
      <dt>출력 비A4 페이지</dt><dd>{report.outputNonA4Pages}</dd>
     <dt>페이지별 텍스트 위험</dt><dd>{report.perPageTextRiskPages===null?'페이지 수 달라 비교 불가':report.perPageTextRiskPages}</dd>
     <dt>페이지 내 텍스트 순서 위험</dt><dd>{report.perPageOrderRiskPages===null?'페이지 수 달라 비교 불가':report.perPageOrderRiskPages}</dd>
     <dt>문서 전체 읽기 순서</dt><dd>{report.documentTextOrderRisk?'검토 필요':'신호 없음'}</dd>
    </dl>
    {report.issues.length>0&&<ul>{report.issues.map((issue,i)=><li key={i}>{issue}</li>)}</ul>}
    <fieldset className="panel" data-pdf-review-manual aria-label="소유자 수동 PDF 품질 점검">
     <legend><strong>수동 원본 대조 — {manualCount}/{MANUAL_REVIEW_ITEMS.length} 확인</strong></legend>
     <p className="help-text">실제 원본과 결과 PDF를 옆에 놓고 확인한 항목만 표시하세요. 이 기록은 현재 파일 쌍에만 적용되며 파일 변경 시 초기화됩니다. 판매 승인이 아닙니다.</p>
     {MANUAL_REVIEW_ITEMS.map(item=><label className="field" key={item.id}>
      <input type="checkbox" data-pdf-review-manual-check={item.id}
       checked={manualChecked[item.id]===true}
       onChange={event=>setManualChecked(before=>({...before,[item.id]:event.target.checked}))}/>
      {item.label}
     </label>)}
     <p role="status" data-pdf-review-manual-status>{manualCount===MANUAL_REVIEW_ITEMS.length?
      '수동 점검 7/7 기록됨 · 원문 충실도 및 판매 승인 아님':
      '수동 점검 미완료 · 출시 승인 아님'}</p>
    </fieldset>
    <p className="warning">원문 충실도 미인증 · 법적 권리/라이선스 미검증 · 실제 고객 Windows 검증 미실행 · 판매 승인 NOT_GRANTED</p>
   </section>}
  </section>
 </main>;
}
