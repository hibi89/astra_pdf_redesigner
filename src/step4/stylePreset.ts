// Local-only STEP4 portable style preset. Never includes PDF bytes or document content.
import {isDesign} from '../step2/model.ts';
import type {DesignSettings} from '../types.ts';

export const STYLE_PRESET_FORMAT='astra-style-preset';
export const STYLE_PRESET_VERSION=1;
const MAX_JSON_BYTES=8192;
const SAFE_NAME=/^[^\u0000-\u001f\u007f-\u009f\p{Default_Ignorable_Code_Point}<>]{1,60}$/u;
type Shape={format:typeof STYLE_PRESET_FORMAT;version:typeof STYLE_PRESET_VERSION;name:string;design:DesignSettings};
const exact=(value:unknown,keys:readonly string[]):value is Record<string,unknown> =>
  !!value&&typeof value==='object'&&!Array.isArray(value)&&
  Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
const deny=():never=>{throw new Error('지원하지 않는 디자인 프리셋이거나 파일이 손상되었습니다.');};
function validated(name:unknown,design:unknown):{name:string;design:DesignSettings}{
  if(typeof name!=='string'||name!==name.trim()||!SAFE_NAME.test(name)||
     !exact(design,['theme','accent','textSize','font'])||!isDesign(design))deny();
  return {name,design:{theme:design.theme,accent:design.accent,textSize:design.textSize,font:design.font}};
}
export function exportStylePreset(name:string,design:DesignSettings):string{
  const safe=validated(name,design);
  const json=JSON.stringify({format:STYLE_PRESET_FORMAT,version:STYLE_PRESET_VERSION,...safe} satisfies Shape);
  if(new TextEncoder().encode(json).length>MAX_JSON_BYTES)deny();
  return json;
}
export function parseStylePreset(source:string):Shape{
  if(typeof source!=='string'||new TextEncoder().encode(source).length>MAX_JSON_BYTES)deny();
  let parsed:unknown;
  try{parsed=JSON.parse(source);}catch{deny();}
  if(!exact(parsed,['format','version','name','design'])||
     parsed.format!==STYLE_PRESET_FORMAT||parsed.version!==STYLE_PRESET_VERSION)deny();
  const {name,design}=validated(parsed.name,parsed.design);
  return {format:STYLE_PRESET_FORMAT,version:STYLE_PRESET_VERSION,name,design};
}
export async function importStylePreset(file:File):Promise<Shape>{
  if(!file||file.size<1||file.size>MAX_JSON_BYTES||!file.name.toLowerCase().endsWith('.json'))deny();
  return parseStylePreset(await file.text());
}
export function downloadStylePreset(name:string,design:DesignSettings):void{
  const json=exportStylePreset(name,design);
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const link=document.createElement('a');
  link.href=url;link.download='astra-style-preset.json';
  document.body.append(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),60_000);
}
