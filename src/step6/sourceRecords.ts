// STEP6 owner-curated source records. A user note never proves reuse rights.
export const SOURCE_LIBRARY_KEY='astra.step6.sources.v1';
export const SOURCE_LIBRARY_FORMAT='astra-step6-sources';
export const MAX_SOURCES=20;
const MAX_BYTES=16*1024;
export interface SourceRecord{id:string;title:string;sourceUrl:string;note:string;addedAt:number;rights:'UNVERIFIED'}
const fail=():never=>{throw Error('출처 메타데이터가 잘못되었거나 저장 공간에 문제가 있습니다. 기존 기록은 덮어쓰지 않습니다.');};
function shape(raw:unknown,fields:readonly string[]):raw is Record<string,unknown>{
 return !!raw&&typeof raw==='object'&&!Array.isArray(raw)&&Object.keys(raw).length===fields.length&&fields.every(field=>Object.hasOwn(raw,field));
}
function sourceUrl(raw:unknown):string{
 if(typeof raw!=='string'||raw.trim()!==raw||raw.length>1000)return fail();
 let url:URL;try{url=new URL(raw);}catch{return fail();}
 const host=url.hostname.toLowerCase();
 if(url.protocol!=='https:'||url.port||url.username||url.password||url.hash||
    host==='localhost'||host.endsWith('.local')||host.endsWith('.localhost')||
    /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)||host.includes(':'))return fail();
 return url.toString();
}
export function validateSources(raw:unknown):SourceRecord[]{
 if(!Array.isArray(raw)||raw.length>MAX_SOURCES)return fail();
 const seen=new Set<string>();
 return raw.map(item=>{
  if(!shape(item,['id','title','sourceUrl','note','addedAt','rights'])||
     typeof item.id!=='string'||!/^[0-9a-f-]{20,64}$/i.test(item.id)||
     typeof item.title!=='string'||item.title.trim().length===0||item.title.length>80||
     /[\u0000-\u001f\u007f-\u009f]/u.test(item.title)||
     typeof item.note!=='string'||item.note.length>240||
     /[\u0000-\u001f\u007f-\u009f]/u.test(item.note)||
     typeof item.addedAt!=='number'||!Number.isSafeInteger(item.addedAt)||item.addedAt<1577836800000||
     item.rights!=='UNVERIFIED'||seen.has(item.id))return fail();
  seen.add(item.id);
  return {id:item.id,title:item.title.trim(),sourceUrl:sourceUrl(item.sourceUrl),
    note:item.note.trim(),addedAt:item.addedAt,rights:'UNVERIFIED' as const};
 });
}
export function parseSources(raw:string):SourceRecord[]{
 if(typeof raw!=='string'||new TextEncoder().encode(raw).length>MAX_BYTES)return fail();
 let data:unknown;try{data=JSON.parse(raw);}catch{return fail();}
 if(!shape(data,['format','version','items'])||data.format!==SOURCE_LIBRARY_FORMAT||data.version!==1)return fail();
 return validateSources(data.items);
}
export function serializeSources(items:SourceRecord[]):string{
 const content=JSON.stringify({format:SOURCE_LIBRARY_FORMAT,version:1,items:validateSources(items)});
 if(new TextEncoder().encode(content).length>MAX_BYTES)return fail();
 return content;
}
export function readSources(storage:Pick<Storage,'getItem'>):SourceRecord[]{
 const raw=storage.getItem(SOURCE_LIBRARY_KEY);
 return raw===null?[]:parseSources(raw);
}
export function writeSources(storage:Pick<Storage,'setItem'>,items:SourceRecord[]):void{
 storage.setItem(SOURCE_LIBRARY_KEY,serializeSources(items));
}
