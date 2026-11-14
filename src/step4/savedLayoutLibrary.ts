// PRO/BUSINESS local saved layout library, isolated from the STEP1/V2 project schemas.
import {skuLayoutCandidate} from './skuLayoutCandidates.ts';
export const PRO_LIBRARY_KEY='astra.pro-layout-library.v1';
export const PRO_LIBRARY_FORMAT='astra-pro-layout-library';
export const PRO_LIBRARY_MAX=24;
const MAX_BYTES=16*1024;
export interface SavedLayout {
  id:string; name:string; layoutId:string; savedAt:number;
}
const fail=():never=>{throw Error('저장된 레이아웃 목록이 손상되었거나 지원하지 않는 형식입니다. 기존 자료는 덮어쓰지 않습니다.');};
function exactKeys(x:unknown,required:readonly string[]):x is Record<string,unknown>{
 return !!x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===required.length&&required.every(k=>Object.hasOwn(x,k));
}
export function validateSavedLayouts(raw:unknown):SavedLayout[]{
 if(!Array.isArray(raw)||raw.length>PRO_LIBRARY_MAX)return fail();
 const ids=new Set<string>();
 return raw.map(item=>{
  if(!exactKeys(item,['id','name','layoutId','savedAt'])||
     typeof item.id!=='string'||!/^[a-zA-Z0-9-]{10,64}$/.test(item.id)||
     typeof item.name!=='string'||item.name.trim().length<1||item.name.trim().length>60||
     /[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/u.test(item.name)||
     typeof item.layoutId!=='string'||!skuLayoutCandidate(item.layoutId)||
     typeof item.savedAt!=='number'||!Number.isSafeInteger(item.savedAt)||item.savedAt<1577836800000||ids.has(item.id))return fail();
   ids.add(item.id);
   return {id:item.id,name:item.name.trim(),layoutId:item.layoutId,savedAt:item.savedAt};
 });
}
export function serializeSavedLayoutLibrary(items:SavedLayout[]):string{
 const verified=validateSavedLayouts(items);
 const json=JSON.stringify({format:PRO_LIBRARY_FORMAT,version:1,items:verified});
 if(new TextEncoder().encode(json).length>MAX_BYTES)return fail();
 return json;
}
export function parseSavedLayoutLibrary(source:string):SavedLayout[]{
 if(typeof source!=='string'||new TextEncoder().encode(source).length>MAX_BYTES)return fail();
 let raw:unknown;try{raw=JSON.parse(source);}catch{return fail();}
 if(!exactKeys(raw,['format','version','items'])||raw.format!==PRO_LIBRARY_FORMAT||raw.version!==1)return fail();
 return validateSavedLayouts(raw.items);
}
export function readLocalLayoutLibrary(storage:Pick<Storage,'getItem'>):SavedLayout[]{
 const raw=storage.getItem(PRO_LIBRARY_KEY);
 return raw===null?[]:parseSavedLayoutLibrary(raw);
}
export function writeLocalLayoutLibrary(storage:Pick<Storage,'setItem'>,items:SavedLayout[]):void{
 storage.setItem(PRO_LIBRARY_KEY,serializeSavedLayoutLibrary(items));
}
