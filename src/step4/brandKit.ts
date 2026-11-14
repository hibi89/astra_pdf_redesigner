// STEP4 BUSINESS branded layout metadata only: never store PDF bytes, images or document content.
import { PALETTE } from '../types.ts';
export interface BusinessBrandKit {
  name: string;
  tagline: string;
  footer: string;
  accent: string;
}
export const BRAND_KIT_FORMAT = 'astra-business-brand-kit';
export const BRAND_KIT_VERSION = 1;
const MAX_BRAND_BYTES = 4096;
const MAX_FIELDS = { name: 60, tagline: 100, footer: 150 } as const;
const fail = (): never => { throw new Error('브랜드 키트 파일 또는 입력이 올바르지 않습니다.'); };
const validText = (value: unknown, max: number, required: boolean): value is string =>
  typeof value === 'string' && value.length <= max &&
  (required ? value.trim().length > 0 : true) &&
  !/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(value);
const exact = (value: unknown, keys: readonly string[]): value is Record<string,unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value) &&
  Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value,key));
export function validateBusinessBrandKit(input: unknown): BusinessBrandKit {
  if(!exact(input,['name','tagline','footer','accent']) ||
    !validText(input.name,MAX_FIELDS.name,true) ||
    !validText(input.tagline,MAX_FIELDS.tagline,false) ||
    !validText(input.footer,MAX_FIELDS.footer,false) ||
    typeof input.accent !== 'string' ||
    !PALETTE.some(color => color.value === input.accent)) return fail();
  return {name:input.name.trim(),tagline:input.tagline.trim(),footer:input.footer.trim(),accent:input.accent};
}
export function exportBusinessBrandKit(input: BusinessBrandKit): string {
  const kit=validateBusinessBrandKit(input);
  const json=JSON.stringify({format:BRAND_KIT_FORMAT,version:BRAND_KIT_VERSION,kit});
  if(new TextEncoder().encode(json).length>MAX_BRAND_BYTES) return fail();
  return json;
}
export function parseBusinessBrandKit(source: string): BusinessBrandKit {
  if(typeof source!=='string' || new TextEncoder().encode(source).length>MAX_BRAND_BYTES) return fail();
  let parsed:unknown;
  try{parsed=JSON.parse(source);}catch{return fail();}
  if(!exact(parsed,['format','version','kit']) ||
     parsed.format!==BRAND_KIT_FORMAT || parsed.version!==BRAND_KIT_VERSION) return fail();
  return validateBusinessBrandKit(parsed.kit);
}
export async function importBusinessBrandKit(file:File):Promise<BusinessBrandKit>{
  if(!file || file.size<1 || file.size>MAX_BRAND_BYTES || !file.name.toLowerCase().endsWith('.json'))return fail();
  return parseBusinessBrandKit(await file.text());
}
export function downloadBusinessBrandKit(input: BusinessBrandKit): void {
  const json=exportBusinessBrandKit(input);
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='astra-business-brand-kit.json';
  document.body.append(a);a.click();a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),60000);
}
