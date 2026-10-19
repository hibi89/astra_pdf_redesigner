import {useEffect,useRef,useState} from 'react';
import type {PdfDraft,PdfDraftBlock,PdfRole} from './structure.ts';
import {extractLocalPdf} from './pdf.ts';

interface Props {disabled:boolean;onImport:(draft:PdfDraft)=>Promise<boolean>}
const ROLES:[PdfRole,string][]=[['paragraph','본문'],['heading','소제목'],['caption','캡션']];
export default function PdfImportPanel({disabled,onImport}:Props){
  const [draft,setDraft]=useState<PdfDraft|null>(null);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[confirmed,setConfirmed]=useState(false);
  const [previewUrl,setPreviewUrl]=useState('');
  const [imageUrls,setImageUrls]=useState<Record<string,string>>({});
  const urlRef=useRef('');
  const imageUrlRef=useRef<Record<string,string>>({});
  useEffect(()=>()=>{if(urlRef.current)URL.revokeObjectURL(urlRef.current);
    Object.values(imageUrlRef.current).forEach(u=>URL.revokeObjectURL(u));},[]);
  const forget=()=>{
    if(urlRef.current)URL.revokeObjectURL(urlRef.current);
    Object.values(imageUrlRef.current).forEach(u=>URL.revokeObjectURL(u));
    imageUrlRef.current={};setImageUrls({});
    urlRef.current='';setPreviewUrl('');setDraft(null);setError('');setConfirmed(false);
  };
  const choose=async(file:File)=>{
    forget();setBusy(true);
    try{
      const parsed=await extractLocalPdf(file);
      // The source file remains an ephemeral browser Blob URL only during review.
      const url=URL.createObjectURL(file);urlRef.current=url;setPreviewUrl(url);
      const imageMap:Record<string,string>={};
      for(const page of parsed.pages)for(const image of page.images)imageMap[image.id]=URL.createObjectURL(image.blob);
      imageUrlRef.current=imageMap;setImageUrls(imageMap);
      setDraft(parsed);
    }catch(e){setError(e instanceof Error?e.message:'PDF에서 내용을 추출할 수 없습니다.');}
    finally{setBusy(false);}
  };
  const change=(page:number,id:string,fn:(old:PdfDraftBlock)=>PdfDraftBlock)=>{
    setDraft(prev=>prev?{...prev,pages:prev.pages.map(p=>p.number===page?{...p,
      blocks:p.blocks.map(b=>b.id===id?fn(b):b),
    }:p)}:prev);
  };
  const move=(page:number,id:string,delta:-1|1)=>{
    setDraft(prev=>prev?{...prev,pages:prev.pages.map(p=>{
      if(p.number!==page)return p;
      const i=p.blocks.findIndex(b=>b.id===id),to=i+delta;
      if(i<0||to<0||to>=p.blocks.length)return p;
      const copy=[...p.blocks];[copy[i],copy[to]]=[copy[to],copy[i]];
      return {...p,blocks:copy};
    })}:prev);
  };
  const toggleImage=(page:number,id:string,include:boolean)=>{
    setConfirmed(false);
    setDraft(prev=>prev?{...prev,pages:prev.pages.map(p=>p.number===page?
      {...p,images:p.images.map(img=>img.id===id?{...img,include}:img)}:p)}:prev);
  };
  const commit=async()=>{
    if(!draft||!confirmed||busy||disabled)return;
    setBusy(true);
    try{
      if(!draft.pages.some(p=>p.blocks.some(b=>b.text.trim())))throw Error('확인된 본문이 비어 있습니다.');
      const success=await onImport(draft);
      if(success)forget();else setError('문서함 저장에 실패했습니다. 추출 결과는 유지됩니다. 기존 문서는 변경하지 않았습니다.');
    }catch(e){setError(e instanceof Error?e.message:'PDF 문서 저장 실패');}
    finally{setBusy(false);}
  };
  const totalBlocks=draft?.pages.reduce((s,p)=>s+p.blocks.length,0)??0;
  const detected=draft?.pages.reduce((s,p)=>s+p.imageCount,0)??0;
  const recovered=draft?.pages.reduce((s,p)=>s+p.images.length,0)??0;
  const included=draft?.pages.reduce((s,p)=>s+p.images.filter(i=>i.include).length,0)??0;
  const vectorPaints=draft?.pages.reduce((s,p)=>s+p.vectorPaintCount,0)??0;
  return <section className="panel step3-import-panel no-print" aria-labelledby="pdf-import-title">
    <div className="panel-heading"><h2 id="pdf-import-title">STEP 3 · 기존 PDF 가져오기</h2><span className="panel-caption">텍스트 선택 가능한 단일 열 PDF</span></div>
    <p className="help-text">파일은 이 브라우저에서만 분석합니다. 외부로 전송하지 않고, 검수·확정 전에는 기존 문서함을 변경하지 않습니다.</p>
    <label className="field">원본 PDF 선택
      <input aria-label="원본 PDF 선택" type="file" accept=".pdf,application/pdf" disabled={disabled||busy}
        onChange={e=>{const f=e.target.files?.[0];e.target.value='';if(f)void choose(f);}}/>
    </label>
    {busy&&<p role="status">PDF를 분석하거나 새 문서를 저장하는 중입니다…</p>}
    {!!error&&<p className="warning" role="alert">{error}</p>}
    {draft&&<>
      <p className="help-text">원본: {draft.fileName} · {draft.pageCount}페이지 · 추출 {draft.totalChars.toLocaleString('ko-KR')}자 · 편집 가능한 텍스트 블록 {totalBlocks}개</p>
      <p className="help-text" data-step3-image-count>이미지 감지 {detected}건 · PNG 복원 {recovered}건 · 저장 선택 {included}건 · 미복원 {Math.max(0,detected-recovered)}건</p>
      <p className="help-text" data-step3-vector-count>원본 벡터 경로 페인팅 {vectorPaints}회 · 선/도형·표 구조 자동 복원 미지원 (도형/셀 개수 아님)</p>
      <div className="warning" role="status"><strong>완전 복원이 아닙니다.</strong> 텍스트 분류·위치·줄바꿈·공백은 추정입니다. 이미지·표·도형이 누락될 수 있습니다. 원본을 대조해 수정하세요.</div>
      <details open><summary>추출 경고·검토 사항 {draft.warnings.length}건</summary>
        <ul>{draft.warnings.map((message,i)=><li key={i}>{message}</li>)}</ul>
      </details>
      <div className="step3-source-compare">
        {previewUrl&&<details><summary>원본 PDF 열어 대조</summary>
          <iframe title="원본 PDF 대조" src={previewUrl} width="100%" height="400"/>
          <p className="help-text">원본 PDF는 가져오기 검수 화면에서만 일시적으로 열립니다. 문서함에는 원본 PDF 자체를 저장하지 않습니다.</p>
        </details>}
        <div className="step3-block-review">
          {draft.pages.map(page=><details key={page.number} open={page.number===1}>
            <summary>원본 {page.number}페이지 — {page.blocks.length}개 텍스트 · 이미지 {page.images.length}/{page.imageCount}복원{page.omittedImages?' · 미복원 '+page.omittedImages+'건':''}{page.vectorPaintCount?' · 벡터 경로 '+page.vectorPaintCount+'회':''}</summary>
            {page.images.length>0&&<div className="step3-image-review">
              <p className="help-text">PDF.js가 디코딩한 이미지를 PNG로 재구성했습니다. 원본 비트스트림·마스크/클리핑 효과가 그대로 보존된 것은 아닙니다. 위치는 근사치이며 저장 후 STEP2 편집기에서 크기·순서를 바꿀 수 있습니다.</p>
              {page.images.map((image,i)=><div className="section-editor" key={image.id}>
                <strong>이미지 {i+1} · {image.width}×{image.height}px · {image.origin.x}, {image.origin.y}pt</strong>
                {imageUrls[image.id]&&<img src={imageUrls[image.id]} className="step3-image-thumbnail" alt={page.number+'페이지 복원 이미지 '+(i+1)}/>}
                <label className="field step3-confirm"><input type="checkbox" checked={image.include} disabled={disabled||busy}
                  onChange={e=>toggleImage(page.number,image.id,e.target.checked)}/>
                  이 이미지를 새 문서에 포함 (원본과 대조)
                </label>
              </div>)}
            </div>}
            {!page.blocks.length&&<p className="warning">선택 가능한 문자가 없습니다. 스캔·이미지 콘텐츠를 확인하세요.</p>}
            {page.blocks.map((block,i)=><div className="section-editor" key={block.id}>
              <div className="block-header"><strong>원본 {block.origin.page}p · {block.origin.x}, {block.origin.y}pt</strong>
                <div className="mini-actions">
                  <button aria-label={block.id+' 위로 이동'} disabled={disabled||busy||i===0} onClick={()=>move(page.number,block.id,-1)}>↑</button>
                  <button aria-label={block.id+' 아래로 이동'} disabled={disabled||busy||i===page.blocks.length-1} onClick={()=>move(page.number,block.id,1)}>↓</button>
                </div>
              </div>
              <label className="field">추출 분류 (변경 가능)
                <select disabled={disabled||busy} value={block.role} onChange={e=>change(page.number,block.id,b=>({...b,role:e.target.value as PdfRole}))}>
                  {ROLES.map(([role,label])=><option key={role} value={role}>{label}</option>)}
                </select>
              </label>
              <label className="field">원본 대조 후 내용 수정
                <textarea rows={Math.min(7,Math.max(2,block.text.split('\n').length+1))}
                  disabled={disabled||busy} value={block.text} onChange={e=>change(page.number,block.id,b=>({...b,text:e.target.value}))}/>
              </label>
            </div>)}
          </details>)}
        </div>
      </div>
      <label className="field step3-confirm"><input type="checkbox" checked={confirmed} disabled={disabled||busy}
        onChange={e=>setConfirmed(e.target.checked)}/>
        원본과 추출 결과 및 이미지 복원·누락 개수를 확인했습니다. 미복원 그래픽은 새 PDF에서 누락될 수 있으며, 포함 선택 이미지는 PNG 근사 복원임을 인지하고 새 문서로 추가합니다.
      </label>
      <div className="toolbar">
        <button className="secondary-button" disabled={busy} onClick={forget}>가져오기 취소</button>
        <button className="print-button" disabled={disabled||busy||!confirmed} onClick={()=>void commit()}>검수 결과를 새 문서로 저장</button>
      </div>
    </>}
  </section>;
}
