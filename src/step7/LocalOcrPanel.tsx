import {useEffect,useRef,useState} from 'react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Source PDF remains in renderer memory. OCR outputs are never written to V1/V2.
// This is an owner-reviewed draft only; scanned text is not authenticated.
const MAX_PDF_BYTES=30*1024*1024;
const MAX_PAGES=50;
const MAX_PIXELS=8_000_000;
export default function LocalOcrPanel(){
 const [available,setAvailable]=useState(false);
 const [status,setStatus]=useState('로컬 OCR 엔진을 확인 중입니다.');
 const [source,setSource]=useState<File|null>(null);
 const [pageNumber,setPageNumber]=useState(1);
 const [text,setText]=useState('');
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
  setBusy(false);setText('');setError('');setPageNumber(1);
  if(!file){setSource(null);return;}
  if(!/\.pdf$/i.test(file.name)||file.size<10||file.size>MAX_PDF_BYTES){
   setSource(null);setError('30MiB 이하 PDF 파일만 선택하세요.');return;
  }
  setSource(file);
 };
 const cancel=()=>{
  epoch.current++;setBusy(false);setText('');setError('OCR 실행을 취소했습니다. 기존 문서에는 변경이 없습니다.');
  void window.astraDesktop?.localOcrCancel?.();
 };
 const run=async()=>{
  if(!source||!available||busy||!window.astraDesktop?.localOcrRecognizePng)return;
  const token=++epoch.current;
  const current=()=>epoch.current===token;
  setBusy(true);setText('');setError('');
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
   const native=page.getViewport({scale:1});
   const scale=Math.min(2,Math.sqrt(MAX_PIXELS/(native.width*native.height)));
   const viewport=page.getViewport({scale});
   const canvas=document.createElement('canvas');
   canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
   if(canvas.width*canvas.height>MAX_PIXELS)throw Error('OCR 래스터 크기 상한을 초과했습니다.');
   const ctx=canvas.getContext('2d');if(!ctx)throw Error('로컬 PDF 이미지 렌더링을 준비하지 못했습니다.');
   await page.render({canvas,canvasContext:ctx,viewport}).promise;if(!current())return;
   const blob=await new Promise<Blob>((resolve,reject)=>
    canvas.toBlob(item=>item?resolve(item):reject(Error('PNG로 변환하지 못했습니다.')),'image/png'));
   canvas.width=0;canvas.height=0;
   if(!current())return;
   const response=await window.astraDesktop.localOcrRecognizePng(new Uint8Array(await blob.arrayBuffer()));
   if(!current())return;
   if(response.status==='review'&&response.reviewOnly===true&&response.approved===false&&response.externalTransfer===false&&typeof response.text==='string'){
    setText(response.text);
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
    data-step7-ocr-page onChange={e=>setPageNumber(Math.max(1,Math.min(MAX_PAGES,Number(e.target.value)||1)))}/>
  </label>}
  <div className="toolbar">
   <button type="button" disabled={!available||!source||busy} data-step7-ocr-run onClick={()=>void run()}>선택한 페이지 OCR 초안 생성</button>
   {busy&&<button type="button" className="secondary-button" data-step7-ocr-cancel onClick={cancel}>인식 취소</button>}
  </div>
  {error&&<p className="warning" role="alert" data-step7-ocr-error>{error}</p>}
  {text&&<div>
   <p className="warning" role="status">OCR 미승인 초안입니다. 반드시 원본 PDF와 대조하고 필요한 부분만 수동으로 사용하세요.</p>
   <label className="field">검토·수정할 수 있는 OCR 초안<textarea data-step7-ocr-draft rows={10} value={text} onChange={e=>setText(e.target.value)}/></label>
   <p className="help-text">이 화면을 닫으면 초안은 사라집니다. 프로젝트·원본 PDF·저장 문서는 변경되지 않습니다.</p>
  </div>}
 </section>;
}
