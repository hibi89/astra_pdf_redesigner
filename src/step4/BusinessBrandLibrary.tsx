import {useEffect,useState} from 'react';
import type {BusinessBrandKit} from './brandKit.ts';
import {runSkuGatedAction} from '../commercial/skuActionGate.ts';
import {BUSINESS_LIBRARY_MAX,readLocalBrandLibrary,writeLocalBrandLibrary,type SavedBrandKit} from './businessBrandLibrary.ts';
interface Props{disabled:boolean;licenseReceipt:string;kit:BusinessBrandKit|null;onRestore:(kit:BusinessBrandKit)=>void}
export default function BusinessBrandLibrary({disabled,licenseReceipt,kit,onRestore}:Props){
 const [items,setItems]=useState<SavedBrandKit[]>([]);
 const [error,setError]=useState('');
 const [corrupt,setCorrupt]=useState(false);
 useEffect(()=>{try{setItems(readLocalBrandLibrary(localStorage));setCorrupt(false);}
   catch{setError('브랜드 목록이 손상되어 자동 덮어쓰기를 차단했습니다. 로컬 프로필을 보존하세요.');setCorrupt(true);}},[]);
 const save=()=>{
   if(!kit||corrupt||disabled)return;
   void runSkuGatedAction(['brand-kit'],licenseReceipt,()=>{
     try{const next=[...items,{id:crypto.randomUUID(),label:kit.name,kit,savedAt:Date.now()}];
       writeLocalBrandLibrary(localStorage,next);setItems(next);setError('');}
     catch(e){setError(e instanceof Error?e.message:'브랜드 저장에 실패했습니다.');}
   }).catch(e=>setError(e instanceof Error?e.message:'사용권 확인 실패'));
 };
 const remove=(id:string)=>{
   if(disabled||corrupt||!window.confirm('브랜드 텍스트 보관 기록을 삭제하시겠습니까? 현재 문서와 로고는 변경되지 않습니다.'))return;
   void runSkuGatedAction(['brand-kit'],licenseReceipt,()=>{
     try{const next=items.filter(x=>x.id!==id);writeLocalBrandLibrary(localStorage,next);setItems(next);setError('');}
     catch(e){setError(e instanceof Error?e.message:'브랜드 삭제에 실패했습니다.');}
   }).catch(e=>setError(e instanceof Error?e.message:'사용권 확인 실패'));
 };
 return <section data-business-brand-library className="business-brand-library no-print" aria-label="BUSINESS 로컬 브랜드 보관함">
   <h3>BUSINESS · 내 브랜드 보관함</h3>
   <p className="help-text">회사명·보조 문구·꼬리말·색상만 별도 로컬 저장합니다(최대 {BUSINESS_LIBRARY_MAX}건). PDF 내용·개인 자료·로고 이미지와 문서 V2 데이터는 보관하지 않습니다. 로고는 다시 불러와야 합니다.</p>
   <button type="button" className="secondary-button" data-business-library-save
      disabled={!kit||disabled||corrupt||items.length>=BUSINESS_LIBRARY_MAX} onClick={save}>현재 브랜드 텍스트 로컬 저장</button>
   {error&&<p className="warning" role="alert" data-business-library-error>{error}</p>}
   <p role="status" data-business-library-count>저장된 브랜드 {items.length}/{BUSINESS_LIBRARY_MAX}</p>
   {items.map(record=><div key={record.id} className="mini-actions" data-business-library-entry={record.id}>
     <strong>{record.label}</strong>
     <button type="button" className="secondary-button" data-business-library-restore={record.id} disabled={disabled}
       onClick={()=>onRestore(record.kit)}>적용</button>
     <button type="button" className="text-button" data-business-library-remove={record.id} disabled={disabled||corrupt}
       onClick={()=>remove(record.id)}>삭제</button>
   </div>)}
 </section>;
}
