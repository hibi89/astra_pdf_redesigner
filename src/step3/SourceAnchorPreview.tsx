import {useEffect,useRef,useState} from 'react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {anchorRectangle} from './sourceReview.ts';
import type {PdfBlockOrigin} from '../step2/model.ts';

interface Props {url:string;origin:PdfBlockOrigin;blockId:string}
export default function SourceAnchorPreview({url,origin,blockId}:Props){
  const canvas=useRef<HTMLCanvasElement|null>(null);
  const renderBarrier=useRef<Promise<void>>(Promise.resolve());
  const [view,setView]=useState<{width:number;height:number}|null>(null);
  const [problem,setProblem]=useState('');
  useEffect(()=>{
    let stopped=false;
    let loading:import('pdfjs-dist').PDFDocumentLoadingTask|undefined;
    let rendering:ReturnType<import('pdfjs-dist').PDFPageProxy['render']>|undefined;
    setView(null);setProblem('');
    async function draw(){
      try{
        const {getDocument,GlobalWorkerOptions}=await import('pdfjs-dist');
        GlobalWorkerOptions.workerSrc=workerUrl;
        const response=await fetch(url);
        if(!response.ok)throw Error('Local PDF source unavailable');
        const bytes=new Uint8Array(await response.arrayBuffer());
        if(stopped)return;
        loading=getDocument({data:bytes,stopAtErrors:true});
        const pdf=await loading.promise;
        if(stopped)return;
        if(origin.page>pdf.numPages)throw Error('Source page is out of range');
        const page=await pdf.getPage(origin.page);
        const viewport=page.getViewport({scale:1});
        const surface=canvas.current;
        if(!surface||stopped)return;
        const ctx=surface.getContext('2d');
        if(!ctx)throw Error('Canvas unavailable');
        // PDF.js cannot render into one canvas concurrently. A new source
        // selection may arrive before the cancelled render has settled.
        await renderBarrier.current;
        if(stopped)return;
        surface.width=Math.ceil(viewport.width);
        surface.height=Math.ceil(viewport.height);
        rendering=page.render({canvas:surface,canvasContext:ctx,viewport});
        const renderPromise=rendering.promise;
        renderBarrier.current=renderPromise.catch(()=>{});
        await renderPromise;
        if(!stopped)setView({width:viewport.width,height:viewport.height});
      }catch(error){
        if(!stopped)setProblem(error instanceof Error?error.message:'원본 페이지를 표시할 수 없습니다.');
      }
    }
    void draw();
    return()=>{stopped=true;rendering?.cancel();void loading?.destroy().catch(()=>{});};
  },[url,origin.page]);
  const rect=view?anchorRectangle(origin,view.width,view.height):null;
  return <div className="m06-origin-preview" data-m06-preview data-m06-block-id={blockId}
    data-m06-rendered-page={view?origin.page:undefined}>
    <p className="help-text">원본 {origin.page}페이지 · 좌상단 기준 x={origin.x}pt, y={origin.y}pt.
      아래 강조 영역은 추출된 블록의 **추정 좌표**이며 글자별·표 셀별 정확도 보증이 아닙니다.</p>
    {problem&&<p className="warning" role="alert">원본 위치 표시 실패: {problem}. PDF 기본 뷰에서 직접 확인하세요.</p>}
    <div className="m06-page-surface">
      <canvas ref={canvas} aria-label={`원본 PDF ${origin.page}페이지`}/>
      {rect&&<div className="m06-origin-highlight" data-m06-anchor-rect
        style={{left:(rect.x/view!.width*100)+'%',top:(rect.y/view!.height*100)+'%',
          width:(rect.width/view!.width*100)+'%',height:(rect.height/view!.height*100)+'%'}}/>}
    </div>
  </div>;
}
