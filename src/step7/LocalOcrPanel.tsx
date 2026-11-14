import {useEffect,useRef,useState} from 'react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {pageNeedsOcr} from './ocrEligibility.ts';

// Source PDF remains in renderer memory. OCR outputs are never written to V1/V2.
// This is an owner-reviewed draft only; scanned text is not authenticated.
const MAX_PDF_BYTES=30*1024*1024;
const MAX_PAGES=50;
const MAX_PIXELS=8_000_000;
const MAX_CANVAS_EDGE=4096;
export default function LocalOcrPanel(){
 const [available,setAvailable]=useState(false);
 const [status,setStatus]=useState('로컬 OCR 엔진을 확인 중입니다.');
 const [source,setSource]=useState<File|null>(null);
 const [pageNumber,setPageNumber]=useState(1);
 const [layoutMode,setLayoutMode]=useState<3|6>(6);
 const [text,setText]=useState('');
 const [draftOrigin,setDraftOrigin]=useState<{page:number;mode:3|6}|null>(null);
 const [draftEdited,setDraftEdited]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const epoch=useRef(0);
 useEffect(()=>{
  let active=true;
  const bridge=window.astraDesktop?.localOcrStatus;
  if(!bridge){setStatus('브라우저 모드에서는 OCR을 실행할 수 없습니다. 로컬 Windows 설치형에서 사용하세요.');return;}
  void bridge().then(result=>{
   if(!active)return;
   const ok=result.status==='available';
   setAvailable(ok);
   setStatus(ok?'로컬 Tesseract 엔진과 한글·영문 언어팩 해시 검증 완료':
    'OCR 실행파일·한글/영문 언어팩이 정식 검증·포함되지 않아 사용 불가');
  }).catch(()=>{if(active)setStatus('OCR 엔진 상태 확인 실패. 자동 실행하지 않습니다.');});
  return()=>{active=false;epoch.current++;void window.astraDesktop?.localOcrCancel?.();};
 },[]);
 const choose=(file:File|null)=>{
  epoch.current++;
  if(busy)void window.astraDesktop?.localOcrCancel?.();
  setBusy(false);setText('');setDraftOrigin(null);setDraftEdited(false);setError('');setPageNumber(1);
  if(!file){setSource(null);return;}
  if(!/\.pdf$/i.test(file.name)||file.size<10||file.size>MAX_PDF_BYTES){
   setSource(null);setError('30MiB 이하 PDF 파일만 선택하세요.');return;
  }
  setSource(file);
 };
 const cancel=()=>{
  epoch.current++;setBusy(false);setText('');setDraftOrigin(null);setDraftEdited(false);setError('OCR 실행을 취소했습니다. 기존 문서에는 변경이 없습니다.');
  void window.astraDesktop?.localOcrCancel?.();
 };
 const run=async()=>{
  if(!source||!available||busy||!window.astraDesktop?.localOcrRecognizePng)return;
  const token=++epoch.current;
  const current=()=>epoch.current===token;
  setBusy(true);setText('');setDraftOrigin(null);setDraftEdited(false);setError('');
  let loader:null|{destroy:()=>Promise<void>}=null;
  try{
   const bytes=await source.arrayBuffer();if(!current())return;
   if(String.fromCharCode(...new Uint8Array(bytes.slice(0,5)))!=='%PDF-')throw Error('유효하지 않은 PDF 헤더입니다.');
   const pdfjs=await import('pdfjs-dist');if(!current())return;
   pdfjs.GlobalWorkerOptions.workerSrc=workerUrl;
   const task=pdfjs.getDocument({data:new Uint8Array(bytes),stopAtErrors:true,useSystemFonts:true});
   loader=task;
   const pdf=await task.promise;if(!current())return;
   if(pdf.numPages<1||pdf.numPages>MAX_PAGES||pageNumber>pdf.numPages)
    throw Error('50페이지 이내 PDF의 존재하는 페이지를 선택하세요.');
   const page=await pdf.getPage(pageNumber);if(!current())return;
   const textContent=await page.getTextContent();if(!current())return;
   if(!pageNeedsOcr(textContent.items))throw Error('이 페이지에는 선택 가능한 원문 텍스트가 있습니다. OCR로 덮어쓰지 말고 기존 PDF 검수 기능을 이용하세요.');
   const native=page.getViewport({scale:1});
   if(!Number.isFinite(native.width)||!Number.isFinite(native.height)||
      native.width<1||native.height<1)
    throw Error('스캔 페이지 크기가 올바르지 않습니다.');
   const scale=Math.min(2,Math.sqrt(MAX_PIXELS/(native.width*native.height)),
    MAX_CANVAS_EDGE/native.width,MAX_CANVAS_EDGE/native.height);
   if(!Number.isFinite(scale)||scale<0.01)throw Error('페이지가 OCR 허용 크기를 초과했습니다.');
   const viewport=page.getViewport({scale});
   const canvas=document.createElement('canvas');
   canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
   if(canvas.width*canvas.height>MAX_PIXELS||
      canvas.width>MAX_CANVAS_EDGE||canvas.height>MAX_CANVAS_EDGE||
      canvas.width<1||canvas.height<1)
    throw Error('OCR 래스터 크기 상한을 초과했습니다.');
   const ctx=canvas.getContext('2d');if(!ctx)throw Error('로컬 PDF 이미지 렌더링을 준비하지 못했습니다.');
   await page.render({canvas,canvasContext:ctx,viewport}).promise;if(!current())return;
   const blob=await new Promise<Blob>((resolve,reject)=>
    canvas.toBlob(item=>item?resolve(item):reject(Error('PNG로 변환하지 못했습니다.')),'image/png'));
   canvas.width=0;canvas.height=0;
   if(!current())return;
   const response=await window.astraDesktop.localOcrRecognizePng(new Uint8Array(await blob.arrayBuffer()),layoutMode);
   if(!current())return;
   if(response.status==='review'&&response.reviewOnly===true&&response.approved===false&&response.externalTransfer===false&&typeof response.text==='string'){
    setText(response.text);
    setDraftOrigin({page:pageNumber,mode:layoutMode});
   }else throw Error(response.status==='unavailable'?'OCR 엔진 파일이 아직 포함되지 않았습니다.':
    response.reason==='cancelled'?'OCR 실행을 취소했습니다.':'OCR 결과를 확인할 수 없습니다. 다른 페이지를 시도하세요.');
  }catch(e){if(current())setError(e instanceof Error?e.message:'OCR 분석이 실패했습니다.');}
  finally{
   if(loader)await loader.destroy().catch(()=>{});
   if(current())setBusy(false);
  }
 };
 return <section className="panel no-print" aria-label="STEP7 무료 로컬 OCR 검수" data-step7-local-ocr>
  <h2>STEP7 · 스캔 PDF 한 페이지 로컬 OCR</h2>
  <p className="help-text">선택한 PDF 페이지를 이 기기에서 PNG로 변환하고, 검증된 Tesseract가 있을 때만 한글·영문을 인식합니다. 자동 반영·자동 저장·외부 전송은 하지 않습니다. 숫자·표·다단·원문 일치 여부는 직접 대조해야 합니다.</p>
  <p role="status" data-step7-ocr-status>{status}</p>
  <label className="field">스캔 PDF 파일
   <input type="file" accept=".pdf,application/pdf" data-step7-ocr-file disabled={busy||!available}
    onChange={e=>{choose(e.target.files?.[0]??null);e.target.value='';}}/>
  </label>
  {source&&<label className="field">대조할 페이지 번호 (1~{MAX_PAGES})
   <input type="number" min="1" max={MAX_PAGES} value={pageNumber} disabled={busy}
    data-step7-ocr-page onChange={e=>{
     setPageNumber(Math.max(1,Math.min(MAX_PAGES,Number(e.target.value)||1)));
     setText('');setDraftOrigin(null);setDraftEdited(false);setError('');
    }}/>
  </label>}
  <label className="field">스캔 페이지 구성
   <select data-step7-ocr-layout-mode value={layoutMode} disabled={busy||!available}
    onChange={e=>{
     setLayoutMode(e.target.value==='3'?3:6);
     setText('');setDraftOrigin(null);setDraftEdited(false);setError('');
    }}>
    <option value={6}>일반 단락 한 영역 (PSM 6)</option>
    <option value={3}>표·여러 영역 자동 분석 (PSM 3)</option>
   </select>
  </label>
  <p className="help-text">PSM 6은 일반 문장·단일 영역 기본값입니다. PSM 3은 여러 칸·표를 시도하는 검수용 선택지로, 단문에서 글자 누락이 클 수 있습니다. 어느 방식이든 숫자·부정문·표 셀 순서를 원본과 대조하세요. 페이지 또는 모드를 바꾸면 이전 OCR 초안은 지워집니다.</p>
  <div className="toolbar">
   <button type="button" disabled={!available||!source||busy} data-step7-ocr-run onClick={()=>void run()}>선택한 페이지 OCR 초안 생성</button>
   {busy&&<button type="button" className="secondary-button" data-step7-ocr-cancel onClick={cancel}>인식 취소</button>}
  </div>
  {error&&<p className="warning" role="alert" data-step7-ocr-error>{error}</p>}
  {text&&<div>
   <p className="warning" role="status" data-step7-ocr-draft-origin>OCR 미승인 초안 · {draftOrigin?.page}페이지 · PSM {draftOrigin?.mode}{draftEdited?' · 수동 수정 있음':''}. 반드시 원본 PDF와 대조하고 필요한 부분만 수동으로 사용하세요.</p>
   <label className="field">검토·수정할 수 있는 OCR 초안<textarea data-step7-ocr-draft rows={10} value={text} onChange={e=>{setText(e.target.value);setDraftEdited(true);}}/></label>
   <p className="help-text">이 화면을 닫으면 초안은 사라집니다. 프로젝트·원본 PDF·저장 문서는 변경되지 않습니다.</p>
  </div>}
 </section>;
}
