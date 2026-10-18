import { useCallback, useEffect, useRef, useState } from 'react';
import { blankProject, cloneProject, documentAssetIds, isProjectDocument, newIdentifier, type ImageAsset, type ProjectDocument } from './model.ts';
import { ACTIVE, deleteDocument, initialize, listDocuments, openDatabase, readAssets, readDocument, readMeta, saveDocument, setActive, writeTransaction } from './idb.ts';
import { validateImage } from './images.ts';
import { exportProject, importProject } from './projectFile.ts';
import { createMutationGate } from './mutationGate.ts';
import { pdfDraftToProject } from '../step3/convert.ts';
import type { PdfDraft } from '../step3/structure.ts';

type SaveState='대기'|'저장 중'|'저장됨'|'저장 실패';
export function useWorkspace(){
  const [ready,setReady]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState<SaveState>('대기');
  const [documents,setDocuments]=useState<ProjectDocument[]>([]),[document,setDocument]=useState<ProjectDocument|null>(null);
  const [assets,setAssets]=useState<ImageAsset[]>([]),[writable,setWritable]=useState(false),[locked,setLocked]=useState(false);
  const [operating,setOperating]=useState(false);
  const mutationGate=useRef(createMutationGate());
  const protectedMutation=useCallback(<T,>(action:()=>Promise<T>):Promise<T>=>mutationGate.current.run(async()=>{
    setOperating(true);
    try{return await action();}
    finally{setOperating(false);}
  }),[]);
  const dbRef=useRef<IDBDatabase|null>(null),draft=useRef<ProjectDocument|null>(null),dirty=useRef(0),saved=useRef(0),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const tail=useRef<Promise<void>>(Promise.resolve()),released=useRef<null|(()=>void)>(null),allowWrites=useRef(false);
  const setCurrent=useCallback((doc:ProjectDocument,all:ImageAsset[])=>{draft.current=doc;dirty.current=0;saved.current=0;setDocument(doc);setAssets(all);setStatus('저장됨');},[]);
  const flush=useCallback(async()=>{
    if(timer.current){clearTimeout(timer.current);timer.current=null;}
    const db=dbRef.current,doc=draft.current,seq=dirty.current;
    if(!db||!doc||seq===saved.current)return;
    if(!allowWrites.current)throw new Error('다른 탭이 문서를 편집하고 있습니다.');
    setStatus('저장 중');
    const snapshot=structuredClone(doc);
    const task=tail.current.catch(()=>{}).then(()=>saveDocument(db,snapshot));tail.current=task;
    try{await task;if(draft.current?.id===doc.id){saved.current=Math.max(saved.current,seq);setStatus(saved.current===dirty.current?'저장됨':'저장 중');await listDocuments(db).then(setDocuments);setError('');}}
    catch(e){setStatus('저장 실패');setError(e instanceof Error?e.message:'저장에 실패했습니다.');throw e;}
  },[]);
  const edit=useCallback((update:(doc:ProjectDocument)=>ProjectDocument)=>{
    if(!allowWrites.current||!draft.current||mutationGate.current.busy)return;
    const doc=update(draft.current);
    if(!isProjectDocument(doc)){setError('변경된 문서 구조가 유효하지 않습니다.');return;}
    const next={...doc,updatedAt:new Date().toISOString()};
    draft.current=next;dirty.current++;setDocument(next);setStatus('저장 중');setError('');
    if(timer.current)clearTimeout(timer.current);
    timer.current=setTimeout(()=>{void flush().catch(()=>{});},450);
  },[flush]);
  const refresh=useCallback(async()=>{if(dbRef.current)setDocuments(await listDocuments(dbRef.current));},[]);
  useEffect(()=>{
    let disposed=false;
    // Web Locks uses a held promise as an exclusive per-origin editor lease.
    const locks=navigator.locks;
    if(locks?.request){
      void locks.request('astra-pdf-redesigner-editor',{ifAvailable:true},async lock=>{
        if(!lock){if(!disposed){setLocked(true);setReady(true);}return;}
        if(disposed)return;
        allowWrites.current=true;setWritable(true);
        await new Promise<void>(resolve=>{released.current=resolve;});
      }).catch(()=>{if(!disposed){setError('탭 편집 잠금을 확인할 수 없습니다.');setReady(true);}});
    }else{allowWrites.current=true;setWritable(true);setError('이 브라우저는 여러 탭 편집 충돌 방지 기능이 없습니다. 한 탭에서만 편집하세요.');}
    return()=>{disposed=true;allowWrites.current=false;released.current?.();if(timer.current)clearTimeout(timer.current);dbRef.current?.close();};
  },[]);
  useEffect(()=>{
    if(!writable)return;
    let done=false;
    (async()=>{
      try{
        const db=await openDatabase();if(done){db.close();return;}dbRef.current=db;
        const init=await initialize(db);const list=await listDocuments(db);
        const active=await readMeta<string>(db,ACTIVE);
        const target=list.find(d=>d.id===active)??list[0];
        if(!target){setError(init.warning||'저장된 문서가 없습니다. 새 문서 생성을 시도해 주세요.');setReady(true);return;}
        const all=await readAssets(db,target.id);
        setDocuments(list);setCurrent(target,all);if(init.warning)setError(init.warning);setReady(true);
      }catch(e){setError(e instanceof Error?e.message:'로컬 저장소에 연결하지 못했습니다.');setReady(true);}
    })();return()=>{done=true;};
  },[writable,setCurrent]);
  useEffect(()=>{
    const listener=(event:BeforeUnloadEvent)=>{if(dirty.current!==saved.current){event.preventDefault();event.returnValue='';}};
    window.addEventListener('beforeunload',listener);return()=>window.removeEventListener('beforeunload',listener);
  },[]);
  const ensure=()=>{if(!dbRef.current||!allowWrites.current)throw new Error('문서 저장소가 준비되지 않았습니다.');return dbRef.current;};
  const switchTo=useCallback(async(id:string)=>{
    try{
      const db=ensure();await flush();const next=await readDocument(db,id);
      if(!next)throw new Error('선택한 문서를 찾을 수 없습니다.');
      const nextAssets=await readAssets(db,next.id);await setActive(db,id);
      setCurrent(next,nextAssets);await refresh();return true;
    }catch(e){setError(e instanceof Error?e.message:'문서 전환 실패');return false;}
  },[flush,setCurrent,refresh]);
  const create=useCallback(async(kind:'blank'|'retro'|'example')=>{
    try{const db=ensure();await flush();const doc=kind==='blank'?blankProject(): (await import('./model.ts')).retrospectiveProject(kind==='example');
      await writeTransaction(db,doc,[],[],{[ACTIVE]:doc.id});setCurrent(doc,[]);await refresh();return true;
    }catch(e){setError(e instanceof Error?e.message:'새 문서 생성 실패');return false;}
  },[flush,setCurrent,refresh]);
  const duplicate=useCallback(async()=>{
    try{const db=ensure();await flush();if(!draft.current)return false;
      const currentAssets=await readAssets(db,draft.current.id);
      if(documentAssetIds(draft.current).some(id=>!currentAssets.some(asset=>asset.id===id)))throw new Error('원본 이미지가 누락되어 안전하게 복제할 수 없습니다.');
      const copy=cloneProject(draft.current,currentAssets);
      await writeTransaction(db,copy.document,copy.assets,[],{[ACTIVE]:copy.document.id});setCurrent(copy.document,copy.assets);await refresh();return true;
    }catch(e){setError(e instanceof Error?e.message:'문서 복제 실패');return false;}
  },[flush,setCurrent,refresh]);
  const remove=useCallback(async()=>{
    try{const db=ensure();await flush();const doc=draft.current;if(!doc)return false;
      const others=(await listDocuments(db)).filter(item=>item.id!==doc.id);
      const next=others[0]??blankProject();
      await deleteDocument(db,doc,next.id,others.length?undefined:next);
      setCurrent(next,await readAssets(db,next.id));await refresh();return true;
    }catch(e){setError(e instanceof Error?e.message:'문서 삭제 실패');return false;}
  },[flush,setCurrent,refresh]);
  const insertImage=useCallback(async(file:File,sectionId:string,replaceId?:string)=>{
    try{
      const db=ensure();await flush();const doc=draft.current;if(!doc)return;
      const asset=await validateImage(file,file.name,doc.id);
      const removeIds:string[]=[];
      const next:ProjectDocument={...doc,updatedAt:new Date().toISOString(),content:{...doc.content,sections:doc.content.sections.map(section=>{
        if(section.id!==sectionId)return section;
        const old=section.blocks.find(block=>block.id===replaceId);
        if(replaceId&&old?.kind!=='image')throw new Error('교체할 이미지가 없습니다.');
        const blocks=replaceId?section.blocks.map(block=>{
          if(block.id!==replaceId||block.kind!=='image')return block;
          removeIds.push(block.assetId);return{...block,assetId:asset.id};
        }):[...section.blocks,{id:newIdentifier(),kind:'image' as const,assetId:asset.id,caption:'',alignment:'center' as const,size:'medium' as const}];
        return{...section,blocks};
      })}};
      if(!isProjectDocument(next)||!next.content.sections.some(section=>section.id===sectionId))throw new Error('이미지를 추가할 섹션을 찾을 수 없습니다.');
      await writeTransaction(db,next,[asset],removeIds);setCurrent(next,await readAssets(db,doc.id));await refresh();setError('');
    }catch(e){setError(e instanceof Error?e.message:'이미지 저장에 실패했습니다.');}
  },[flush,setCurrent,refresh]);
  const removeSection=useCallback(async(sectionId:string)=>{
    try{const db=ensure();await flush();const doc=draft.current;if(!doc)return;
      const section=doc.content.sections.find(s=>s.id===sectionId);if(!section)return;
      const removed=section.blocks.filter(b=>b.kind==='image').map(b=>b.assetId);
      const next:ProjectDocument={...doc,updatedAt:new Date().toISOString(),content:{...doc.content,sections:doc.content.sections.filter(s=>s.id!==sectionId)}};
      await writeTransaction(db,next,[],removed);setCurrent(next,await readAssets(db,doc.id));await refresh();setError('');
    }catch(e){setError(e instanceof Error?e.message:'섹션 삭제 실패');}
  },[flush,setCurrent,refresh]);
  const removeImage=useCallback(async(sectionId:string,blockId:string)=>{
    try{const db=ensure();await flush();const doc=draft.current;if(!doc)return;
      const section=doc.content.sections.find(item=>item.id===sectionId);
      const block=section?.blocks.find(item=>item.id===blockId);if(!block||block.kind!=='image')return;
      const next:ProjectDocument={...doc,updatedAt:new Date().toISOString(),content:{...doc.content,sections:doc.content.sections.map(s=>s.id!==sectionId?s:{...s,blocks:s.blocks.filter(b=>b.id!==blockId)})}};
      await writeTransaction(db,next,[],[block.assetId]);setCurrent(next,await readAssets(db,doc.id));await refresh();setError('');
    }catch(e){setError(e instanceof Error?e.message:'이미지 제거 실패');}
  },[flush,setCurrent,refresh]);
  const importPdfDraft=useCallback(async(source:PdfDraft)=>{
    try{
      const db=ensure();await flush();
      const next=pdfDraftToProject(source);
      // Do not change the current draft, active ID, or any assets until the
      // new document and the active marker commit in one IndexedDB transaction.
      await writeTransaction(db,next,[],[],{[ACTIVE]:next.id});
      setCurrent(next,[]);await refresh();setError('');return true;
    }catch(error){
      setError(error instanceof Error?error.message:'PDF 문서를 저장하지 못했습니다.');
      return false;
    }
  },[flush,setCurrent,refresh]);
  const exportCurrent=useCallback(async()=>{
    const db=ensure();const doc=draft.current;if(!doc)throw new Error('활성 문서가 없습니다.');
    return exportProject(doc,await readAssets(db,doc.id));
  },[]);
  const importCurrent=useCallback(async(file:File)=>{
    try{const incoming=await importProject(file);const db=ensure();await flush();
      await writeTransaction(db,incoming.document,incoming.assets,[],{[ACTIVE]:incoming.document.id});
      setCurrent(incoming.document,incoming.assets);await refresh();setError('');return true;
    }catch(e){setError(e instanceof Error?e.message:'프로젝트를 가져올 수 없습니다.');return false;}
  },[flush,setCurrent,refresh]);
  return{ready,locked,writable,operating,error,setError,status,documents,document,assets,edit,flush,
    switchTo:(id:string)=>protectedMutation(()=>switchTo(id)),
    create:(kind:'blank'|'retro'|'example')=>protectedMutation(()=>create(kind)),
    duplicate:()=>protectedMutation(duplicate),
    remove:()=>protectedMutation(remove),
    insertImage:(file:File,sectionId:string,replaceId?:string)=>protectedMutation(()=>insertImage(file,sectionId,replaceId)),
    removeImage:(sectionId:string,blockId:string)=>protectedMutation(()=>removeImage(sectionId,blockId)),
    removeSection:(sectionId:string)=>protectedMutation(()=>removeSection(sectionId)),
    exportCurrent:()=>protectedMutation(exportCurrent),
    importCurrent:(file:File)=>protectedMutation(()=>importCurrent(file)),
    importPdfDraft:(source:PdfDraft)=>protectedMutation(()=>importPdfDraft(source))};
}
