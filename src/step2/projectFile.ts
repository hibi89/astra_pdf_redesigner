import { LIMITS, cloneProject, documentAssetIds, isProjectDocument, type ImageAsset, type ProjectDocument } from './model.ts';
import { validateImage } from './images.ts';

const FORMAT='astra-local-document';
const VERSION=1;
export function safeFilename(name:string):string{return name.replace(/[\\/:*?"<>|\u0000-\u001f]/g,'_').trim().slice(0,100)||'문서';}
export async function toBase64(blob:Blob):Promise<string>{
  const bytes=new Uint8Array(await blob.arrayBuffer());const batch=24*1024;let result='';
  for(let i=0;i<bytes.length;i+=batch)result+=btoa(String.fromCharCode(...bytes.subarray(i,i+batch)));
  return result;
}
export function fromBase64(value:string):Uint8Array{
  if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value))throw new Error('이미지 Base64 인코딩이 잘못되었습니다.');
  const bin=atob(value);if(bin.length>LIMITS.imageBytes)throw new Error('이미지 크기가 제한을 초과합니다.');
  const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  return bytes;
}
export async function exportProject(document:ProjectDocument, assets:ImageAsset[]):Promise<string>{
  if(!isProjectDocument(document))throw new Error('내보낼 문서 구조가 올바르지 않습니다.');
  const required=documentAssetIds(document);
  if(required.some(id=>!assets.some(asset=>asset.id===id&&asset.documentId===document.id)))throw new Error('이미지가 누락되어 완전한 백업을 만들 수 없습니다.');
  let total=0;
  const entries=[];
  for(const id of required){
    const asset=assets.find(item=>item.id===id)!;
    total+=asset.byteSize;if(total>LIMITS.importBytes*0.7)throw new Error('이미지 총 크기가 JSON 백업 제한을 초과합니다.');
    entries.push({id:asset.id,mimeType:asset.mimeType,originalName:asset.originalName,byteSize:asset.byteSize,width:asset.width,height:asset.height,base64:await toBase64(asset.blob)});
  }
  const json=JSON.stringify({format:FORMAT,formatVersion:VERSION,document,assets:entries});
  if(new Blob([json]).size>LIMITS.importBytes)throw new Error('프로젝트 파일이 100MiB를 초과합니다.');
  return json;
}
const record=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
export async function importProject(file:Blob):Promise<{document:ProjectDocument;assets:ImageAsset[]}>{
  if(file.size<=0||file.size>LIMITS.importBytes)throw new Error('프로젝트 파일은 100MiB 이하여야 합니다.');
  let raw:unknown;
  try{raw=JSON.parse(await file.text());}catch{throw new Error('JSON 프로젝트 파일을 읽을 수 없습니다.');}
  if(!record(raw)||raw.format!==FORMAT||raw.formatVersion!==VERSION)throw new Error('지원하지 않는 프로젝트 형식 또는 버전입니다.');
  if(!isProjectDocument(raw.document))throw new Error('프로젝트 문서 데이터가 손상되었거나 지원하지 않는 버전입니다.');
  if(!Array.isArray(raw.assets)||raw.assets.length>LIMITS.blocks)throw new Error('이미지 목록 형식 또는 개수가 올바르지 않습니다.');
  const doc=raw.document;const required=documentAssetIds(doc);
  if(raw.assets.length!==required.length)throw new Error('프로젝트 파일의 이미지 개수와 참조가 일치하지 않습니다.');
  const ids=new Set<string>();let total=0;
  const verified:ImageAsset[]=[];
  for(const item of raw.assets){
    if(!record(item)||typeof item.id!=='string'||!required.includes(item.id)||ids.has(item.id)||
      typeof item.base64!=='string'||item.base64.length>Math.ceil(LIMITS.imageBytes/3)*4+4||
      !['image/png','image/jpeg','image/webp'].includes(String(item.mimeType))||
      typeof item.originalName!=='string'||item.originalName.length>240||
      typeof item.byteSize!=='number'||!Number.isInteger(item.byteSize)||item.byteSize<1||item.byteSize>LIMITS.imageBytes||
      typeof item.width!=='number'||typeof item.height!=='number'||!Number.isInteger(item.width)||!Number.isInteger(item.height))throw new Error('이미지 메타데이터가 잘못되었습니다.');
    ids.add(item.id);total+=item.byteSize;
    if(total>LIMITS.importBytes*0.7)throw new Error('프로젝트 이미지 용량 제한을 초과했습니다.');
    const bytes=fromBase64(item.base64);
    if(bytes.length!==item.byteSize)throw new Error('이미지 데이터와 기록된 용량이 다릅니다.');
    const actual=await validateImage(new Blob([new Uint8Array(bytes)],{type:item.mimeType as string}),item.originalName as string,doc.id,item.id as string);
    if(actual.width!==item.width||actual.height!==item.height||actual.mimeType!==item.mimeType)throw new Error('이미지 메타데이터와 실제 파일이 다릅니다.');
    verified.push(actual);
  }
  if(required.some(id=>!ids.has(id)))throw new Error('문서에서 참조하는 이미지가 없습니다.');
  const cloned=cloneProject(doc,verified);
  // Reconstruct only validated fields; imported IDs must never clash with local IDs.
  return{document:{...cloned.document,name:doc.name},assets:cloned.assets};
}
export function downloadProject(json:string,name:string):void{
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=`${safeFilename(name)}.localdoc.json`;link.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),60_000);
}
