import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { PALETTE, THEMES } from '../types.ts';
import { LIMITS, documentAssetIds, moveItem, newBlock, newSection, visibleSections, type ContentBlock, type DocumentSection, type ImageAsset, type ProjectDocument } from './model.ts';
import { downloadProject } from './projectFile.ts';
import { useWorkspace } from './useWorkspace.ts';
import PdfImportPanel, {type ImportedPdfSource} from '../step3/ImportPanel.tsx';
import {hasDesktopPdfExport,savePdfFromEditor} from '../desktopPdf.ts';
import RuleReview from '../humanize/RuleReview.tsx';
import SourceAnchorPreview from '../step3/SourceAnchorPreview.tsx';
import {isReviewed,reviewableBlocks,reviewableOrigin,reviewSignature} from '../step3/sourceReview.ts';

const allThemes=[...THEMES,
  {id:'compact' as const,label:'컴팩트 리포트',description:'짧은 제목과 밀도 높은 문서'},
  {id:'editorial' as const,label:'에디토리얼',description:'중앙 정렬 제목과 넓은 호흡의 본문'},
  {id:'ledger' as const,label:'장부형 요약',description:'작은 제목·구획선·촘촘한 정보 배치'},
  {id:'brief' as const,label:'이그제큐티브 브리프',description:'대형 인트로 패널과 번호별 핵심 단락'},
  {id:'folio' as const,label:'매거진 폴리오',description:'오른쪽 대형 타이틀·편집형 구획'},
];
function useAssetUrls(assets:readonly ImageAsset[]):Record<string,string>{
  const [urls,setUrls]=useState<Record<string,string>>({});
  useEffect(()=>{
    const created:Record<string,string>={};for(const a of assets)created[a.id]=URL.createObjectURL(a.blob);
    setUrls(created);return()=>{for(const value of Object.values(created))URL.revokeObjectURL(value);};
  },[assets]);return urls;
}
export function ProjectPreview({doc,urls}: {doc:ProjectDocument;urls:Record<string,string>}){
  const sections=visibleSections(doc);const design=doc.design;
  return <article className={`document paper-theme-${design.theme} paper-font-${design.font} paper-size-${design.textSize} project-paper`} style={{'--accent':design.accent} as CSSProperties} aria-label="문서 미리보기">
    <div className="document-heading">
      {design.theme==='diary'&&<span className="document-eyebrow">LEARNING JOURNAL</span>}
      {design.theme==='report'&&<span className="document-eyebrow">DOCUMENT REPORT</span>}
      {design.theme==='compact'&&<span className="document-eyebrow">REPORT · {doc.content.date}</span>}
      {design.theme==='editorial'&&<span className="document-eyebrow">EDITORIAL · FEATURE</span>}
      {design.theme==='ledger'&&<span className="document-eyebrow">SUMMARY · DOCUMENT</span>}
       {design.theme==='brief'&&<span className="document-eyebrow">EXECUTIVE · BRIEF</span>}
       {design.theme==='folio'&&<span className="document-eyebrow">FOLIO · EDITION</span>}
      <h1>{doc.content.title||' '}</h1>
      {(doc.content.author.trim()||doc.content.date)&&<div className="document-meta">
        {doc.content.date&&<time dateTime={doc.content.date}>{doc.content.date}</time>}
        {doc.content.author.trim()&&<span className="document-author">{doc.content.author}</span>}
      </div>}
    </div>
    <div className="document-sections">
      {!sections.length&&<p className="empty-preview">섹션에 본문이나 이미지를 추가하면 문서에 표시됩니다.</p>}
      {sections.map((section,index)=><section className="document-section" key={section.id}>
        {!!section.title.trim()&&<h2>{design.theme==='diary'&&<span className="section-index">{String(index+1).padStart(2,'0')}</span>}{section.title}</h2>}
        {section.blocks.map(block=>{
          if(block.kind==='heading')return block.text.trim()?<h3 className="block-heading" key={block.id}>{block.text}</h3>:null;
          if(block.kind==='paragraph')return block.text.trim()?<div className="section-body block-prose" key={block.id}>{block.text}</div>:null;
          if(block.kind==='caption')return block.text.trim()?<p className="block-caption" key={block.id}>{block.text}</p>:null;
          if (block.kind !== 'image') return null;
          const url=urls[block.assetId];
          return <figure className={`document-figure align-${block.alignment} figure-${block.size}`} key={block.id}>
            {url?<img src={url} alt={block.caption?'': '문서 이미지'} data-asset-id={block.assetId}/>:<p className="asset-error">이미지를 불러오는 중이거나 파일이 누락되었습니다.</p>}
            {block.caption&&<figcaption>{block.caption}</figcaption>}
          </figure>;
        })}
      </section>)}
    </div>
  </article>;
}

interface Props {onLegacy:()=>void}
export default function Workspace({onLegacy}:Props){
  const w=useWorkspace();
  const [docsOpen,setDocsOpen]=useState(true),[busy,setBusy]=useState(false),[printBusy,setPrintBusy]=useState(false);
  const [localModelStatus,setLocalModelStatus]=useState('모델 미설치 · 로컬 규칙 검수만 사용 가능');
  const [activeStage,setActiveStage]=useState<1|2|3|4>(1);
  useEffect(()=>{
    let active=true;
    const check=window.astraDesktop?.localModelStatus;
    if(!check)return;
    void check().then(result=>{
      if(active)setLocalModelStatus(result.status==='available'?'로컬 모델 감지됨 · 품질 검증 전':'모델 미설치 · 로컬 규칙 검수만 사용 가능');
    }).catch(()=>{if(active)setLocalModelStatus('모델 상태 확인 실패 · 규칙 검수는 가능');});
    return()=>{active=false;};
  },[]);
  const fileRef=useRef<HTMLInputElement|null>(null);
  const [sourceReview,setSourceReview]=useState<ImportedPdfSource|null>(null);
  const sourceReviewRef=useRef<ImportedPdfSource|null>(null);
  const [focusedOrigin,setFocusedOrigin]=useState<{blockId:string;page:number}|null>(null);
  const [reviewMarks,setReviewMarks]=useState<Record<string,string>>({});
  const sourcePanel=useRef<HTMLElement|null>(null);
  const navigateStage=(stage:1|2|3|4)=>{
    const selector=stage===1?'#astra-pdf-import':stage===2?'.studio-source-panel':
      stage===3?'.studio-style-column':'.print-button';
    const target=document.querySelector<HTMLElement>(selector);
    if(!target)return;
    setActiveStage(stage);
    target.scrollIntoView({block:'start',behavior:'auto'});
    target.focus({preventScroll:true});
  };
  const clearReview=()=>{setFocusedOrigin(null);setReviewMarks({});};
  const closeSourceReview=()=>{
    if(activeStage===2)setActiveStage(1);
    const source=sourceReviewRef.current;
    sourceReviewRef.current=null;
    if(source)URL.revokeObjectURL(source.url);
    setSourceReview(null);
    clearReview();
  };
  const onSourceCommitted=(source:ImportedPdfSource)=>{
    const previous=sourceReviewRef.current;
    if(previous)URL.revokeObjectURL(previous.url);
    sourceReviewRef.current=source;
    clearReview();
    setSourceReview(source);
    setActiveStage(2);
  };
  // Unlike editable blocks, original PDF bytes are never stored in IndexedDB.
  // Revoke the preview immediately on document identity change or unmount.
  useEffect(()=>()=>{if(sourceReviewRef.current){
    URL.revokeObjectURL(sourceReviewRef.current.url);
    sourceReviewRef.current=null;
  }},[]);
  useEffect(()=>{
    const source=sourceReviewRef.current;
    if(w.ready&&source&&source.documentId!==w.document?.id)closeSourceReview();
  },[w.ready,w.document?.id]);
  const urls=useAssetUrls(w.assets);
  const doc=w.document;
  const imageRefs=useMemo(()=>doc?documentAssetIds(doc):[],[doc]);
  const currentSource=!!sourceReview&&sourceReview.documentId===doc?.id;
  const originBlocks=useMemo(()=>doc?reviewableBlocks(doc):[],[doc]);
  const completedReview=originBlocks.filter(b=>isReviewed(b,reviewMarks)).length;
  const focusedBlock=originBlocks.find(b=>b.id===focusedOrigin?.blockId);
  const focusSource=(block:ContentBlock)=>{
    if(!currentSource||!reviewableOrigin(block.origin))return;
    setFocusedOrigin({blockId:block.id,page:block.origin.page});
    sourcePanel.current?.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  const toggleChecked=(block:ContentBlock)=>{
    if(!currentSource||!reviewableOrigin(block.origin))return;
    setReviewMarks(previous=>{
      const copy={...previous};
      if(isReviewed(block,copy))delete copy[block.id];
      else copy[block.id]=reviewSignature(block);
      return copy;
    });
  };
  const editable=w.ready&&w.writable&&!w.operating&&!busy&&!printBusy;
  const operation=async(fn:()=>Promise<unknown>)=>{setBusy(true);try{await fn();}catch(e){w.setError(e instanceof Error?e.message:'작업 중 오류가 발생했습니다.');}finally{setBusy(false);}};
  const editDoc=(fn:(prev:ProjectDocument)=>ProjectDocument)=>w.edit(fn);
  const editSection=(id:string,fn:(s:DocumentSection)=>DocumentSection)=>editDoc(d=>({...d,content:{...d.content,sections:d.content.sections.map(s=>s.id===id?fn(s):s)}}));
  const changeBlock=(sectionId:string,blockId:string,fn:(block:ContentBlock)=>ContentBlock)=>editSection(sectionId,s=>({...s,blocks:s.blocks.map(b=>b.id===blockId?fn(b):b)}));
  const print=async()=>{
    if(!doc)return;setPrintBusy(true);
    try{
      await w.flush();
      const missing=imageRefs.filter(id=>!w.assets.some(a=>a.id===id)||!urls[id]);if(missing.length)throw new Error('일부 이미지 파일이 누락되었습니다. 인쇄 전 문서를 확인해 주세요.');
      await Promise.all([...document.querySelectorAll<HTMLImageElement>('.project-paper img')].map(image=>image.decode()));
      await document.fonts.ready;
      await savePdfFromEditor();
    }catch(e){w.setError(e instanceof Error?`인쇄 준비 실패: ${e.message}`:'인쇄를 준비할 수 없습니다.');}finally{setPrintBusy(false);}
  };
  return <>
    <header className="app-header no-print"><div className="brand"><span className="brand-icon">A</span><div><h1>아스트라 PDF 리디자이너</h1><p>STEP 2·3 · 로컬 문서 및 PDF 가져오기</p></div></div>
      <div className="print-actions"><button className="secondary-button" disabled={!editable} onClick={()=>void operation(async()=>{await w.flush();onLegacy();})}>기존 회고록 편집</button>
      <button className="print-button" disabled={!editable} onClick={()=>void print()}>{printBusy?'준비 중…':hasDesktopPdfExport()?'PDF 파일 저장':'PDF 저장 / 인쇄'}</button><span>{hasDesktopPdfExport()?'저장할 PDF 파일의 위치를 선택하세요.':'인쇄 창에서 ‘PDF로 저장’을 선택하세요.'}</span></div>
    </header>
    <main className="app-layout project-layout studio-layout">
      <nav className="studio-steps no-print" aria-label="PDF 리디자인 작업 순서">
        {([[1,'PDF 불러오기'],[2,'원본 대조'],[3,'디자인 선택'],[4,'새 PDF 저장']] as const)
          .map(([number,label])=><button type="button" key={number}
          data-m06b-stage={number} aria-current={activeStage===number?'step':undefined}
          disabled={number===2?!currentSource:number===3?!doc:number===4?!editable:false}
          onClick={()=>navigateStage(number)}
          onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){
            event.preventDefault();navigateStage(number);}}}>
          <b aria-hidden="true">{String(number).padStart(2,'0')}</b><span>{label}</span>
        </button>)}
      </nav>
      <aside className="editor-column no-print">
        {!w.ready&&<div className="panel">브라우저 로컬 문서함을 여는 중입니다…</div>}
        {w.locked&&<p className="warning" role="alert">다른 탭에서 문서함을 편집하고 있습니다. 해당 탭을 닫은 뒤 새로고침하세요. 이 탭에서는 편집할 수 없습니다.</p>}
        {!!w.error&&<p className="warning" role="alert">{w.error} <button type="button" className="text-button" onClick={()=>w.setError('')}>닫기</button></p>}
        <section className="panel"><div className="panel-heading project-heading-row"><h2>내 문서함</h2><button className="text-button" onClick={()=>setDocsOpen(!docsOpen)} aria-expanded={docsOpen}>{docsOpen?'접기':'펼치기'}</button></div>
          {docsOpen&&<>
            <div className="toolbar project-toolbar"><button className="secondary-button" disabled={!editable} onClick={()=>void operation(()=>w.create('blank'))}>+ 빈 문서</button><button className="secondary-button" disabled={!editable} onClick={()=>void operation(()=>w.create('retro'))}>+ 회고록</button><button className="text-button" disabled={!editable} onClick={()=>void operation(()=>w.create('example'))}>예시</button></div>
            <div className="document-list" role="list">{w.documents.map(item=><button role="listitem" key={item.id} disabled={!editable||item.id===doc?.id} className={`doc-list-item ${item.id===doc?.id?'active':''}`} onClick={()=>void operation(()=>w.switchTo(item.id))}><strong>{item.name||'(이름 없음)'}</strong><small>{new Date(item.updatedAt).toLocaleString('ko-KR')}</small></button>)}</div>
          </>}
        </section>
        <PdfImportPanel disabled={!editable} onImport={w.importPdfDraft} onSourceCommitted={onSourceCommitted}/>
        {sourceReview&&sourceReview.documentId===doc?.id&&
          <section ref={sourcePanel} tabIndex={-1} className="panel studio-source-panel no-print" aria-label="원본 PDF와 새 디자인 대조"
            data-source-document-id={sourceReview.documentId}>
            <div className="panel-heading project-heading-row">
              <h2>원본 ↔ 결과 대조</h2>
              <button className="text-button" type="button" onClick={closeSourceReview}>원본 비교 닫기</button>
            </div>
            <p className="help-text">원본: {sourceReview.fileName} · 현재 문서 전용 임시 미리보기입니다. 오른쪽 A4 결과와 비교하세요.</p>
            <div className="m06-source-progress" role="status" data-m06-progress>
              수동 대조 {completedReview}/{originBlocks.length}개 완료
              {completedReview<originBlocks.length&&<strong> · 검수 미완료 — 누락·순서·수치 확인 필요</strong>}
            </div>
            {focusedBlock&&focusedBlock.origin&&<SourceAnchorPreview url={sourceReview.url}
              origin={focusedBlock.origin} blockId={focusedBlock.id}/>}
            <details open className="m06-original-full"><summary>원본 PDF 전체 뷰 접기/펼치기</summary>
              <iframe title="가져온 원본 PDF" src={sourceReview.url} width="100%" height="430"/>
            </details>
            <p className="help-text">블록의 ‘원본 위치 보기’를 누르면 이 패널에 원본 페이지와 추정 영역이 표시됩니다. 대조 완료는 사용자가 직접 선택한 기록이며, 자동 정확도 합격 판정이 아닙니다. 다른 문서로 이동하거나 앱을 닫으면 초기화됩니다. 원본 파일 자체를 문서함에 저장하지 않습니다.</p>
          </section>}
        {doc&&<>
          <section className="panel"><div className="panel-heading project-heading-row"><h2>문서 정보</h2><span className="save-group"><span className="save-chip" role="status" aria-live="polite">{w.status}</span><button className="text-button" disabled={!editable} onClick={()=>void operation(()=>w.flush())}>지금 저장 / 재시도</button></span></div>
            <div className="form-grid">
              <label className="field field-wide">문서함 이름<input disabled={!editable} value={doc.name} onChange={e=>editDoc(d=>({...d,name:e.target.value}))}/></label>
              <label className="field field-wide">출력 제목<input disabled={!editable} value={doc.content.title} onChange={e=>editDoc(d=>({...d,content:{...d.content,title:e.target.value}}))}/></label>
              <label className="field">작성자 (선택)<input disabled={!editable} value={doc.content.author} onChange={e=>editDoc(d=>({...d,content:{...d.content,author:e.target.value}}))}/></label>
              <label className="field">작성일<input disabled={!editable} type="date" value={doc.content.date} onChange={e=>editDoc(d=>({...d,content:{...d.content,date:e.target.value}}))}/></label>
            </div>
            <div className="toolbar project-toolbar project-actions">
              <button className="secondary-button" disabled={!editable} onClick={()=>void operation(async()=>{await w.flush();await w.duplicate();})}>문서 복제</button>
              <button className="text-button danger" disabled={!editable} onClick={()=>{if(window.confirm(`‘${doc.name}’ 문서와 소속 이미지를 삭제하시겠습니까? 되돌릴 수 없습니다.`))void operation(()=>w.remove());}}>문서 삭제</button>
            </div>
          </section>
          <section className="panel"><div className="panel-heading project-heading-row"><h2>섹션 편집</h2><button disabled={!editable||doc.content.sections.length>=LIMITS.sections} className="secondary-button" onClick={()=>editDoc(d=>({...d,content:{...d.content,sections:[...d.content.sections,newSection()]}}))}>+ 섹션 추가</button></div>
            {doc.content.sections.map((section,si)=><div key={section.id} className="section-editor">
              <div className="section-editor-heading"><label className="field">섹션 {si+1} 제목<input disabled={!editable} value={section.title} onChange={e=>editSection(section.id,s=>({...s,title:e.target.value}))}/></label>
                <div className="mini-actions"><button aria-label={`${section.title||'이름 없는 섹션'} 위로 이동`} disabled={!editable||si===0} onClick={()=>editDoc(d=>({...d,content:{...d.content,sections:moveItem(d.content.sections,section.id,-1)}}))}>↑</button><button aria-label={`${section.title||'이름 없는 섹션'} 아래로 이동`} disabled={!editable||si===doc.content.sections.length-1} onClick={()=>editDoc(d=>({...d,content:{...d.content,sections:moveItem(d.content.sections,section.id,1)}}))}>↓</button><button className="danger" aria-label={`${section.title||'이름 없는 섹션'} 삭제`} disabled={!editable} onClick={()=>{if(window.confirm(`‘${section.title||'이름 없는 섹션'}’과 포함된 본문·이미지 ${section.blocks.length}개를 삭제하시겠습니까?`))void operation(()=>w.removeSection(section.id));}}>삭제</button></div>
              </div>
              {section.blocks.map((block,bi)=><div key={block.id} className={`block-editor ${focusedOrigin?.blockId===block.id&&currentSource?'m06-focused-block':''}`} data-m06-block-id={block.id}>
                <div className="block-header"><strong>{block.kind==='paragraph'?'본문':block.kind==='heading'?'소제목':block.kind==='caption'?'캡션':'이미지'}</strong>
                  <div className="mini-actions"><button aria-label={`${bi+1}번 블록 위로 이동`} disabled={!editable||bi===0} onClick={()=>editSection(section.id,s=>({...s,blocks:moveItem(s.blocks,block.id,-1)}))}>↑</button><button aria-label={`${bi+1}번 블록 아래로 이동`} disabled={!editable||bi===section.blocks.length-1} onClick={()=>editSection(section.id,s=>({...s,blocks:moveItem(s.blocks,block.id,1)}))}>↓</button><button className="danger" aria-label={`${bi+1}번 블록 삭제`} disabled={!editable} onClick={()=>{if(!window.confirm('이 블록을 삭제하시겠습니까?'))return;if(block.kind==='image')void operation(()=>w.removeImage(section.id,block.id));else editSection(section.id,s=>({...s,blocks:s.blocks.filter(b=>b.id!==block.id)}));}}>삭제</button></div>
                </div>
                {(block.kind==='paragraph'||block.kind==='caption')&&<label className="field"><span className="visually-hidden">{block.kind==='caption'?'캡션':'본문'} {bi+1}</span><textarea disabled={!editable} rows={block.kind==='caption'?2:4} value={block.text} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='paragraph'||b.kind==='caption'?{...b,text:e.target.value}:b)}/></label>}
                {block.kind==='heading'&&<label className="field"><span className="visually-hidden">소제목 {bi+1}</span><input disabled={!editable} value={block.text} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='heading'?{...b,text:e.target.value}:b)}/></label>}
                {block.kind==='paragraph'&&<RuleReview text={block.text} disabled={!editable}
                  onApply={value=>changeBlock(section.id,block.id,b=>b.kind==='paragraph'?{...b,text:value}:b)}/>}
                {reviewableOrigin(block.origin)&&<div className="m06-block-origin no-print" data-m06-origin data-m06-page={block.origin.page}>
                  <span className="help-text">원본 PDF 출처: {block.origin.page}페이지 · x={block.origin.x}pt · y={block.origin.y}pt (추정)</span>
                  <button type="button" className="secondary-button" disabled={!currentSource} data-m06-open
                    onClick={()=>focusSource(block)}>원본 위치 보기</button>
                  <button type="button" className="secondary-button" disabled={!currentSource||!editable||focusedOrigin?.blockId!==block.id}
                    data-m06-check aria-pressed={isReviewed(block,reviewMarks)}
                    onClick={()=>toggleChecked(block)}>{isReviewed(block,reviewMarks)?'검수 표시 취소':'원문 수동 대조 완료'}</button>
                  {isReviewed(block,reviewMarks)&&<span className="help-text">✓ 수동 확인됨</span>}
                  {!currentSource&&<span className="help-text">원본 비교 세션 종료 · 재업로드 후 다시 검수</span>}
                </div>}
                {block.kind==='image'&&<>
                  {urls[block.assetId]&&<img className="edit-image-preview" alt="첨부 이미지 미리보기" src={urls[block.assetId]}/>}
                  <label className="field">이미지 교체<input disabled={!editable} type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void operation(()=>w.insertImage(file,section.id,block.id));}}/></label>
                  <label className="field">이미지 설명<input disabled={!editable} value={block.caption} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='image'?{...b,caption:e.target.value}:b)}/></label>
                  <div className="image-options"><label className="field">정렬<select disabled={!editable} value={block.alignment} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='image'?{...b,alignment:e.target.value as 'left'|'center'|'right'}:b)}><option value="left">왼쪽</option><option value="center">가운데</option><option value="right">오른쪽</option></select></label><label className="field">크기<select disabled={!editable} value={block.size} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='image'?{...b,size:e.target.value as 'small'|'medium'|'large'}:b)}><option value="small">작게 (35%)</option><option value="medium">보통 (65%)</option><option value="large">크게 (100%)</option></select></label></div>
                </>}
              </div>)}
              <div className="add-block"><button disabled={!editable} className="secondary-button" onClick={()=>editSection(section.id,s=>({...s,blocks:[...s.blocks,newBlock('paragraph')]}))}>+ 본문</button><button disabled={!editable} className="secondary-button" onClick={()=>editSection(section.id,s=>({...s,blocks:[...s.blocks,newBlock('heading')]}))}>+ 소제목</button><button disabled={!editable} className="secondary-button" onClick={()=>editSection(section.id,s=>({...s,blocks:[...s.blocks,newBlock('caption')]}))}>+ 캡션</button><label className={`secondary-button file-trigger ${!editable?'disabled':''}`}>+ 이미지<input disabled={!editable} type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void operation(()=>w.insertImage(file,section.id));}}/></label></div>
            </div>)}
          </section>
          <section className="panel"><div className="panel-heading"><h2>프로젝트 파일</h2><span className="panel-caption">현재 문서와 이미지 전체를 백업합니다.</span></div>
            <div className="toolbar project-toolbar"><button className="secondary-button" disabled={!editable} onClick={()=>void operation(async()=>{const json=await w.exportCurrent();downloadProject(json,doc.name);})}>프로젝트 내보내기</button><button className="secondary-button" disabled={!editable} onClick={()=>fileRef.current?.click()}>프로젝트 가져오기</button></div>
            <input className="hidden-input" ref={fileRef} type="file" accept=".json,.localdoc.json,application/json" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void operation(()=>w.importCurrent(file));}}/>
            <p className="help-text">이미지: PNG/JPEG/WebP, 각 10MiB·2,000만 픽셀 이내. 프로젝트 JSON: 100MiB 이내. 내보낸 파일은 암호화되지 않습니다. 정기적으로 별도 보관하세요.</p>
          </section>
          <p className="privacy-note">문서는 현재 브라우저 프로필·주소의 IndexedDB에 저장됩니다. 사이트 데이터 삭제 시 유실될 수 있습니다. 여러 탭 동시 편집은 지원하지 않습니다. 이미지 원본에는 메타데이터가 포함될 수 있습니다. 외부 서버로 전송하지 않습니다.</p>
        </>}
      </aside>
      <div className="preview-column"><div className="preview-heading no-print"><div><h2>새 디자인 미리보기</h2><p>A4 기준 · 최종 페이지 나눔은 인쇄 창에서 확인</p></div><span className="size-tag">A4</span></div>
        <div className="paper-surface">{doc?<ProjectPreview doc={doc} urls={urls}/>:<div className="document">{w.ready?'문서를 열 수 없습니다.':'불러오는 중…'}</div>}</div>
        <p className="print-tip no-print">Chrome/Edge에서 PDF로 저장, A4, 머리글·바닥글 해제를 확인하세요. 인쇄는 이미지 로딩이 완료될 때까지 기다립니다.</p>
      </div>
      <aside tabIndex={-1} className="studio-style-column no-print" aria-label="디자인 스튜디오">
        <div className="studio-style-intro"><span className="studio-label">DESIGN STUDIO</span><h2>문서를 새롭게</h2><p>원문을 그대로 두고 출력 디자인만 변경합니다. 최소 두 가지 조판을 실제 PDF로 확인할 수 있습니다.</p></div>
        <section className="panel m03-local-model-status" aria-label="오프라인 AI 연결 상태">
          <h3>오프라인 AI 연결</h3>
          <p role="status" data-m03-model-status>{localModelStatus}</p>
          <p className="help-text">현재 배포에는 AI 모델이 포함되지 않습니다. 규칙 교정은 AI 윤문과 다르며, 실제 모델 품질·라이선스 검증 전에는 사용하지 않습니다.</p>
        </section>
        {doc ? <>
          <section className="panel settings-panel"><div className="panel-heading"><h2>디자인 설정</h2><span className="panel-caption">원문은 변경하지 않습니다</span></div>
            <div className="setting-block"><h3>테마</h3><div className="theme-options">{allThemes.map(theme=><label className={`theme-option ${doc.design.theme===theme.id?'selected':''}`} key={theme.id}><input disabled={!editable} type="radio" name="v2theme" checked={doc.design.theme===theme.id} onChange={()=>editDoc(d=>({...d,design:{...d.design,theme:theme.id}}))}/><span><strong>{theme.label}</strong><small>{theme.description}</small></span></label>)}</div></div>
            <div className="setting-block"><h3>포인트 색상</h3><div className="swatches">{PALETTE.map(color=><label title={color.label} className={`swatch-wrap ${doc.design.accent===color.value?'active':''}`} key={color.value}><input disabled={!editable} type="radio" name="v2accent" aria-label={color.label} checked={doc.design.accent===color.value} onChange={()=>editDoc(d=>({...d,design:{...d.design,accent:color.value}}))}/><span className="swatch" style={{backgroundColor:color.value}}/></label>)}</div></div>
            <div className="setting-block"><h3>본문 크기</h3><div className="segmented">{(['small','medium','large'] as const).map((size,i)=><label className={doc.design.textSize===size?'on':''} key={size}><input disabled={!editable} type="radio" name="v2size" checked={doc.design.textSize===size} onChange={()=>editDoc(d=>({...d,design:{...d.design,textSize:size}}))}/>{['작게','보통','크게'][i]}</label>)}</div></div>
            <div className="setting-block"><h3>폰트</h3><div className="segmented">{(['sans','serif'] as const).map((font,i)=><label className={doc.design.font===font?'on':''} key={font}><input disabled={!editable} type="radio" name="v2font" checked={doc.design.font===font} onChange={()=>editDoc(d=>({...d,design:{...d.design,font}}))}/>{['고딕','명조'][i]}</label>)}</div><p className="help-text">설치된 시스템 글꼴에 따라 표시가 달라집니다.</p></div>
          </section>
        </> : <p className="panel">문서를 불러오면 스타일을 선택할 수 있습니다.</p>}
      </aside>
    </main>
  </>;
}
