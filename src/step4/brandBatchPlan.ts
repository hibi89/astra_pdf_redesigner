// P112: apply BUSINESS text branding to multiple local documents without modifying V2.
import {validateBusinessBrandKit,type BusinessBrandKit} from './brandKit.ts';
import {skuLayoutCandidate} from './skuLayoutCandidates.ts';
export interface PlannedBrand{layoutId:string;kit:BusinessBrandKit}
export const MAX_BRAND_BATCH_DOCS=20;
export function makeBrandBatchPlan(
 knownIds:readonly string[],selectedIds:readonly string[],layoutId:string,kit:BusinessBrandKit,
):Record<string,PlannedBrand>{
 if(skuLayoutCandidate(layoutId)?.tier!=='business')throw Error('BUSINESS 레이아웃만 일괄 적용할 수 있습니다.');
 if(selectedIds.length<2||selectedIds.length>MAX_BRAND_BATCH_DOCS||
    new Set(selectedIds).size!==selectedIds.length||
    selectedIds.some(id=>!knownIds.includes(id)||!/^[A-Za-z0-9_-]{8,100}$/.test(id)))
  throw Error('일괄 적용 문서 2~20개를 중복 없이 선택하세요.');
 const brand=validateBusinessBrandKit(kit);
 return Object.fromEntries(selectedIds.map(id=>[id,{
  layoutId,kit:{...brand},
 }]));
}
