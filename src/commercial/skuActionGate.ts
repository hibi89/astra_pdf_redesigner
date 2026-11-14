// P109: commercial action boundary. Internal preview is not a sellable build.
import {checkProductionSkuCapability,type SkuCapability} from './skuAccess.ts';
import {skuLayoutCandidate} from '../step4/skuLayoutCandidates.ts';
// Hard-coded, source-reviewed only. Never activate via receipt, localStorage, URL or IPC.
export const ASTRA_CUSTOMER_BUILD_ENABLED:boolean=false;
const VALID=new Set<SkuCapability>(['base-layout','pro-layout','business-layout','template-save','batch-pdf','brand-kit']);
export class SkuAccessDeniedError extends Error{
 constructor(){super('상용 기능 사용권이 확인되지 않았습니다. 서명·만료·발급자를 확인하세요.');this.name='SkuAccessDeniedError';}
}
function validCaps(caps:readonly SkuCapability[]){
 if(!caps.length||caps.length>VALID.size||new Set(caps).size!==caps.length||caps.some(c=>!VALID.has(c)))throw new SkuAccessDeniedError();
}
export function layoutSkuCapability(id:string):SkuCapability{
 const layout=skuLayoutCandidate(id);
 if(!layout)throw new SkuAccessDeniedError();
 return layout.tier==='business'?'business-layout':'pro-layout';
}
export function pdfExportCapabilities(id:string|undefined|null,brand:boolean):readonly SkuCapability[]{
 if(!id){
  if(brand)throw new SkuAccessDeniedError();
  return ['base-layout'];
 }
 const cap=layoutSkuCapability(id);
 if(brand&&cap!=='business-layout')throw new SkuAccessDeniedError();
 return brand?[cap,'brand-kit']:[cap];
}
export async function runCustomerLicensedAction<T>(caps:readonly SkuCapability[],receipt:string,action:()=>T|Promise<T>):Promise<T>{
 validCaps(caps);
 for(const cap of caps){
  if(!(await checkProductionSkuCapability(receipt,cap)).allowed)throw new SkuAccessDeniedError();
 }
 return action();
}
export async function runSkuGatedAction<T>(caps:readonly SkuCapability[],receipt:string,action:()=>T|Promise<T>):Promise<T>{
 validCaps(caps);
 if(ASTRA_CUSTOMER_BUILD_ENABLED)return runCustomerLicensedAction(caps,receipt,action);
 return action();
}
