import {useEffect,useState} from 'react';
import {MAX_SOURCES,readSources,writeSources,type SourceRecord} from './sourceRecords.ts';
export default function SourceRecordsPanel({onAnalyzeLocalFile}:{onAnalyzeLocalFile?:(source:SourceRecord)=>void}){
 const [title,setTitle]=useState('');
 const [url,setUrl]=useState('');
 const [note,setNote]=useState('');
 const [items,setItems]=useState<SourceRecord[]>([]);
 const [error,setError]=useState('');
 const [corrupt,setCorrupt]=useState(false);
 useEffect(()=>{try{setItems(readSources(localStorage));}
   catch{setCorrupt(true);setError('저장된 출처 기록이 손상되어 자동 덮어쓰기를 막았습니다.');}},[]);
 const add=()=>{
  if(corrupt)return;
  try{
   const next=[...items,{id:crypto.randomUUID(),title,sourceUrl:url,note,addedAt:Date.now(),rights:'UNVERIFIED' as const}];
   writeSources(localStorage,next);setItems(readSources(localStorage));setTitle('');setUrl('');setNote('');setError('');
  }catch(e){setError(e instanceof Error?e.message:'출처를 기록하지 못했습니다.');}
 };
 const remove=(id:string)=>{
  if(corrupt||!window.confirm('이 참고자료 출처 기록을 삭제하시겠습니까? 원본 PDF는 그대로 둡니다.'))return;
  try{const next=items.filter(x=>x.id!==id);writeSources(localStorage,next);setItems(next);setError('');}
  catch(e){setError(e instanceof Error?e.message:'출처를 삭제하지 못했습니다.');}
 };
 return <section className="panel no-print" aria-label="STEP6 참고자료 출처 보관" data-step6-source-library>
  <h3>STEP6 · 참고자료 출처 보관함</h3>
  <p className="help-text">직접 확인한 레퍼런스의 출처 URL/이름/권리 메모만 로컬에 기록합니다(최대 {MAX_SOURCES}건). 이미지·문서·검색결과를 자동 다운로드하지 않습니다. 메모는 라이선스 인증이 아니라 검토 전 기록입니다.</p>
  <label className="field">참고자료 이름<input data-step6-source-title maxLength={80} value={title} onChange={e=>setTitle(e.target.value)}/></label>
  <label className="field">원본 출처 URL (HTTPS)<input data-step6-source-url type="url" maxLength={1000} value={url} onChange={e=>setUrl(e.target.value)}/></label>
  <label className="field">사용권/출처 메모 (미검증)<textarea data-step6-source-note rows={2} maxLength={240} value={note} onChange={e=>setNote(e.target.value)}/></label>
  <button type="button" className="secondary-button" data-step6-source-add disabled={corrupt||!title.trim()||!url.trim()||items.length>=MAX_SOURCES} onClick={add}>출처만 로컬 저장</button>
  {error&&<p role="alert" className="warning" data-step6-source-error>{error}</p>}
  <p role="status" data-step6-source-count>보관된 출처 {items.length}/{MAX_SOURCES} · 모두 사용권 미검증</p>
  {items.map(item=><div className="mini-actions" key={item.id} data-step6-source-entry={item.id}>
   <strong>{item.title}</strong><code>{item.sourceUrl}</code><small>사용권 미검증 · {item.note}</small>
   {onAnalyzeLocalFile&&<button type="button" className="secondary-button" data-step6-source-to-step5={item.id} disabled={corrupt}
      onClick={()=>onAnalyzeLocalFile(item)}>로컬 파일로 STEP5 디자인 분석</button>}
   <button type="button" className="text-button" data-step6-source-remove={item.id} disabled={corrupt} onClick={()=>remove(item.id)}>기록 삭제</button>
  </div>)}
 </section>;
}
