import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { PALETTE, THEMES, type DesignSettings, type ThemeId } from '../types.ts';
import { LIMITS, documentAssetIds, moveItem, newBlock, newSection, visibleSections, type ContentBlock, type DocumentSection, type ImageAsset, type ProjectDocument } from './model.ts';
import { downloadProject } from './projectFile.ts';
import { useWorkspace } from './useWorkspace.ts';
import {type ImportedPdfSource} from '../step3/ImportPanel.tsx';
import BatchImportPanel from '../step3/BatchImportPanel.tsx';
import {hasDesktopPdfExport,savePdfFromEditor} from '../desktopPdf.ts';
import RuleReview from '../humanize/RuleReview.tsx';
import SourceAnchorPreview from '../step3/SourceAnchorPreview.tsx';
import {isReviewed,reviewableBlocks,reviewableOrigin,reviewSignature} from '../step3/sourceReview.ts';
import {analyzePdfTypography,analyzeReferencePixels,suggestPdfBodyTextSize,type PdfTypographyMetrics,type ReferenceMetrics} from '../step5/referenceAnalysis.ts';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {imageDimensions,imageType} from './images.ts';
import {pdfOutputImageCount,pdfOutputTextMarkers} from './outputMarkers.ts';
import {downloadStylePreset,importStylePreset} from '../step4/stylePreset.ts';
import {SKU_LAYOUT_CANDIDATES,skuLayoutCandidate} from '../step4/skuLayoutCandidates.ts';
import ReferenceSearchPanel from '../step6/ReferenceSearchPanel.tsx';
import {downloadAdvancedLayoutPreset,importAdvancedLayoutPreset} from '../step4/advancedLayoutPreset.ts';
import {downloadBusinessBrandKit,importBusinessBrandKit,validateBusinessBrandKit,type BusinessBrandKit} from '../step4/brandKit.ts';
import {makeSourceReviewReceipt,downloadSourceReviewReceipt} from '../step3/reviewReceipt.ts';

const allThemes=[...THEMES,
  {id:'compact' as const,label:'컴팩트 리포트',description:'짧은 제목과 밀도 높은 문서'},
  {id:'editorial' as const,label:'에디토리얼',description:'중앙 정렬 제목과 넓은 호흡의 본문'},
  {id:'ledger' as const,label:'장부형 요약',description:'작은 제목·구획선·촘촘한 정보 배치'},
  {id:'brief' as const,label:'이그제큐티브 브리프',description:'대형 인트로 패널과 번호별 핵심 단락'},
  {id:'folio' as const,label:'매거진 폴리오',description:'오른쪽 대형 타이틀·편집형 구획'},
];
function sameDesign(a:DesignSettings,b:DesignSettings):boolean{
  return a.theme===b.theme&&a.accent===b.accent&&a.textSize===b.textSize&&a.font===b.font;
}
function useAssetUrls(assets:readonly ImageAsset[]):Record<string,string>{
  const [urls,setUrls]=useState<Record<string,string>>({});
  useEffect(()=>{
    const created:Record<string,string>={};for(const a of assets)created[a.id]=URL.createObjectURL(a.blob);
    setUrls(created);return()=>{for(const value of Object.values(created))URL.revokeObjectURL(value);};
  },[assets]);return urls;
}
export function ProjectPreview({doc,urls,previewTheme,previewDesign,previewLayoutId,brandKit,brandLogoUrl}: {doc:ProjectDocument;urls:Record<string,string>;previewTheme?:ThemeId;previewDesign?:DesignSettings;previewLayoutId?:string;brandKit?:BusinessBrandKit|null;brandLogoUrl?:string|null}){
  const advanced=skuLayoutCandidate(previewLayoutId);
  const branded=advanced?.tier==='business'&&brandKit ? brandKit : null;
  const sections=visibleSections(doc);const design=advanced?{...doc.design,theme:advanced.baseTheme}:previewDesign??(previewTheme?{...doc.design,theme:previewTheme}:doc.design);
  return <article className={`document paper-theme-${design.theme} paper-font-${design.font} paper-size-${design.textSize} project-paper ${advanced?'paper-advanced-'+advanced.id:''}`} data-advanced-layout={advanced?.id} style={{'--accent':branded?.accent??design.accent} as CSSProperties} aria-label="문서 미리보기">
    {branded&&<div className="business-brand-header" data-business-brand-header>{brandLogoUrl&&<img className="business-brand-logo" src={brandLogoUrl} alt="브랜드 로고" data-business-logo/>}<div><strong>{branded.name}</strong>{branded.tagline&&<span>{branded.tagline}</span>}</div></div>}
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
    {branded&&branded.footer&&<footer className="business-brand-footer" data-business-brand-footer>{branded.footer}</footer>}
  </article>;
}

interface Props {onLegacy:()=>void;onOwnerReview?:()=>void}
interface StyleUndoEntry {before:DesignSettings;applied:DesignSettings}
export default function Workspace({onLegacy,onOwnerReview}:Props){
  const w=useWorkspace();
  const [docsOpen,setDocsOpen]=useState(true),[busy,setBusy]=useState(false),[printBusy,setPrintBusy]=useState(false);
  const [localModelStatus,setLocalModelStatus]=useState('모델 미설치 · 로컬 규칙 검수만 사용 가능');
  const [activeStage,setActiveStage]=useState<1|2|3|4>(1);
  const [styleCompareOpen,setStyleCompareOpen]=useState(false);
  const [styleCompareGalleryOpen,setStyleCompareGalleryOpen]=useState(false);
  const [advancedPreview,setAdvancedPreview]=useState<{documentId:string;layoutId:string}|null>(null);
  const [advancedPresetError,setAdvancedPresetError]=useState('');
  const [brandDraft,setBrandDraft]=useState<BusinessBrandKit>({name:'',tagline:'',footer:'',accent:PALETTE[0].value});
  const [brandApplied,setBrandApplied]=useState<BusinessBrandKit|null>(null);
  const [brandLogoUrl,setBrandLogoUrl]=useState<string|null>(null);
  const [brandError,setBrandError]=useState('');
  const brandImportInput=useRef<HTMLInputElement|null>(null);
  const brandLogoInput=useRef<HTMLInputElement|null>(null);
  const advancedPresetInput=useRef<HTMLInputElement|null>(null);
  const [previewTheme,setPreviewTheme]=useState<{documentId:string;theme:ThemeId}|null>(null);
  const [styleUndo,setStyleUndo]=useState<Record<string,StyleUndoEntry[]>>({});
  const [portableStyle,setPortableStyle]=useState<{documentId:string;name:string;design:DesignSettings}|null>(null);
  const [portableStyleName,setPortableStyleName]=useState('내 스타일');
  const [portableStyleError,setPortableStyleError]=useState('');
  const portableStyleInput=useRef<HTMLInputElement|null>(null);
  const [referenceMetrics,setReferenceMetrics]=useState<ReferenceMetrics|null>(null);
  const [referencePdfTypography,setReferencePdfTypography]=useState<(PdfTypographyMetrics&{suggestedTextSize:DesignSettings['textSize']})|null>(null);
  const [referencePreview,setReferencePreview]=useState<{documentId:string;design:DesignSettings}|null>(null);
  const [referenceImage,setReferenceImage]=useState<{url:string|null;name:string}|null>(null);
  const [referencePdf,setReferencePdf]=useState<{file:File;pages:number;page:number}|null>(null);
  const [referenceError,setReferenceError]=useState('');
  const [referenceStatus,setReferenceStatus]=useState('');
  const referenceInput=useRef<HTMLInputElement|null>(null);
  const referenceVersion=useRef(0);
  const referencePdfSession=useRef<{file:File;loading:{promise:Promise<any>;destroy:()=>Promise<void>};pdf:any}|null>(null);
  const referenceRenderTask=useRef<{cancel:()=>void}|null>(null);
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
  const activeAdvancedLayoutId=doc&&advancedPreview?.documentId===doc.id?advancedPreview.layoutId:undefined;
  const businessActive=skuLayoutCandidate(activeAdvancedLayoutId)?.tier==='business';
  const referencePreviewDesign=doc&&referencePreview?.documentId===doc.id?referencePreview.design:undefined;
  const portablePreviewDesign=doc&&portableStyle?.documentId===doc.id?portableStyle.design:undefined;
  const activePreviewDesign=referencePreviewDesign??portablePreviewDesign;
  const previewThemeId=doc&&previewTheme?.documentId===doc.id&&!activePreviewDesign?previewTheme.theme:undefined;
  const selectedCompareTheme=previewThemeId??doc?.design.theme;
  const currentStyleUndo=doc?styleUndo[doc.id]?.at(-1):undefined;
  const canUndoStyle=!!doc&&!!currentStyleUndo&&sameDesign(doc.design,currentStyleUndo.applied);
  const rememberStyleUndo=(documentId:string,before:DesignSettings,applied:DesignSettings)=>
    setStyleUndo(previous=>({...previous,[documentId]:[...(previous[documentId]??[]),{before,applied}].slice(-20)}));
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
  const openStyleCompare=()=>{
    if(!doc)return;
    setPortableStyle(null);clearReference();
    setPreviewTheme({documentId:doc.id,theme:doc.design.theme});
    setStyleCompareGalleryOpen(false);
    setStyleCompareOpen(true);
  };
  const closeStyleCompare=()=>{setStyleCompareOpen(false);setStyleCompareGalleryOpen(false);setPreviewTheme(null);};
  const applyComparedTheme=()=>{
    if(!doc||!styleCompareOpen||!selectedCompareTheme||selectedCompareTheme===doc.design.theme)return;
    const before=structuredClone(doc.design);
    const applied={...doc.design,theme:selectedCompareTheme};
    rememberStyleUndo(doc.id,before,applied);
    editDoc(d=>({...d,design:applied}));
    setStyleCompareGalleryOpen(false);
  };
  const undoComparedTheme=()=>{
    if(!doc||!currentStyleUndo||!canUndoStyle)return;
    const before=structuredClone(currentStyleUndo.before);
    editDoc(d=>({...d,design:before}));
    setPreviewTheme({documentId:doc.id,theme:before.theme});
    setStyleUndo(previous=>({...previous,[doc.id]:(previous[doc.id]??[]).slice(0,-1)}));
  };
  const applyPortableStyle=()=>{
    if(!doc||!portablePreviewDesign||!editable||sameDesign(doc.design,portablePreviewDesign))return;
    const before=structuredClone(doc.design),applied=structuredClone(portablePreviewDesign);
    rememberStyleUndo(doc.id,before,applied);
    editDoc(d=>({...d,design:applied}));
    setPortableStyle(null);setPortableStyleError('');
  };
  const loadPortableStyle=async(file:File)=>{
    try{
      const preset=await importStylePreset(file);
      if(!doc||!editable)return;
      clearReference();closeStyleCompare();
      setPortableStyle({documentId:doc.id,name:preset.name,design:preset.design});
      setPortableStyleError('');
    }catch(error){setPortableStyle(null);setPortableStyleError(error instanceof Error?error.message:'프리셋을 열 수 없습니다.');}
  };
  const loadAdvancedPreset=async(file:File)=>{
    try{
      const preset=await importAdvancedLayoutPreset(file);
      if(!doc||!editable)return;
      closeStyleCompare();clearReference();setPortableStyle(null);
      setAdvancedPreview({documentId:doc.id,layoutId:preset.layoutId});
      setAdvancedPresetError('');
    }catch(error){setAdvancedPresetError(error instanceof Error?error.message:'레이아웃 파일을 열 수 없습니다.');}
  };
  const applyBrand=()=>{
    if(!doc||!editable||!businessActive)return;
    try{setBrandApplied(validateBusinessBrandKit(brandDraft));setBrandError('');}
    catch(error){setBrandError(error instanceof Error?error.message:'브랜드 입력을 확인하세요.');}
  };
  const loadBusinessBrand=async(file:File)=>{
    try{
      const kit=await importBusinessBrandKit(file);
      if(!doc||!editable)return;
      setBrandDraft(kit);setBrandApplied(kit);setBrandError('');
    }catch(error){setBrandError(error instanceof Error?error.message:'브랜드 파일을 불러올 수 없습니다.');}
  };
  const loadBrandLogo=async(file:File)=>{
    const id=doc?.id;
    try{
      if(!id||!editable||file.size<1||file.size>2*1024*1024||
        !['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('로고는 2MiB 이하 PNG/JPEG/WebP만 허용합니다.');
      const header=new Uint8Array(await file.slice(0,65536).arrayBuffer());
      const mime=imageType(header),dimensions=mime?imageDimensions(header,mime):null;
      if(mime!==file.type||!dimensions||dimensions.width<1||dimensions.height<1||
         dimensions.width*dimensions.height>4_000_000)throw new Error('로고 형식·크기가 올바르지 않습니다.');
      const bitmap=await createImageBitmap(file);
      try{if(bitmap.width*bitmap.height>4_000_000)throw new Error('로고 이미지가 너무 큽니다.');}finally{bitmap.close();}
      if(w.document?.id!==id)return;
      setBrandLogoUrl(URL.createObjectURL(file));setBrandError('');
    }catch(error){setBrandError(error instanceof Error?error.message:'로고 파일을 불러올 수 없습니다.');}
  };
  const cancelReferenceRender=()=>{const task=referenceRenderTask.current;referenceRenderTask.current=null;try{task?.cancel();}catch{}};
  const clearReference=()=>{
    cancelReferenceRender();
    referenceVersion.current++;
    if(referencePdfSession.current){void referencePdfSession.current.loading.destroy().catch(()=>{});referencePdfSession.current=null;}
    if(referenceImage?.url)URL.revokeObjectURL(referenceImage.url);
    setReferenceImage(null);setReferencePdf(null);setReferenceMetrics(null);setReferencePdfTypography(null);setReferencePreview(null);setReferenceError('');setReferenceStatus('');
    if(referenceInput.current)referenceInput.current.value='';
  };
  useEffect(()=>()=>{if(referenceImage?.url)URL.revokeObjectURL(referenceImage.url);},[referenceImage]);
  useEffect(()=>()=>{referenceVersion.current++;cancelReferenceRender();const session=referencePdfSession.current;referencePdfSession.current=null;if(session)void session.loading.destroy().catch(()=>{});},[]);
  useEffect(()=>{clearReference();setPortableStyle(null);setPortableStyleError('');setAdvancedPreview(null);setAdvancedPresetError('');setBrandApplied(null);setBrandDraft({name:'',tagline:'',footer:'',accent:PALETTE[0].value});setBrandError('');setBrandLogoUrl(null);},[doc?.id]);
  useEffect(()=>()=>{if(brandLogoUrl)URL.revokeObjectURL(brandLogoUrl);},[brandLogoUrl]);
  const analyzeReference=async(file:File)=>{
    setPortableStyle(null);clearReference();const version=referenceVersion.current;setReferenceError('');
    if(file.type==='application/pdf'||/\.pdf$/i.test(file.name)){
      if(file.size>30*1024*1024){setReferenceError('참고 PDF 파일은 30 MiB 이하여야 합니다.');return;}
      const signature=new Uint8Array(await file.slice(0,5).arrayBuffer());
      if(referenceVersion.current!==version)return;
      if(String.fromCharCode(...signature)!=='%PDF-'){setReferenceError('PDF 파일 시그니처가 올바르지 않습니다.');return;}
      await analyzeReferencePdf(file,1,version);return;
    }
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)){setReferenceError('PNG, JPEG, WebP 이미지 또는 PDF를 선택하세요.');return;}
    if(file.size===0||file.size>10*1024*1024){setReferenceError('참고 이미지 파일은 1바이트 이상 10 MiB 이하여야 합니다.');return;}
    try{
      const header=new Uint8Array(await file.slice(0,Math.min(file.size,65536)).arrayBuffer());
      if(referenceVersion.current!==version)return;
      const mime=imageType(header);
      if(!mime||mime!==file.type)throw new Error('이미지 MIME 유형과 실제 파일 형식이 일치하지 않습니다.');
      const dimensions=imageDimensions(header,mime);
      if(dimensions&&(!dimensions.width||!dimensions.height||dimensions.width*dimensions.height>20_000_000))throw new Error('이미지 크기는 20메가픽셀 이하여야 합니다.');
      const bitmap=await createImageBitmap(file);
      try{
        if(bitmap.width*bitmap.height>20_000_000)throw new Error('이미지 크기는 20메가픽셀 이하여야 합니다.');
        const scale=Math.min(1,512/Math.max(bitmap.width,bitmap.height));
        const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
        const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)throw new Error('이미지 분석용 canvas를 사용할 수 없습니다.');
        context.drawImage(bitmap,0,0,canvas.width,canvas.height);
        const metrics=analyzeReferencePixels(context.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);
        if(referenceVersion.current!==version)return;
        const url=URL.createObjectURL(file);
        setReferenceImage({url,name:file.name});setReferenceMetrics(metrics);
        setReferencePreview({documentId:doc!.id,design:{...doc!.design,theme:metrics.suggestedTheme,accent:metrics.accent??doc!.design.accent,textSize:metrics.suggestedTextSize}});
      }finally{bitmap.close();}
    }catch(error){if(referenceVersion.current===version)setReferenceError(error instanceof Error?error.message:'이미지를 분석할 수 없습니다.');}
  };
  const analyzeReferencePdf=async(file:File,pageNumber:number,version:number)=>{
    let loading:{promise:Promise<any>;destroy:()=>Promise<void>}|undefined;
    let page:any,renderTask:{promise:Promise<void>;cancel:()=>void}|undefined;
    try{
      setReferenceStatus('PDF 페이지 준비 중…');
      let pdf:any;
      if(referencePdfSession.current?.file===file)pdf=referencePdfSession.current.pdf;
      else{
        const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl;
        const bytes=new Uint8Array(await file.arrayBuffer());loading=pdfjs.getDocument({data:bytes,stopAtErrors:true});
        const record={file,loading,pdf:null};referencePdfSession.current=record;
        setReferenceStatus('PDF 문서 읽는 중…');
        pdf=await loading.promise;record.pdf=pdf;
        if(referenceVersion.current!==version){await loading.destroy();if(referencePdfSession.current===record)referencePdfSession.current=null;return;}
      }
      if(pdf.numPages<1||pdf.numPages>50)throw new Error('참고 PDF는 1~50페이지까지 지원합니다.');
      if(pageNumber<1||pageNumber>pdf.numPages)throw new Error('선택한 PDF 페이지가 없습니다.');
      setReferenceStatus('PDF 페이지 여는 중…');
      page=await pdf.getPage(pageNumber);if(referenceVersion.current!==version)return;const base=page.getViewport({scale:1});
      const textContent=await page.getTextContent();
      if(referenceVersion.current!==version)return;
      const typography=analyzePdfTypography(textContent.items.flatMap((item:{str?:string;transform?:number[];width?:number})=>
        typeof item.str==='string'&&item.transform?[{str:item.str,transform:item.transform,width:item.width??0}]:[]),base.width);
      const viewport=page.getViewport({scale:Math.min(1,512/Math.max(base.width,base.height))});
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.ceil(viewport.width));canvas.height=Math.max(1,Math.ceil(viewport.height));
      const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)throw new Error('PDF 페이지를 그릴 canvas가 없습니다.');
      setReferenceStatus('PDF 페이지 그리는 중…');
      const activeRender=page.render({canvasContext:context,viewport});renderTask=activeRender;referenceRenderTask.current=activeRender;
      await activeRender.promise;
      setReferenceStatus('PDF 디자인 분석 중…');
      const pixels=context.getImageData(0,0,canvas.width,canvas.height);
      const metrics=analyzeReferencePixels(pixels.data,canvas.width,canvas.height);
      if(referenceVersion.current!==version)return;
      const suggestedTextSize=suggestPdfBodyTextSize(typography,base.width,metrics.suggestedTextSize);
      setReferenceStatus('');setReferenceError('');
      setReferenceImage({url:null,name:`${file.name} · ${pageNumber}페이지`});
      setReferencePdf({file,pages:pdf.numPages,page:pageNumber});setReferenceMetrics(metrics);setReferencePdfTypography({...typography,suggestedTextSize});
      setReferencePreview({documentId:doc!.id,design:{...doc!.design,theme:metrics.suggestedTheme,accent:metrics.accent??doc!.design.accent,textSize:suggestedTextSize}});
      setReferenceError('');
    }catch(error){
      if(referenceVersion.current===version){const message=error instanceof Error?error.message:'PDF 페이지를 분석할 수 없습니다.';setReferenceStatus('');setReferenceError(/password/i.test(message)?'암호화된 PDF는 참고 자료로 지원하지 않습니다.':message);}
      if(loading&&referencePdfSession.current?.loading===loading){referencePdfSession.current=null;await loading.destroy();}
    }finally{
      if(renderTask&&referenceRenderTask.current===renderTask)referenceRenderTask.current=null;
      try{page?.cleanup();}catch{}
    }
  };
  const updateReferenceDesign=(patch:Partial<DesignSettings>)=>{
    if(!doc||!referencePreviewDesign)return;
    setReferencePreview({documentId:doc.id,design:{...referencePreviewDesign,...patch}});
  };
  const applyReferenceDesign=()=>{
    if(!doc||!referencePreviewDesign||sameDesign(doc.design,referencePreviewDesign))return;
    const before=structuredClone(doc.design),applied=structuredClone(referencePreviewDesign);
    rememberStyleUndo(doc.id,before,applied);editDoc(d=>({...d,design:applied}));
    clearReference();setPreviewTheme(null);
  };
  const editSection=(id:string,fn:(s:DocumentSection)=>DocumentSection)=>editDoc(d=>({...d,content:{...d.content,sections:d.content.sections.map(s=>s.id===id?fn(s):s)}}));
  const changeBlock=(sectionId:string,blockId:string,fn:(block:ContentBlock)=>ContentBlock)=>editSection(sectionId,s=>({...s,blocks:s.blocks.map(b=>b.id===blockId?fn(b):b)}));
  const print=async()=>{
    if(!doc)return;setPrintBusy(true);
    try{
      await w.flush();
      const missing=imageRefs.filter(id=>!w.assets.some(a=>a.id===id)||!urls[id]);if(missing.length)throw new Error('일부 이미지 파일이 누락되었습니다. 인쇄 전 문서를 확인해 주세요.');
      await Promise.all([...document.querySelectorAll<HTMLImageElement>('.project-paper img')].map(image=>image.decode()));
      await document.fonts.ready;
      await savePdfFromEditor(pdfOutputTextMarkers(doc),pdfOutputImageCount(doc));
    }catch(e){w.setError(e instanceof Error?`인쇄 준비 실패: ${e.message}`:'인쇄를 준비할 수 없습니다.');}finally{setPrintBusy(false);}
  };
  return <>
    <header className="app-header no-print"><div className="brand"><span className="brand-icon">A</span><div><h1>아스트라 PDF 리디자이너</h1><p>STEP 2·3 · 로컬 문서 및 PDF 가져오기</p></div></div>
      <div className="print-actions">{onOwnerReview&&<button type="button" className="secondary-button" data-step7-open-pdf-review onClick={onOwnerReview}>최종 PDF 원본 대조</button>}<button className="secondary-button" disabled={!editable} onClick={()=>void operation(async()=>{await w.flush();onLegacy();})}>기존 회고록 편집</button>
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
        <BatchImportPanel disabled={!editable} onImport={w.importPdfDraft} onSourceCommitted={onSourceCommitted}/>
        {sourceReview&&sourceReview.documentId===doc?.id&&
          <section ref={sourcePanel} tabIndex={-1} className="panel studio-source-panel no-print" aria-label="원본 PDF와 새 디자인 대조"
            data-source-document-id={sourceReview.documentId}>
            <div className="panel-heading project-heading-row">
              <h2>원본 ↔ 결과 대조</h2>
              <button className="text-button" type="button" onClick={closeSourceReview}>원본 비교 닫기</button>
            </div>
            <p className="help-text">원본: {sourceReview.fileName} · 현재 문서 전용 임시 미리보기입니다. 오른쪽 A4 결과와 비교하세요.</p>
            <div className="toolbar project-toolbar">
              <button type="button" className="secondary-button" data-source-review-receipt
                disabled={!editable} onClick={()=>{if(!doc)return;void operation(async()=>{
                  const source=sourceReviewRef.current;
                  if(!source||source.documentId!==doc.id)throw new Error('현재 원본 문서가 없습니다.');
                  const snapshot=JSON.stringify(doc.content);
                  const receipt=await makeSourceReviewReceipt(doc,reviewMarks,source.blob);
                  if(sourceReviewRef.current!==source||w.document?.id!==doc.id||
                     JSON.stringify(w.document.content)!==snapshot)
                    throw new Error('원본 검토 도중 문서가 변경되었습니다. 다시 시도하세요.');
                  downloadSourceReviewReceipt(receipt);
                });}}>검토 근거 JSON 저장</button>
            </div>
            <p className="help-text">영수증은 원본·문서 내용의 SHA-256, 출처 연결 블록 수와 수동 확인 상태만 기록합니다. 원문 내용은 포함하지 않으며 자동 원문 보존 인증서나 사용자 승인이 아닙니다.</p>
            <div className="m06-source-progress" role="status" data-m06-progress>
              수동 대조 {completedReview}/{originBlocks.length}개 완료
              {completedReview<originBlocks.length&&<strong> · 검수 미완료 — 누락·순서·수치 확인 필요</strong>}
            </div>
            {focusedBlock&&focusedBlock.origin&&<SourceAnchorPreview url={sourceReview.url} blob={sourceReview.blob}
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
      <div className="preview-column"><div className="preview-heading no-print"><div><h2>{styleCompareGalleryOpen&&styleCompareOpen?'두 디자인을 나란히 비교':'새 디자인 미리보기'}</h2><p>{styleCompareGalleryOpen&&styleCompareOpen?'같은 내용 · 임시 비교 · 저장된 문서는 변경되지 않았습니다':'A4 기준 · 최종 페이지 나눔은 인쇄 창에서 확인'}</p></div><span className="size-tag">A4</span></div>
        {doc&&styleCompareOpen&&styleCompareGalleryOpen&&previewThemeId?<div className="style-compare-gallery no-print" data-style-compare-gallery>
          <section className="style-compare-card" data-style-compare-original><h3>현재 디자인 · {allThemes.find(theme=>theme.id===doc.design.theme)?.label}</h3><div className="style-compare-card-viewport"><ProjectPreview doc={doc} urls={urls} previewDesign={{...doc.design,theme:doc.design.theme}}/></div></section>
          <section className="style-compare-card" data-style-compare-candidate><h3>비교 후보 · {allThemes.find(theme=>theme.id===previewThemeId)?.label}</h3><div className="style-compare-card-viewport"><ProjectPreview doc={doc} urls={urls} previewDesign={{...doc.design,theme:previewThemeId}}/></div></section>
        </div>:null}
        <div className={`paper-surface ${doc&&styleCompareOpen&&styleCompareGalleryOpen&&previewThemeId?'style-compare-print-candidate':''}`}>
          {doc?<ProjectPreview doc={doc} urls={urls} previewTheme={previewThemeId} previewDesign={activePreviewDesign} previewLayoutId={activeAdvancedLayoutId} brandKit={brandApplied} brandLogoUrl={brandLogoUrl}/>:<div className="document">{w.ready?'문서를 열 수 없습니다.':'불러오는 중…'}</div>}
        </div>
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
            <div className="setting-block"><h3>테마</h3><div className="theme-options">{allThemes.map(theme=><label className={`theme-option ${doc.design.theme===theme.id?'selected':''}`} key={theme.id}><input disabled={!editable} type="radio" name="v2theme" checked={doc.design.theme===theme.id} onChange={()=>{
              setAdvancedPreview(null);setPortableStyle(null);clearReference();editDoc(d=>({...d,design:{...d.design,theme:theme.id}}));
              if(styleCompareOpen&&doc)setPreviewTheme({documentId:doc.id,theme:theme.id});
            }}/><span><strong>{theme.label}</strong><small>{theme.description}</small></span></label>)}</div></div>
            <div className="setting-block"><h3>포인트 색상</h3><div className="swatches">{PALETTE.map(color=><label title={color.label} className={`swatch-wrap ${doc.design.accent===color.value?'active':''}`} key={color.value}><input disabled={!editable} type="radio" name="v2accent" aria-label={color.label} checked={doc.design.accent===color.value} onChange={()=>{setPortableStyle(null);clearReference();editDoc(d=>({...d,design:{...d.design,accent:color.value}}));}}/><span className="swatch" style={{backgroundColor:color.value}}/></label>)}</div></div>
            <div className="setting-block"><h3>본문 크기</h3><div className="segmented">{(['small','medium','large'] as const).map((size,i)=><label className={doc.design.textSize===size?'on':''} key={size}><input disabled={!editable} type="radio" name="v2size" checked={doc.design.textSize===size} onChange={()=>{setPortableStyle(null);clearReference();editDoc(d=>({...d,design:{...d.design,textSize:size}}));}}/>{['작게','보통','크게'][i]}</label>)}</div></div>
            <div className="setting-block"><h3>폰트</h3><div className="segmented">{(['sans','serif'] as const).map((font,i)=><label className={doc.design.font===font?'on':''} key={font}><input disabled={!editable} type="radio" name="v2font" checked={doc.design.font===font} onChange={()=>{setPortableStyle(null);clearReference();editDoc(d=>({...d,design:{...d.design,font}}));}}/>{['고딕','명조'][i]}</label>)}</div><p className="help-text">설치된 시스템 글꼴에 따라 표시가 달라집니다.</p></div>
          </section>
          <section className="panel style-compare-panel" aria-label="같은 문서 디자인 비교">
            <div className="panel-heading project-heading-row"><h2>같은 문서 디자인 비교</h2>
              <button type="button" className="secondary-button" data-style-compare-toggle aria-expanded={styleCompareOpen}
                onClick={styleCompareOpen?closeStyleCompare:openStyleCompare}>{styleCompareOpen?'비교 닫기':'8개 디자인 비교'}</button>
            </div>
            {styleCompareOpen&&selectedCompareTheme&&<>
              <p className="help-text">같은 문서 전체를 한 번에 하나씩 미리봅니다. 미리보기만으로는 저장되지 않습니다.</p>
              <div className="style-compare-candidates" role="group" aria-label="미리 볼 디자인">
                {allThemes.map(theme=><button type="button" key={theme.id} data-style-compare-theme={theme.id}
                  aria-pressed={selectedCompareTheme===theme.id}
                  className={selectedCompareTheme===theme.id?'selected':''}
                  onClick={()=>doc&&setPreviewTheme({documentId:doc.id,theme:theme.id})}>{theme.label}</button>)}
              </div>
              <p className="style-compare-status" role="status">
                {selectedCompareTheme===doc.design.theme?'저장된 디자인을 미리 보는 중':'임시 미리보기 · 저장 데이터는 변경되지 않았습니다'}
              </p>
 
              <button type="button" className="secondary-button" data-style-compare-side-by-side
                disabled={selectedCompareTheme===doc.design.theme}
                aria-expanded={styleCompareGalleryOpen}
                onClick={()=>setStyleCompareGalleryOpen(value=>!value)}>
                {styleCompareGalleryOpen?'나란히 비교 닫기':'현재와 후보 나란히 비교'}
              </button>             <div className="toolbar project-toolbar style-compare-actions">
                <button type="button" className="secondary-button" data-style-compare-apply
                  disabled={!editable||selectedCompareTheme===doc.design.theme} onClick={applyComparedTheme}>선택 디자인 적용</button>
                {currentStyleUndo&&<button type="button" className="text-button" data-style-compare-undo
                  disabled={!editable||!canUndoStyle} onClick={undoComparedTheme}>
                  {canUndoStyle?'방금 적용 취소':'다른 디자인 변경 후에는 취소할 수 없습니다'}
                </button>}
              </div>
            </>}
          </section>
          <section className="panel advanced-layout-panel" aria-label="추가 인쇄 레이아웃 시험" data-extended-layout-panel>
            <h3>고급 레이아웃 출력 실험 · 22개 시안</h3>
            <p className="help-text">기존 BASIC 8개에 PRO 후보 12개와 BUSINESS 후보 10개를 더한 구조 실험입니다. 디자인은 현재 문서에서만 미리보기·PDF 출력 가능하며, 프로젝트에 영구 저장되거나 SKU 사용권을 부여하지 않습니다. 상용 판매 준비 완료가 아닙니다.</p>
            <div className="advanced-layout-grid" role="group" aria-label="고급 인쇄 시안">
              {SKU_LAYOUT_CANDIDATES.map(layout=><button type="button" key={layout.id} data-extended-layout-id={layout.id}
                aria-pressed={activeAdvancedLayoutId===layout.id}
                onClick={()=>{closeStyleCompare();clearReference();setPortableStyle(null);setAdvancedPreview({documentId:doc.id,layoutId:layout.id});}}>{layout.label}</button>)}
            </div>
            <div className="toolbar project-toolbar">
              <button type="button" className="secondary-button" data-advanced-preset-export disabled={!editable||!activeAdvancedLayoutId}
                onClick={()=>{try{if(activeAdvancedLayoutId)downloadAdvancedLayoutPreset(activeAdvancedLayoutId);setAdvancedPresetError('');}catch(error){setAdvancedPresetError(error instanceof Error?error.message:'고급 레이아웃 파일을 저장할 수 없습니다.');}}}>선택 레이아웃 파일로 저장</button>
              <button type="button" className="secondary-button" data-advanced-preset-import disabled={!editable}
                onClick={()=>advancedPresetInput.current?.click()}>고급 레이아웃 파일 다시 열기</button>
            </div>
            <input ref={advancedPresetInput} className="hidden-input" type="file" accept=".json,application/json" data-advanced-preset-file
              aria-label="고급 레이아웃 JSON 선택" onChange={event=>{const file=event.target.files?.[0];event.target.value='';if(file)void loadAdvancedPreset(file);}}/>
            {advancedPresetError&&<p role="alert" className="warning" data-advanced-preset-error>{advancedPresetError}</p>}
            <p className="help-text">이 JSON에는 레이아웃 ID만 저장합니다. PDF 내용·이미지·문서 설정은 포함되지 않습니다. 현재 V2 프로젝트 저장소나 판매 권한은 변경하지 않습니다.</p>
            {activeAdvancedLayoutId&&<div className="advanced-layout-preview-note" role="status" data-extended-layout-status>
              {skuLayoutCandidate(activeAdvancedLayoutId)?.label} · 임시 미리보기/출력만 지원, 저장 데이터는 변경되지 않습니다.
              <div className="toolbar project-toolbar"><button type="button" className="secondary-button" data-extended-layout-cancel onClick={()=>setAdvancedPreview(null)}>기본 디자인으로 돌아가기</button></div>
            </div>}
          </section>
          <section className="panel" aria-label="BUSINESS 브랜드 키트" data-business-brand-panel>
            <h3>BUSINESS · 브랜드 키트 (로컬 시험)</h3>
            <p className="help-text">BUSINESS 레이아웃을 선택하면 회사명·브랜드 색상·로고·머리말/꼬리말을 시험 적용할 수 있습니다. 원본 PDF와 저장된 문서 데이터에는 영향을 주지 않습니다. 화면을 닫으면 로고가 사라지며, 브랜드 텍스트 JSON에는 로고 이미지가 포함되지 않습니다.</p>
            {!businessActive&&<p role="status" className="help-text">위의 BUSINESS 시안 중 하나를 선택하면 적용 버튼이 활성화됩니다.</p>}
            <label className="field">회사·브랜드 이름
              <input data-business-brand-name maxLength={60} disabled={!editable} value={brandDraft.name} onChange={e=>setBrandDraft(v=>({...v,name:e.target.value}))}/>
            </label>
            <label className="field">머리말 보조 문구
              <input data-business-brand-tagline maxLength={100} disabled={!editable} value={brandDraft.tagline} onChange={e=>setBrandDraft(v=>({...v,tagline:e.target.value}))}/>
            </label>
            <label className="field">꼬리말 문구
              <input data-business-brand-footer maxLength={150} disabled={!editable} value={brandDraft.footer} onChange={e=>setBrandDraft(v=>({...v,footer:e.target.value}))}/>
            </label>
            <label className="field">브랜드 강조 색상
              <select data-business-brand-accent disabled={!editable} value={brandDraft.accent} onChange={e=>setBrandDraft(v=>({...v,accent:e.target.value}))}>
                {PALETTE.map(color=><option key={color.value} value={color.value}>{color.label}</option>)}
              </select>
            </label>
            <div className="toolbar project-toolbar">
              <button type="button" className="secondary-button" data-business-brand-apply disabled={!editable||!businessActive} onClick={applyBrand}>브랜드 미리보기 적용</button>
              <button type="button" className="secondary-button" data-business-brand-clear disabled={!brandApplied&&!brandLogoUrl} onClick={()=>{setBrandApplied(null);setBrandLogoUrl(null);setBrandError('');}}>브랜드 적용 취소</button>
            </div>
            <div className="toolbar project-toolbar">
              <button type="button" className="secondary-button" data-business-brand-logo-picker disabled={!editable||!businessActive} onClick={()=>brandLogoInput.current?.click()}>로컬 로고 불러오기</button>
              <input className="hidden-input" ref={brandLogoInput} data-business-brand-logo-input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const f=e.target.files?.[0];e.target.value='';if(f)void loadBrandLogo(f);}}/>
              <button type="button" className="text-button" disabled={!brandLogoUrl} onClick={()=>setBrandLogoUrl(null)}>로고 제거</button>
            </div>
            <div className="toolbar project-toolbar">
              <button type="button" className="secondary-button" data-business-brand-export disabled={!editable||!brandApplied} onClick={()=>{try{if(brandApplied)downloadBusinessBrandKit(brandApplied);setBrandError('');}catch(e){setBrandError(e instanceof Error?e.message:'브랜드 파일을 저장할 수 없습니다.');}}}>브랜드 텍스트 JSON 저장</button>
              <button type="button" className="secondary-button" data-business-brand-import disabled={!editable} onClick={()=>brandImportInput.current?.click()}>브랜드 JSON 다시 열기</button>
              <input className="hidden-input" ref={brandImportInput} data-business-brand-file type="file" accept=".json,application/json" onChange={e=>{const f=e.target.files?.[0];e.target.value='';if(f)void loadBusinessBrand(f);}}/>
            </div>
            {brandError&&<p role="alert" className="warning" data-business-brand-error>{brandError}</p>}
            {brandApplied&&<p role="status" className="help-text" data-business-brand-status>임시 적용 중 · 실제 문서 V2는 변경되지 않았습니다. 정식 BUSINESS 사용권/영구 저장 기능은 아직 미구현입니다.</p>}
          </section>
          <section className="panel portable-style-panel" aria-label="디자인 프리셋 가져오기 및 내보내기" data-step4-portable-preset>
            <div className="panel-heading"><h2>디자인 프리셋 파일</h2><span className="panel-caption">문서 내용은 포함하지 않습니다</span></div>
            <p className="help-text">테마·색상·본문 크기·글꼴만 JSON으로 저장하거나 다른 기기에서 가져옵니다. 원본 PDF와 저장된 문서는 가져오기로 변경되지 않습니다.</p>
            <label className="field">프리셋 이름
              <input aria-label="디자인 프리셋 이름" value={portableStyleName} maxLength={60} disabled={!editable}
                onChange={event=>setPortableStyleName(event.target.value)}/>
            </label>
            <div className="toolbar project-toolbar">
              <button type="button" className="secondary-button" data-style-preset-export disabled={!editable}
                onClick={()=>{try{downloadStylePreset(portableStyleName,doc.design);setPortableStyleError('');}catch(error){setPortableStyleError(error instanceof Error?error.message:'프리셋을 저장할 수 없습니다.');}}}>현재 디자인 파일로 저장</button>
              <button type="button" className="secondary-button" data-style-preset-import disabled={!editable}
                onClick={()=>portableStyleInput.current?.click()}>프리셋 파일 가져오기</button>
            </div>
            <input ref={portableStyleInput} className="hidden-input" type="file" accept=".json,application/json" aria-label="프리셋 JSON 선택"
              onChange={event=>{const file=event.target.files?.[0];event.target.value='';if(file)void loadPortableStyle(file);}}/>
            {portableStyleError&&<p role="alert" className="warning" data-style-preset-error>{portableStyleError}</p>}
            {portablePreviewDesign&&portableStyle?.documentId===doc.id&&<div data-style-preset-preview>
              <p role="status">"{portableStyle.name}" 임시 미리보기 · 실제 문서 저장 전 확인하세요.</p>
              <div className="toolbar project-toolbar">
                <button type="button" className="secondary-button" data-style-preset-apply
                  disabled={!editable||sameDesign(doc.design,portablePreviewDesign)} onClick={applyPortableStyle}>미리보기 디자인 적용</button>
                <button type="button" className="text-button" data-style-preset-cancel
                  onClick={()=>{setPortableStyle(null);setPortableStyleError('');}}>가져오기 취소</button>
              </div>
            </div>}
          </section>
          <ReferenceSearchPanel/>
          <section className="panel reference-style-panel" aria-label="이미지 기반 디자인 제안">
            <div className="panel-heading"><h2>참고 이미지에서 디자인 제안</h2></div>
            <p className="help-text">이 기기 안에서 분석합니다. 색상, 여백, 시각적 밀도만 추정하며 텍스트와 글꼴은 인식하지 않습니다. 이미지는 문서에 저장하지 않습니다.</p>
            <input ref={referenceInput} className="hidden-input" type="file" accept="image/png,image/jpeg,image/webp,application/pdf,.pdf" onChange={event=>{const file=event.target.files?.[0];event.target.value='';if(file)void analyzeReference(file);}}/>
            <button type="button" className="secondary-button" disabled={!editable} onClick={()=>referenceInput.current?.click()}>이미지 또는 PDF 선택</button>
            {referenceError&&<p className="warning" role="alert">{referenceError}</p>}{referenceStatus&&<p className="help-text" role="status">{referenceStatus}</p>}
            {referencePdf&&<label className="field">참고 PDF 페이지<select disabled={!editable} value={referencePdf.page} onChange={event=>{const page=Number(event.target.value),file=referencePdf.file;cancelReferenceRender();setReferencePdf({...referencePdf,page});referenceVersion.current++;const version=referenceVersion.current;if(referenceImage?.url)URL.revokeObjectURL(referenceImage.url);setReferenceImage(null);setReferenceMetrics(null);setReferencePdfTypography(null);setReferencePreview(null);setReferenceError('');setReferenceStatus('PDF 페이지를 분석하고 있습니다…');void analyzeReferencePdf(file,page,version);}}>{Array.from({length:referencePdf.pages},(_,index)=><option key={index+1} value={index+1}>{index+1}페이지</option>)}</select></label>}
            {referenceImage&&referenceMetrics&&referencePreviewDesign&&<div className="reference-analysis" data-reference-analysis>
              <div className="reference-image-row">{referenceImage.url?<img src={referenceImage.url} alt="분석 중인 참고 이미지"/>:<span className="reference-pdf-badge" aria-hidden="true">PDF</span>}<div><strong>{referenceImage.name}</strong><p>대략적인 제안이며 수정할 수 있습니다.</p></div></div>
              <p className="reference-metrics">여백 영역: {Math.round(referenceMetrics.whiteSpace*100)}% · 시각적 밀도: {Math.round(referenceMetrics.visualDensity*100)}%<br/>추정 여백: 위 {Math.round(referenceMetrics.margins.top*100)}%, 오른쪽 {Math.round(referenceMetrics.margins.right*100)}%, 아래 {Math.round(referenceMetrics.margins.bottom*100)}%, 왼쪽 {Math.round(referenceMetrics.margins.left*100)}%<br/>추천 테마: {allThemes.find(t=>t.id===referenceMetrics.suggestedTheme)?.label}</p>
              {referencePdfTypography&&<p className="reference-metrics reference-pdf-typography" data-reference-pdf-text-count={referencePdfTypography.selectableTextCount} data-reference-pdf-body-size={referencePdfTypography.suggestedTextSize} role="note">PDF에 선택 가능한 텍스트 조각 {referencePdfTypography.selectableTextCount}개 · 중간 글자 크기 {referencePdfTypography.medianFontSize===null?'측정 불가':referencePdfTypography.medianFontSize.toFixed(1)}pt · 가장 큰 텍스트/중간 크기 비율 {referencePdfTypography.largestToMedianRatio===null?'측정 불가':referencePdfTypography.largestToMedianRatio.toFixed(1)}배 · 가장 큰 조각 정렬 {referencePdfTypography.largestFragmentAlignment==='unavailable'?'추정 불가':referencePdfTypography.largestFragmentAlignment==='left'?'왼쪽':referencePdfTypography.largestFragmentAlignment==='center'?'가운데':'오른쪽'}<br/>페이지 너비 대비 글자 크기로 본문 크기를 제안하고, 선택 가능한 텍스트가 없으면 픽셀 밀도 제안을 사용합니다. 스캔 이미지 OCR은 수행하지 않습니다.</p>}
              <div className="setting-block"><h3>제안 테마</h3><div className="style-compare-candidates" role="group" aria-label="제안 테마 수정">{allThemes.map(theme=><button type="button" key={theme.id} aria-pressed={referencePreviewDesign.theme===theme.id} className={referencePreviewDesign.theme===theme.id?'selected':''} onClick={()=>updateReferenceDesign({theme:theme.id})}>{theme.label}</button>)}</div></div>
              <div className="setting-block"><h3>강조 색상</h3><div className="swatches">{PALETTE.map(color=><button type="button" key={color.value} aria-label={color.label} aria-pressed={referencePreviewDesign.accent===color.value} className={`swatch-wrap ${referencePreviewDesign.accent===color.value?'active':''}`} onClick={()=>updateReferenceDesign({accent:color.value})}><span className="swatch" style={{backgroundColor:color.value}}/></button>)}</div></div>
              <div className="setting-block"><h3>본문 크기와 글꼴</h3><div className="segmented">{(['small','medium','large'] as const).map((size,i)=><button type="button" key={size} className={referencePreviewDesign.textSize===size?'on':''} aria-pressed={referencePreviewDesign.textSize===size} onClick={()=>updateReferenceDesign({textSize:size})}>{['작게','보통','크게'][i]}</button>)}{(['sans','serif'] as const).map((font,i)=><button type="button" key={font} className={referencePreviewDesign.font===font?'on':''} aria-pressed={referencePreviewDesign.font===font} onClick={()=>updateReferenceDesign({font})}>{['고딕','명조'][i]}</button>)}</div><p className="help-text">글꼴은 이미지에서 판별하지 않습니다. 직접 선택하세요.</p></div>
              <p className="style-compare-status" role="status">임시 A4 미리보기 · 변경 사항은 저장되지 않았습니다.</p>
              <div className="toolbar project-toolbar"><button type="button" className="secondary-button" disabled={!editable||sameDesign(doc.design,referencePreviewDesign)} onClick={applyReferenceDesign}>제안 적용</button><button type="button" className="secondary-button" data-step5-reference-preset-export disabled={!editable} onClick={()=>{try{downloadStylePreset('참고 스타일',referencePreviewDesign);setReferenceError('');}catch(error){setReferenceError(error instanceof Error?error.message:'프리셋 파일로 저장할 수 없습니다.');}}}>참고 스타일 파일로 저장</button><button type="button" className="text-button" onClick={clearReference}>취소</button></div>
            </div>}
            {currentStyleUndo&&<button type="button" className="text-button" disabled={!editable||!canUndoStyle} onClick={undoComparedTheme}>직전 디자인 적용 취소</button>}
          </section>
        </> : <p className="panel">문서를 불러오면 스타일을 선택할 수 있습니다.</p>}
      </aside>
    </main>
  </>;
}
