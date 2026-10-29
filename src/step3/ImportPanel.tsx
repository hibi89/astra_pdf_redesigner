import {useEffect,useMemo,useRef,useState} from 'react';
import {createSourceTextMatcher,insertManualPdfBlockAtSourcePosition,isSafePdfTextSplitOffset,nextSourceReviewCount,sortSourceReviewItems,splitPdfDraftBlock,PDF_IMPORT_LIMITS,PDF_SOURCE_REVIEW_BATCH,visibleSourceReviewItems,type PdfDraft,type PdfDraftBlock,type PdfDraftPage,type PdfOrigin,type PdfRole} from './structure.ts';
import {extractLocalPdf} from './pdf.ts';
import SourceAnchorPreview from './SourceAnchorPreview.tsx';

export interface ImportedPdfSource {
  documentId:string;
  fileName:string;
  url:string;
  // Session-only original bytes for Electron PDF.js source rendering. Never persisted.
  blob:Blob;
}
// A committed source is kept in memory only for the active document. The
// caller takes sole ownership of the already-created Blob URL on success.
interface Props {
  disabled:boolean;
  onImport:(draft:PdfDraft)=>Promise<string|false>;
  onSourceCommitted:(source:ImportedPdfSource)=>void;
}
const ROLES:[PdfRole,string][]=[['paragraph','본문'],['heading','소제목'],['caption','캡션']];
const DRAFT_HISTORY_LIMIT=8;
interface MissingSourceItem {id:string;text:string;origin:PdfOrigin}
function SourceTextMissingWarning({page,onShow,onRecover}:{page:PdfDraftPage;onShow:(item:MissingSourceItem)=>void;onRecover:(item:MissingSourceItem)=>void}){
  const [visibleCount,setVisibleCount]=useState(12);
  const matcher=useMemo(()=>createSourceTextMatcher(page.sourceTextItems),[page.sourceTextItems]);
  const missing=matcher(page.blocks.filter(block=>!block.excluded).map(block=>block.text).join('\n'));
  const entries=useMemo(()=>{
    const remaining=new Map<string,number>();
    for(const text of missing)remaining.set(text,(remaining.get(text)??0)+1);
    return sortSourceReviewItems(page.sourceTextItems.flatMap((text,index)=>{
      const normalized=text.normalize('NFC').replace(/\s+/gu,'');
      const key=normalized.length>96?normalized.slice(0,96)+'…':normalized;
      const count=remaining.get(key)??0;
      if(!count)return[];
      remaining.set(key,count-1);
      const origin=page.sourceTextOrigins[index];
      return origin?[{id:`${page.number}-${index}`,text,origin}]:[];
    }));
  },[missing,page.number,page.sourceTextItems,page.sourceTextOrigins]);
  if(!missing.length)return null;
  return <div className="warning" role="status" data-step3-source-text-missing={page.number}>
    <p>원문에서 읽은 텍스트 조각 {missing.length}개가 현재 포함 내용에 없습니다. 일부러 제외했는지 확인하고 원본과 대조하세요.</p>
    <ul>{visibleSourceReviewItems(entries,visibleCount).map(item=><li key={item.id} data-step3-missing-source-item={item.id}>
      <span>{item.text.slice(0,120)}{item.text.length>120?'…':''}</span>
      <small className="help-text" data-step3-missing-source-origin={item.id}>원본 위치: {item.origin.page}페이지 · x {item.origin.x.toLocaleString('ko-KR')}pt · y {item.origin.y.toLocaleString('ko-KR')}pt</small>
      <div className="mini-actions">
        <button type="button" data-step3-show-missing-source={item.id} onClick={()=>onShow(item)}>원본 위치 보기</button>
        <button type="button" data-step3-recover-missing-source={item.id} onClick={()=>onRecover(item)}>이 원문을 수동 블록으로 추가</button>
      </div>
    </li>)}</ul>
    {entries.length>visibleCount&&<button type="button" className="secondary-button" data-step3-show-more-missing
      onClick={()=>setVisibleCount(current=>nextSourceReviewCount(current,entries.length))}>다음 누락 조각 {Math.min(PDF_SOURCE_REVIEW_BATCH,entries.length-visibleCount)}개 보기</button>}
  </div>;
}
export default function PdfImportPanel({disabled,onImport,onSourceCommitted}:Props){
  const [draft,setDraft]=useState<PdfDraft|null>(null);
  const [busy,setBusy]=useState(false),[parsing,setParsing]=useState(false);
  const [importProgress,setImportProgress]=useState<{page:number;totalPages:number}|null>(null);
  const [error,setError]=useState(''),[confirmed,setConfirmed]=useState(false);
  const [historyRevision,setHistoryRevision]=useState(0);
  const [previewUrl,setPreviewUrl]=useState('');
  const [dragging,setDragging]=useState(false);
  const [sourceBlock,setSourceBlock]=useState<PdfDraftBlock|null>(null);
  const [sourceImage,setSourceImage]=useState<PdfDraftPage['images'][number]|null>(null);
  const [missingSource,setMissingSource]=useState<MissingSourceItem|null>(null);
  const [imageUrls,setImageUrls]=useState<Record<string,string>>({});
  const splitOffsets=useRef<Record<string,number>>({});
  const [,setSplitOffsetRevision]=useState(0);
  const sourceLocationPanel=useRef<HTMLDivElement|null>(null);
  const manualBlockSequence=useRef(0);
  const urlRef=useRef('');
  const sourcePdfRef=useRef<Blob|null>(null);
  const imageUrlRef=useRef<Record<string,string>>({});
  const draftRef=useRef<PdfDraft|null>(null);
  const undoStack=useRef<PdfDraft[]>([]);
  const redoStack=useRef<PdfDraft[]>([]);
  // A PDF.js parse can finish after a workspace mode switch. Its result must
  // not allocate temporary Blob URLs or update a discarded review session.
  const requestVersion=useRef(0);
  const parseController=useRef<AbortController|null>(null);
  const unmounted=useRef(false);
  const currentSourceBlock=sourceBlock&&draft
    ?draft.pages.find(page=>page.blocks.some(block=>block.id===sourceBlock.id))?.blocks.find(block=>block.id===sourceBlock.id)??null
    :sourceBlock;
  useEffect(()=>{
    unmounted.current=false;
    return()=>{
      unmounted.current=true;
      requestVersion.current++;
      parseController.current?.abort();parseController.current=null;
      if(urlRef.current)URL.revokeObjectURL(urlRef.current);
      Object.values(imageUrlRef.current).forEach(u=>URL.revokeObjectURL(u));
    };
  },[]);
  useEffect(()=>{
    if(sourceBlock||sourceImage)sourceLocationPanel.current?.scrollIntoView({behavior:'smooth',block:'nearest'});
  },[sourceBlock?.id,sourceImage?.id]);
  const clearHistory=()=>{
    undoStack.current=[];redoStack.current=[];
    setHistoryRevision(value=>value+1);
  };
  const closeSourceLocation=()=>{setSourceBlock(null);setSourceImage(null);setMissingSource(null);};
  const publishDraft=(next:PdfDraft|null)=>{
    draftRef.current=next;setDraft(next);
  };
  const rememberSplitOffset=(id:string,offset:number)=>{
    splitOffsets.current[id]=offset;
    setSplitOffsetRevision(value=>value+1);
  };
  const reviseDraft=(update:(current:PdfDraft)=>PdfDraft)=>{
    const current=draftRef.current;
    if(!current)return;
    const next=update(current);
    if(next===current)return;
    undoStack.current=[...undoStack.current,current].slice(-DRAFT_HISTORY_LIMIT);
    redoStack.current=[];
    publishDraft(next);setConfirmed(false);
    setHistoryRevision(value=>value+1);
  };
  const undo=()=>{
    const current=draftRef.current,previous=undoStack.current.pop();
    if(!current||!previous)return;
    redoStack.current=[...redoStack.current,current].slice(-DRAFT_HISTORY_LIMIT);
    publishDraft(previous);setConfirmed(false);
    setHistoryRevision(value=>value+1);
  };
  const redo=()=>{
    const current=draftRef.current,next=redoStack.current.pop();
    if(!current||!next)return;
    undoStack.current=[...undoStack.current,current].slice(-DRAFT_HISTORY_LIMIT);
    publishDraft(next);setConfirmed(false);
    setHistoryRevision(value=>value+1);
  };
  const forget=()=>{
    // Also invalidates any in-flight PDF extraction before it can publish.
    requestVersion.current++;
    parseController.current?.abort();parseController.current=null;setImportProgress(null);
    if(urlRef.current)URL.revokeObjectURL(urlRef.current);
    Object.values(imageUrlRef.current).forEach(u=>URL.revokeObjectURL(u));
    imageUrlRef.current={};setImageUrls({});setSourceBlock(null);setSourceImage(null);setMissingSource(null);
    sourcePdfRef.current=null;urlRef.current='';setPreviewUrl('');publishDraft(null);setError('');setConfirmed(false);clearHistory();
  };
  const choose=async(file:File)=>{
    forget();
    const version=requestVersion.current;
    const isCurrent=()=>!unmounted.current&&requestVersion.current===version;
    const controller=new AbortController();parseController.current=controller;
    setBusy(true);
    setParsing(true);
    try{
      const parsed=await extractLocalPdf(file,{signal:controller.signal,onProgress:progress=>{
        if(isCurrent())setImportProgress(progress);
      }});
      if(!isCurrent())return; // switched/closed/superseded; never own an orphan Blob
      // The source file remains an ephemeral browser Blob URL only during review.
      const url=URL.createObjectURL(file);urlRef.current=url;setPreviewUrl(url);
      sourcePdfRef.current=file;
      const imageMap:Record<string,string>={};
      for(const page of parsed.pages)for(const image of page.images)imageMap[image.id]=URL.createObjectURL(image.blob);
      imageUrlRef.current=imageMap;setImageUrls(imageMap);
      publishDraft(parsed);
    }catch(e){
      if(isCurrent())setError(e instanceof Error?e.message:'PDF에서 내용을 추출할 수 없습니다.');
    }finally{
      if(isCurrent()){parseController.current=null;setBusy(false);setParsing(false);setImportProgress(null);}
    }
  };
  const cancel=()=>{
    // Parsing is still read-only. Invalidate the outstanding request and let
    // users choose a replacement immediately; never interrupt a saving write.
    if(busy&&!parsing)return;
    forget();setParsing(false);setBusy(false);
  };
  const dropFiles=(files:FileList)=>{
    setDragging(false);
    if(disabled||busy)return;
    if(files.length!==1){forget();setError('PDF 파일 하나만 놓아 주세요.');return;}
    if(!/\.pdf$/i.test(files[0].name)){forget();setError('확장자가 .pdf인 파일 하나만 놓아 주세요.');return;}
    void choose(files[0]);
  };
  const change=(page:number,id:string,fn:(old:PdfDraftBlock)=>PdfDraftBlock)=>{
    // Review consent describes a specific draft; editing revokes that consent.
    reviseDraft(current=>({...current,pages:current.pages.map(p=>p.number===page?{...p,
      blocks:p.blocks.map(b=>b.id===id?fn(b):b),
    }:p)}));
  };
  const move=(page:number,id:string,delta:-1|1)=>{
    reviseDraft(current=>({...current,pages:current.pages.map(p=>{
      if(p.number!==page)return p;
      const i=p.blocks.findIndex(b=>b.id===id),to=i+delta;
      if(i<0||to<0||to>=p.blocks.length)return p;
      const copy=[...p.blocks];[copy[i],copy[to]]=[copy[to],copy[i]];
      return {...p,blocks:copy};
    })}));
  };
  const addManualBlock=(page:number,text='',sourceOrigin?:PdfOrigin)=>{
    if(totalBlocks>=PDF_IMPORT_LIMITS.blocks){setError('검수 블록이 2,500개 제한에 도달했습니다.');return;}
    manualBlockSequence.current++;
    const block:PdfDraftBlock={id:'manual-'+manualBlockSequence.current,role:'paragraph',text,manual:true,excluded:false};
    reviseDraft(current=>({...current,pages:current.pages.map(p=>p.number===page?{
      ...p,blocks:insertManualPdfBlockAtSourcePosition(p.blocks,block,sourceOrigin),
    }:p)}));
    setMissingSource(null);
  };
  const removeManualBlock=(page:number,id:string)=>reviseDraft(current=>({...current,pages:current.pages.map(p=>p.number===page?
    {...p,blocks:p.blocks.filter(b=>b.id!==id)}:p)}));
  const splitBlockAtCursor=(page:number,id:string)=>{
    const offset=splitOffsets.current[id];
    if(!Number.isSafeInteger(offset))return;
    const blockCount=draftRef.current?.pages.reduce((count,current)=>count+current.blocks.length,0)??0;
    if(blockCount>=PDF_IMPORT_LIMITS.blocks){setError('검수 블록이 2,500개 제한에 도달했습니다.');return;}
    manualBlockSequence.current++;
    reviseDraft(current=>({...current,pages:current.pages.map(p=>{
      if(p.number!==page)return p;
      const index=p.blocks.findIndex(block=>block.id===id);
      if(index<0)return p;
      const [before,after]=splitPdfDraftBlock(p.blocks[index],offset,`split-${manualBlockSequence.current}`);
      delete splitOffsets.current[id];
      return {...p,blocks:[...p.blocks.slice(0,index),before,after,...p.blocks.slice(index+1)]};
    })}));
  };
  const toggleImage=(page:number,id:string,include:boolean)=>{
    reviseDraft(current=>({...current,pages:current.pages.map(p=>p.number===page?
      {...p,images:p.images.map(img=>img.id===id?{...img,include}:img)}:p)}));
  };
  const commit=async()=>{
    if(!draft||!confirmed||busy||disabled)return;
    setBusy(true);
    try{
      if(!draft.pages.some(p=>p.blocks.some(b=>!b.excluded&&b.text.trim())))throw Error('확인된 본문이 비어 있습니다.');
      if(draft.pages.some(p=>p.blocks.some(b=>!b.excluded&&!b.text.trim())))throw Error('빈 텍스트 블록이 있습니다. 내용을 입력하거나 새 문서에서 제외하세요.');
      const documentId=await onImport(draft);
      if(documentId){
        const url=urlRef.current;
        if(!url)throw Error('원본 PDF 비교 주소가 없습니다.');
        const blob=sourcePdfRef.current;
        if(!blob)throw new Error('원본 PDF가 검수 세션에서 만료되었습니다. 다시 선택해 주세요.');
        onSourceCommitted({documentId,fileName:draft.fileName,url,blob});
        // Ownership transferred to the studio; do not revoke this one URL.
        urlRef.current='';
        forget();
      }else setError('문서함 저장에 실패했습니다. 추출 결과는 유지됩니다. 기존 문서는 변경하지 않았습니다.');
    }catch(e){setError(e instanceof Error?e.message:'PDF 문서 저장 실패');}
    finally{setBusy(false);}
  };
  const totalBlocks=draft?.pages.reduce((s,p)=>s+p.blocks.length,0)??0;
  const includedTextBlocks=draft?.pages.reduce((s,p)=>s+p.blocks.filter(b=>!b.excluded&&b.text.trim()).length,0)??0;
  const includedEmptyBlocks=draft?.pages.reduce((s,p)=>s+p.blocks.filter(b=>!b.excluded&&!b.text.trim()).length,0)??0;
  const excludedTextBlocks=draft?.pages.reduce((s,p)=>s+p.blocks.filter(b=>b.excluded).length,0)??0;
  const detected=draft?.pages.reduce((s,p)=>s+p.imageCount,0)??0;
  const recovered=draft?.pages.reduce((s,p)=>s+p.images.length,0)??0;
  const included=draft?.pages.reduce((s,p)=>s+p.images.filter(i=>i.include).length,0)??0;
  const vectorPaints=draft?.pages.reduce((s,p)=>s+p.vectorPaintCount,0)??0;
  const transparencySignals=draft?.pages.reduce((s,p)=>s+p.compositionRisk.transparencySignals,0)??0;
  const formScopes=draft?.pages.reduce((s,p)=>s+p.compositionRisk.formScopes,0)??0;
  return <section id="astra-pdf-import" tabIndex={-1} className="panel step3-import-panel no-print" aria-labelledby="pdf-import-title">
    <div className="panel-heading"><h2 id="pdf-import-title">STEP 3 · 기존 PDF 가져오기</h2><span className="panel-caption">텍스트 선택 가능한 단일 열 PDF</span></div>
    <p className="help-text">파일은 이 브라우저에서만 분석합니다. 외부로 전송하지 않고, 검수·확정 전에는 기존 문서함을 변경하지 않습니다.</p>
    <div className={`step3-dropzone ${dragging?'is-dragging':''}`} data-m06b-dropzone
      onDragOver={e=>{if(!e.dataTransfer.types.includes('Files'))return;e.preventDefault();
        e.dataTransfer.dropEffect=disabled||busy?'none':'copy';if(!disabled&&!busy)setDragging(true);}}
      onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))setDragging(false);}}
      onDrop={e=>{e.preventDefault();dropFiles(e.dataTransfer.files);}}>
      <p>여기로 PDF 한 개를 끌어 놓거나 파일 선택으로 불러오세요.</p>
      <label className="field">원본 PDF 선택
        <input aria-label="원본 PDF 선택" type="file" accept=".pdf,application/pdf" disabled={disabled||busy}
          onChange={e=>{const f=e.target.files?.[0];e.target.value='';if(f)void choose(f);}}/>
      </label>
    </div>
    {busy&&parsing&&<p role="status" data-step3-import-progress={importProgress?.page??0} data-step3-import-total={importProgress?.totalPages??0}>
      {importProgress?`PDF ${importProgress.page}/${importProgress.totalPages}페이지 분석 중…`:'PDF 파일을 열고 분석을 준비하는 중입니다…'}
    </p>}
    {busy&&!parsing&&<p role="status">새 문서를 저장하는 중입니다…</p>}
    {busy&&parsing&&<div className="toolbar"><button className="secondary-button" onClick={cancel}>가져오기 취소</button></div>}
    {!!error&&<p className="warning" role="alert">{error}</p>}
    {draft&&<>
      <p className="help-text">원본: {draft.fileName} · {draft.pageCount}페이지 · 추출 {draft.totalChars.toLocaleString('ko-KR')}자 · 편집 가능한 텍스트 블록 {totalBlocks}개 · 새 문서 포함 {includedTextBlocks}개 · 제외 {excludedTextBlocks}개</p>
      <p className="help-text" data-step3-image-count>이미지 감지 {detected}건 · PNG 복원 {recovered}건 · 저장 선택 {included}건 · 미복원 {Math.max(0,detected-recovered)}건</p>
      <p className="help-text" data-step3-vector-count>원본 벡터 경로 관련 명령 {vectorPaints}회 · 선/도형·표 구조 자동 복원 미지원 (명령 수, 도형/셀 개수 아님)</p>
      <p className="help-text" data-step3-composition-count>투명도·합성 위험 신호 {transparencySignals}건 · Form XObject 범위 {formScopes}건 · 원본 합성 효과의 동일 복원 미보장 (객체 수·복원 성공률 아님)</p>
      <div className="warning" role="status"><strong>완전 복원이 아닙니다.</strong> 텍스트 분류·위치·줄바꿈·공백은 추정입니다. 이미지·표·도형이 누락될 수 있습니다. 원본을 대조해 수정하세요.</div>
      <details data-step3-acceptance-checklist open>
        <summary>원본 대조 체크리스트 · 저장 전 확인</summary>
        <ul>
          <li>텍스트·숫자·기호: 각 페이지의 누락·중복·줄바꿈을 원본과 비교하세요.</li>
          <li>다단·표의 읽기 순서: 좌우 열과 표 셀의 내용 순서를 확인하세요. {draft.warnings.some(w=>w.includes('열 또는 넓은 텍스트 간격'))?'순서 위험 경고가 있습니다.':'자동 검사에서 경고가 없어도 정확한 순서는 보장되지 않습니다.'}</li>
          <li>표 선·벡터 도형: 원본에 있는 격자·셀 경계와 표시되지 않은 도형을 확인하세요. {vectorPaints>0?'경로 관련 명령 '+vectorPaints+'회 감지됐습니다.':'관련 명령 0회는 그래픽 보존을 증명하지 않습니다.'}</li>
          <li>이미지: 원본과 PNG 복원·색상·자르기·위치를 대조하세요. 감지 {detected}건, 복원 {recovered}건, 미복원 {Math.max(0,detected-recovered)}건. Form·투명도 합성은 원형 재현이 보장되지 않습니다.</li>
        </ul>
        <p className="help-text">경고 및 자동 집계는 손실 위험을 안내할 뿐 복원 정확도나 표 구조 보존을 보증하지 않습니다.</p>
      </details>
      <details open><summary>추출 경고·검토 사항 {draft.warnings.length}건</summary>
        <ul>{draft.warnings.map((message,i)=><li key={i}>{message}</li>)}</ul>
      </details>
      <div className="toolbar" aria-label="PDF 추출 내용 편집 기록" data-step3-history-revision={historyRevision}>
        <button type="button" className="secondary-button" data-step3-undo disabled={disabled||busy||undoStack.current.length===0}
          onClick={undo}>실행 취소</button>
        <button type="button" className="secondary-button" data-step3-redo disabled={disabled||busy||redoStack.current.length===0}
          onClick={redo}>다시 실행</button>
        <span className="help-text">검수 편집 최근 {DRAFT_HISTORY_LIMIT}단계까지 되돌릴 수 있습니다. 되돌리기/다시 실행 후에는 원본 확인 동의를 다시 선택해야 합니다.</span>
      </div>
      <div className="step3-source-compare">
        {(currentSourceBlock?.origin||sourceImage||missingSource)&&previewUrl&&<div ref={sourceLocationPanel} className="panel"
          data-step3-selected-source-block={currentSourceBlock?.id} data-step3-selected-source-image={sourceImage?.id} data-step3-selected-missing-source={missingSource?.id}>
          <div className="panel-heading"><h3>{sourceImage?'선택한 복원 이미지의 원본 위치':missingSource?'누락된 원문 조각의 위치':'선택한 추출 블록의 원본 위치'}</h3>
            <button type="button" className="secondary-button" onClick={closeSourceLocation}>위치 닫기</button></div>
          {currentSourceBlock&&currentSourceBlock.sourceText!==undefined&&currentSourceBlock.text!==currentSourceBlock.sourceText?<>
            <p className="help-text" data-step3-source-excerpt>PDF.js 추출 원문: {currentSourceBlock.sourceText}</p>
            <p className="help-text" data-step3-edited-excerpt>현재 수정 내용: {currentSourceBlock.text}</p>
          </>:currentSourceBlock&&<p className="help-text" data-step3-source-excerpt>추출 내용: {currentSourceBlock.text}</p>}
          {missingSource&&<p className="help-text" data-step3-missing-source-excerpt>추출 누락 원문: {missingSource.text}</p>}
          {sourceImage&&imageUrls[sourceImage.id]&&<img src={imageUrls[sourceImage.id]} className="step3-image-thumbnail" alt="원본 위치 대조용 복원 이미지"/>}
          <SourceAnchorPreview url={previewUrl} blob={sourcePdfRef.current??undefined} origin={currentSourceBlock?.origin??sourceImage?.origin??missingSource!.origin} blockId={currentSourceBlock?.id??sourceImage?.id??missingSource!.id}/>
          <p className="help-text">강조 영역은 추출 텍스트 블록 또는 복원 이미지의 추정 위치이며, 문자별·클리핑 정확도를 보장하지 않습니다.</p>
        </div>}
        {previewUrl&&<details><summary>원본 PDF 열어 대조</summary>
          <iframe title="원본 PDF 대조" src={previewUrl} width="100%" height="400"/>
          <p className="help-text">원본 PDF는 가져오기 검수 화면에서만 일시적으로 열립니다. 문서함에는 원본 PDF 자체를 저장하지 않습니다.</p>
        </details>}
        <div className="step3-block-review">
          {draft.pages.map(page=><details key={page.number} open={page.number===1}>
            <summary>원본 {page.number}페이지 — <span data-step3-page-block-count={page.number}>{page.blocks.length}</span>개 텍스트 · <span data-step3-page-char-count={page.number}>{page.blocks.reduce((count,block)=>count+block.text.length,0).toLocaleString('ko-KR')}</span>자 · 새 문서 제외 {page.blocks.filter(b=>b.excluded).length}개 · 이미지 {page.images.length}/{page.imageCount}복원{page.omittedImages?' · 미복원 '+page.omittedImages+'건':''}{page.vectorPaintCount?' · 벡터 경로 '+page.vectorPaintCount+'회':''}{page.reviewFlags.length?' · 추출 품질 확인 '+page.reviewFlags.length+'건':''}</summary>
            {page.reviewFlags.map((flag,i)=><p className="warning" role="status" data-step3-page-review-flag={page.number} key={i}>{flag}</p>)}
            <SourceTextMissingWarning page={page} onShow={item=>{setSourceBlock(null);setSourceImage(null);setMissingSource(item);}}
              onRecover={item=>{addManualBlock(page.number,item.text,item.origin);setSourceBlock(null);setSourceImage(null);}}/>
            {page.images.length>0&&<div className="step3-image-review">
              <p className="help-text">PDF.js가 디코딩한 이미지를 PNG로 재구성했습니다. 원본 비트스트림·마스크/클리핑 효과가 그대로 보존된 것은 아닙니다. 위치는 근사치이며 저장 후 STEP2 편집기에서 크기·순서를 바꿀 수 있습니다.</p>
              {page.images.map((image,i)=><div className="section-editor" key={image.id}>
                <strong>이미지 {i+1} · {image.width}×{image.height}px · {image.origin.x}, {image.origin.y}pt</strong>
                <button type="button" className="secondary-button" data-step3-show-image-source={image.id}
                  disabled={disabled||busy} onClick={()=>{setSourceBlock(null);setSourceImage(image)}}>원본 위치 보기</button>
                {imageUrls[image.id]&&<img src={imageUrls[image.id]} className="step3-image-thumbnail" alt={page.number+'페이지 복원 이미지 '+(i+1)}/>}
                <label className="field step3-confirm"><input type="checkbox" checked={image.include} disabled={disabled||busy}
                  onChange={e=>toggleImage(page.number,image.id,e.target.checked)}/>
                  이 이미지를 새 문서에 포함 (원본과 대조)
                </label>
              </div>)}
            </div>}
            {!page.blocks.length&&<p className="warning">선택 가능한 문자가 없습니다. 스캔·이미지 콘텐츠를 확인하세요.</p>}
            <button type="button" className="secondary-button" data-step3-add-manual-block={page.number} disabled={disabled||busy||totalBlocks>=PDF_IMPORT_LIMITS.blocks}
              onClick={()=>addManualBlock(page.number)}>누락 텍스트 직접 추가</button>
            {page.blocks.map((block,i)=><div className="section-editor" key={block.id}>
              <div className="block-header"><strong>{block.manual?(block.origin?`원문 복구 · ${block.origin.page}p · ${block.origin.x}, ${block.origin.y}pt`:'수동 추가 · 원문 위치 없음'):`원본 ${block.origin?.page}p · ${block.origin?.x}, ${block.origin?.y}pt`}</strong>
                <div className="mini-actions">
                  {block.origin&&<button type="button" data-step3-show-source={block.id} onClick={()=>{setSourceImage(null);setSourceBlock(block)}} disabled={disabled||busy}>원본 위치 보기</button>}
                  {!block.manual&&block.sourceText!==undefined&&block.text!==block.sourceText&&<button type="button" data-step3-restore-extracted={block.id}
                    onClick={()=>change(page.number,block.id,b=>({...b,text:b.sourceText??b.text}))} disabled={disabled||busy}>추출 원문 복원</button>}
                  {block.manual&&<button type="button" data-step3-remove-manual={block.id} onClick={()=>removeManualBlock(page.number,block.id)} disabled={disabled||busy}>블록 삭제</button>}
                  <button type="button" data-step3-split-block={block.id}
                    disabled={disabled||busy||totalBlocks>=PDF_IMPORT_LIMITS.blocks||!isSafePdfTextSplitOffset(block.text,splitOffsets.current[block.id]??0)}
                    onClick={()=>splitBlockAtCursor(page.number,block.id)}>커서 위치에서 블록 나누기</button>
                  <button aria-label={block.id+' 위로 이동'} disabled={disabled||busy||i===0} onClick={()=>move(page.number,block.id,-1)}>↑</button>
                  <button aria-label={block.id+' 아래로 이동'} disabled={disabled||busy||i===page.blocks.length-1} onClick={()=>move(page.number,block.id,1)}>↓</button>
                </div>
              </div>
              <label className="field step3-confirm">
                <input type="checkbox" data-step3-block-included aria-label={block.id+' 새 문서에 포함'}
                  checked={!block.excluded} disabled={disabled||busy}
                  onChange={e=>change(page.number,block.id,b=>({...b,excluded:!e.target.checked}))}/>
                새 문서에 포함 (해제해도 원본 검수 화면에는 유지)
              </label>
              <label className="field">추출 분류 (변경 가능)
                <select disabled={disabled||busy} value={block.role} onChange={e=>change(page.number,block.id,b=>({...b,role:e.target.value as PdfRole}))}>
                  {ROLES.map(([role,label])=><option key={role} value={role}>{label}</option>)}
                </select>
              </label>
              <label className="field">{block.manual?'원본 대조 후 누락 내용 직접 입력':'원본 대조 후 내용 수정'}
                <textarea rows={Math.min(7,Math.max(2,block.text.split('\n').length+1))}
                  disabled={disabled||busy} value={block.text} onSelect={e=>rememberSplitOffset(block.id,e.currentTarget.selectionStart)}
                  onKeyUp={e=>rememberSplitOffset(block.id,e.currentTarget.selectionStart)}
                  onClick={e=>rememberSplitOffset(block.id,e.currentTarget.selectionStart)}
                  onChange={e=>{rememberSplitOffset(block.id,e.currentTarget.selectionStart);change(page.number,block.id,b=>({...b,text:e.target.value}));}}/>
              </label>
            </div>)}
          </details>)}
        </div>
      </div>
      {totalBlocks>0&&includedTextBlocks===0&&<p className="warning" role="alert">새 문서에 포함할 텍스트가 없습니다. 최소 한 블록을 포함하세요. 원본 검수 내용은 그대로 유지됩니다.</p>}
      {includedEmptyBlocks>0&&<p className="warning" role="alert" data-step3-empty-block-warning>비어 있는 텍스트 블록 {includedEmptyBlocks}개가 있습니다. 내용을 입력하거나 새 문서 포함을 해제한 뒤 저장하세요.</p>}
      <label className="field step3-confirm"><input type="checkbox" checked={confirmed} disabled={disabled||busy}
        onChange={e=>setConfirmed(e.target.checked)}/>
        원본과 추출 결과, 새 문서에 포함·제외할 텍스트, 이미지 복원·누락 개수를 확인했습니다. 미복원 그래픽은 새 PDF에서 누락될 수 있으며, 포함 선택 이미지는 PNG 근사 복원임을 인지하고 새 문서로 추가합니다.
      </label>
      <div className="toolbar">
        <button className="secondary-button" disabled={busy&&!parsing} onClick={cancel}>가져오기 취소</button>
        <button className="print-button" disabled={disabled||busy||!confirmed||includedTextBlocks===0||includedEmptyBlocks>0} onClick={()=>void commit()}>검수 결과를 새 문서로 저장</button>
      </div>
    </>}
  </section>;
}

