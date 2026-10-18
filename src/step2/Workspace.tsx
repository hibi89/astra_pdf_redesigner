import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { PALETTE, THEMES } from '../types.ts';
import { LIMITS, documentAssetIds, moveItem, newBlock, newIdentifier, newSection, visibleSections, type ContentBlock, type DocumentSection, type ImageAsset, type ProjectDocument } from './model.ts';
import { downloadProject } from './projectFile.ts';
import { useWorkspace } from './useWorkspace.ts';

const allThemes=[...THEMES,{id:'compact' as const,label:'컴팩트 리포트',description:'짧은 제목과 밀도 높은 문서'}];
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
  const fileRef=useRef<HTMLInputElement|null>(null);
  const urls=useAssetUrls(w.assets);
  const doc=w.document;
  const imageRefs=useMemo(()=>doc?documentAssetIds(doc):[],[doc]);
  const editable=w.ready&&w.writable&&!busy&&!printBusy;
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
      window.print();
    }catch(e){w.setError(e instanceof Error?`인쇄 준비 실패: ${e.message}`:'인쇄를 준비할 수 없습니다.');}finally{setPrintBusy(false);}
  };
  return <>
    <header className="app-header no-print"><div className="brand"><span className="brand-icon">A</span><div><h1>아스트라 PDF 리디자이너</h1><p>STEP 2 · 개인 문서 제작기</p></div></div>
      <div className="print-actions"><button className="secondary-button" onClick={onLegacy}>기존 회고록 편집</button>
      <button className="print-button" disabled={!editable} onClick={()=>void print()}>{printBusy?'준비 중…':'PDF 저장 / 인쇄'}</button><span>인쇄 창에서 ‘PDF로 저장’을 선택하세요.</span></div>
    </header>
    <main className="app-layout project-layout">
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
        {doc&&<>
          <section className="panel"><div className="panel-heading project-heading-row"><h2>문서 정보</h2><span className="save-chip" role="status" aria-live="polite">{w.status}</span></div>
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
              {section.blocks.map((block,bi)=><div key={block.id} className="block-editor">
                <div className="block-header"><strong>{block.kind==='paragraph'?'본문':block.kind==='heading'?'소제목':'이미지'}</strong>
                  <div className="mini-actions"><button aria-label={`${bi+1}번 블록 위로 이동`} disabled={!editable||bi===0} onClick={()=>editSection(section.id,s=>({...s,blocks:moveItem(s.blocks,block.id,-1)}))}>↑</button><button aria-label={`${bi+1}번 블록 아래로 이동`} disabled={!editable||bi===section.blocks.length-1} onClick={()=>editSection(section.id,s=>({...s,blocks:moveItem(s.blocks,block.id,1)}))}>↓</button><button className="danger" aria-label={`${bi+1}번 블록 삭제`} disabled={!editable} onClick={()=>{if(!window.confirm('이 블록을 삭제하시겠습니까?'))return;if(block.kind==='image')void operation(()=>w.removeImage(section.id,block.id));else editSection(section.id,s=>({...s,blocks:s.blocks.filter(b=>b.id!==block.id)}));}}>삭제</button></div>
                </div>
                {block.kind==='paragraph'&&<label className="field"><span className="visually-hidden">본문 {bi+1}</span><textarea disabled={!editable} rows={4} value={block.text} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='paragraph'?{...b,text:e.target.value}:b)}/></label>}
                {block.kind==='heading'&&<label className="field"><span className="visually-hidden">소제목 {bi+1}</span><input disabled={!editable} value={block.text} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='heading'?{...b,text:e.target.value}:b)}/></label>}
                {block.kind==='image'&&<>
                  {urls[block.assetId]&&<img className="edit-image-preview" alt="첨부 이미지 미리보기" src={urls[block.assetId]}/>}
                  <label className="field">이미지 교체<input disabled={!editable} type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void operation(()=>w.insertImage(file,section.id,block.id));}}/></label>
                  <label className="field">이미지 설명<input disabled={!editable} value={block.caption} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='image'?{...b,caption:e.target.value}:b)}/></label>
                  <div className="image-options"><label className="field">정렬<select disabled={!editable} value={block.alignment} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='image'?{...b,alignment:e.target.value as 'left'|'center'|'right'}:b)}><option value="left">왼쪽</option><option value="center">가운데</option><option value="right">오른쪽</option></select></label><label className="field">크기<select disabled={!editable} value={block.size} onChange={e=>changeBlock(section.id,block.id,b=>b.kind==='image'?{...b,size:e.target.value as 'small'|'medium'|'large'}:b)}><option value="small">작게 (35%)</option><option value="medium">보통 (65%)</option><option value="large">크게 (100%)</option></select></label></div>
                </>}
              </div>)}
              <div className="add-block"><button disabled={!editable} className="secondary-button" onClick={()=>editSection(section.id,s=>({...s,blocks:[...s.blocks,newBlock('paragraph')]}))}>+ 본문</button><button disabled={!editable} className="secondary-button" onClick={()=>editSection(section.id,s=>({...s,blocks:[...s.blocks,newBlock('heading')]}))}>+ 소제목</button><label className={`secondary-button file-trigger ${!editable?'disabled':''}`}>+ 이미지<input disabled={!editable} type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void operation(()=>w.insertImage(file,section.id));}}/></label></div>
            </div>)}
          </section>
          <section className="panel settings-panel"><div className="panel-heading"><h2>디자인 설정</h2><span className="panel-caption">원문은 변경하지 않습니다</span></div>
            <div className="setting-block"><h3>테마</h3><div className="theme-options">{allThemes.map(theme=><label className={`theme-option ${doc.design.theme===theme.id?'selected':''}`} key={theme.id}><input disabled={!editable} type="radio" name="v2theme" checked={doc.design.theme===theme.id} onChange={()=>editDoc(d=>({...d,design:{...d.design,theme:theme.id}}))}/><span><strong>{theme.label}</strong><small>{theme.description}</small></span></label>)}</div></div>
            <div className="setting-block"><h3>포인트 색상</h3><div className="swatches">{PALETTE.map(color=><label title={color.label} className={`swatch-wrap ${doc.design.accent===color.value?'active':''}`} key={color.value}><input disabled={!editable} type="radio" name="v2accent" aria-label={color.label} checked={doc.design.accent===color.value} onChange={()=>editDoc(d=>({...d,design:{...d.design,accent:color.value}}))}/><span className="swatch" style={{backgroundColor:color.value}}/></label>)}</div></div>
            <div className="setting-block"><h3>본문 크기</h3><div className="segmented">{(['small','medium','large'] as const).map((size,i)=><label className={doc.design.textSize===size?'on':''} key={size}><input disabled={!editable} type="radio" name="v2size" checked={doc.design.textSize===size} onChange={()=>editDoc(d=>({...d,design:{...d.design,textSize:size}}))}/>{['작게','보통','크게'][i]}</label>)}</div></div>
            <div className="setting-block"><h3>폰트</h3><div className="segmented">{(['sans','serif'] as const).map((font,i)=><label className={doc.design.font===font?'on':''} key={font}><input disabled={!editable} type="radio" name="v2font" checked={doc.design.font===font} onChange={()=>editDoc(d=>({...d,design:{...d.design,font}}))}/>{['고딕','명조'][i]}</label>)}</div><p className="help-text">설치된 시스템 글꼴에 따라 표시가 달라집니다.</p></div>
          </section>
          <section className="panel"><div className="panel-heading"><h2>프로젝트 파일</h2><span className="panel-caption">현재 문서와 이미지 전체를 백업합니다.</span></div>
            <div className="toolbar project-toolbar"><button className="secondary-button" disabled={!editable} onClick={()=>void operation(async()=>{const json=await w.exportCurrent();downloadProject(json,doc.name);})}>프로젝트 내보내기</button><button className="secondary-button" disabled={!editable} onClick={()=>fileRef.current?.click()}>프로젝트 가져오기</button></div>
            <input className="hidden-input" ref={fileRef} type="file" accept=".json,.localdoc.json,application/json" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void operation(()=>w.importCurrent(file));}}/>
            <p className="help-text">이미지: PNG/JPEG/WebP, 각 10MiB·2,000만 픽셀 이내. 프로젝트 JSON: 100MiB 이내. 내보낸 파일은 암호화되지 않습니다. 정기적으로 별도 보관하세요.</p>
          </section>
          <p className="privacy-note">문서는 현재 브라우저 프로필·주소의 IndexedDB에 저장됩니다. 사이트 데이터 삭제 시 유실될 수 있습니다. 여러 탭 동시 편집은 지원하지 않습니다. 이미지 원본에는 메타데이터가 포함될 수 있습니다. 외부 서버로 전송하지 않습니다.</p>
        </>}
      </aside>
      <div className="preview-column"><div className="preview-heading no-print"><div><h2>문서 미리보기</h2><p>A4 기준 · 최종 페이지 나눔은 인쇄 창에서 확인</p></div><span className="size-tag">A4</span></div>
        <div className="paper-surface">{doc?<ProjectPreview doc={doc} urls={urls}/>:<div className="document">{w.ready?'문서를 열 수 없습니다.':'불러오는 중…'}</div>}</div>
        <p className="print-tip no-print">Chrome/Edge에서 PDF로 저장, A4, 머리글·바닥글 해제를 확인하세요. 인쇄는 이미지 로딩이 완료될 때까지 기다립니다.</p>
      </div>
    </main>
  </>;
}
