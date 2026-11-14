import {useEffect,useState} from 'react';
import {skuLayoutCandidate} from './skuLayoutCandidates.ts';
import {PRO_LIBRARY_MAX,readLocalLayoutLibrary,writeLocalLayoutLibrary,type SavedLayout} from './savedLayoutLibrary.ts';

interface Props {disabled:boolean;selectedId?:string;onRestore:(id:string)=>void}
export default function ProLayoutLibrary({disabled,selectedId,onRestore}:Props){
 const [items,setItems]=useState<SavedLayout[]>([]);
 const [name,setName]=useState('내 레이아웃');
 const [error,setError]=useState('');
 const [corrupt,setCorrupt]=useState(false);
 useEffect(()=>{
   try{setItems(readLocalLayoutLibrary(localStorage));setError('');setCorrupt(false);}
   catch{setCorrupt(true);setError('기존 저장된 레이아웃 목록에 문제가 있습니다. 자동 덮어쓰기를 막았습니다. 파일과 브라우저 프로필을 보존하세요.');}
 },[]);
 const save=()=>{
   if(!selectedId||!skuLayoutCandidate(selectedId)||disabled||corrupt)return;
   try{
     const next=[...items,{id:crypto.randomUUID(),name:name.trim(),layoutId:selectedId,savedAt:Date.now()}];
     writeLocalLayoutLibrary(localStorage,next);setItems(next);setError('');
   }catch(e){setError(e instanceof Error?e.message:'레이아웃을 로컬에 저장하지 못했습니다.');}
 };
 const remove=(id:string)=>{
   if(disabled||corrupt||!window.confirm('저장한 레이아웃 선택 기록을 삭제하시겠습니까? 기존 문서 내용은 그대로입니다.'))return;
   try{const next=items.filter(x=>x.id!==id);writeLocalLayoutLibrary(localStorage,next);setItems(next);setError('');}
   catch(e){setError(e instanceof Error?e.message:'목록을 삭제할 수 없습니다.');}
 };
 return <section className="pro-layout-library no-print" data-pro-layout-library aria-label="PRO 로컬 디자인 보관함">
   <h3>PRO · 내 레이아웃 보관함 (이 기기)</h3>
   <p className="help-text">고급 레이아웃 ID와 별명만 별도의 브라우저 저장소에 기록합니다(최대 {PRO_LIBRARY_MAX}건). PDF 원문·이미지·V2 문서는 저장하지 않습니다. 브라우저 데이터를 지우면 목록이 사라지므로 필요하면 위의 레이아웃 JSON을 따로 백업하세요. 현재 시험 모드이며 상용 PRO 사용권과 무관합니다.</p>
   <label className="field">레이아웃 별명
     <input data-pro-layout-name value={name} maxLength={60} disabled={disabled||corrupt} onChange={e=>setName(e.target.value)}/>
   </label>
   <button type="button" className="secondary-button" data-pro-layout-save
     disabled={disabled||corrupt||!selectedId||items.length>=PRO_LIBRARY_MAX||!name.trim()}
     onClick={save}>현재 고급 레이아웃 이 기기에 저장</button>
   {error&&<p role="alert" className="warning" data-pro-layout-error>{error}</p>}
   <p role="status" data-pro-layout-count>저장된 레이아웃 {items.length}/{PRO_LIBRARY_MAX}</p>
   <div data-pro-layout-items className="document-list">
    {items.map(item=><div key={item.id} className="mini-actions" data-pro-layout-entry={item.id}>
      <span>{item.name} · {skuLayoutCandidate(item.layoutId)?.label}</span>
      <button type="button" className="secondary-button" data-pro-layout-restore={item.id} disabled={disabled}
        onClick={()=>onRestore(item.layoutId)}>미리보기</button>
      <button type="button" className="text-button" data-pro-layout-remove={item.id} disabled={disabled||corrupt}
        onClick={()=>remove(item.id)}>삭제</button>
    </div>)}
   </div>
 </section>;
}
