// Local BUSINESS text-only brand library; separate namespace, never stores document, assets or logo bytes.
import {validateBusinessBrandKit,type BusinessBrandKit} from './brandKit.ts';
export const BUSINESS_LIBRARY_KEY='astra.business-brand-library.v1';
export const BUSINESS_LIBRARY_MAX=12;
export const BUSINESS_LIBRARY_FORMAT='astra-business-brand-library';
const MAX_BYTES=16*1024;
export interface SavedBrandKit {id:string;label:string;kit:BusinessBrandKit;savedAt:number}
const fail=():never=>{throw Error('브랜드 보관함 데이터 검증에 실패했습니다. 기존 파일은 덮어쓰지 않습니다.');};
const exact=(value:unknown,fields:readonly string[]):value is Record<string,unknown>=>
 !!value&&typeof value==='object'&&!Array.isArray(value)&&
 Object.keys(value).length===fields.length&&fields.every(field=>Object.hasOwn(value,field));
export function validateSavedBrandKits(raw:unknown):SavedBrandKit[]{
 if(!Array.isArray(raw)||raw.length>BUSINESS_LIBRARY_MAX)return fail();
 const seen=new Set<string>();
 return raw.map(record=>{
   if(!exact(record,['id','label','kit','savedAt'])||
      typeof record.id!=='string'||!/^[0-9a-f-]{20,64}$/i.test(record.id)||
      typeof record.label!=='string'||record.label.trim().length<1||record.label.length>60||
      /[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/u.test(record.label)||
      typeof record.savedAt!=='number'||!Number.isSafeInteger(record.savedAt)||
      record.savedAt<1577836800000||seen.has(record.id))return fail();
   seen.add(record.id);
   return {id:record.id,label:record.label.trim(),kit:validateBusinessBrandKit(record.kit),savedAt:record.savedAt};
 });
}
export function serializeBrandLibrary(items:SavedBrandKit[]):string{
 const json=JSON.stringify({format:BUSINESS_LIBRARY_FORMAT,version:1,items:validateSavedBrandKits(items)});
 if(new TextEncoder().encode(json).length>MAX_BYTES)return fail();
 return json;
}
export function parseBrandLibrary(source:string):SavedBrandKit[]{
 if(typeof source!=='string'||new TextEncoder().encode(source).length>MAX_BYTES)return fail();
 let parsed:unknown;try{parsed=JSON.parse(source);}catch{return fail();}
 if(!exact(parsed,['format','version','items'])||parsed.format!==BUSINESS_LIBRARY_FORMAT||parsed.version!==1)return fail();
 return validateSavedBrandKits(parsed.items);
}
export function readLocalBrandLibrary(storage:Pick<Storage,'getItem'>):SavedBrandKit[]{
 const value=storage.getItem(BUSINESS_LIBRARY_KEY);
 return value===null?[]:parseBrandLibrary(value);
}
export function writeLocalBrandLibrary(storage:Pick<Storage,'setItem'>,items:SavedBrandKit[]):void{
 storage.setItem(BUSINESS_LIBRARY_KEY,serializeBrandLibrary(items));
}
