import {useState} from 'react';
import {checkProductionSkuCapability,productionSkuAccessConfigured,type SkuCapability} from './skuAccess.ts';
import {ASTRA_CUSTOMER_BUILD_ENABLED} from './skuActionGate.ts';
type Props={receipt:string;onChange:(text:string)=>void};
const capabilities:ReadonlyArray<[SkuCapability,string]>=[
 ['base-layout','BASIC 레이아웃'],['pro-layout','PRO 레이아웃'],
 ['business-layout','BUSINESS 레이아웃'],['template-save','PRO 보관함'],
 ['batch-pdf','다중 PDF'],['brand-kit','BUSINESS 브랜드 키트'],
];
export default function CommercialLicensePanel({receipt,onChange}:Props){
 const [cap,setCap]=useState<SkuCapability>('base-layout');
 const [result,setResult]=useState('');
 const [busy,setBusy]=useState(false);
 const verify=async()=>{
  setBusy(true);setResult('');
  try{
   const decision=await checkProductionSkuCapability(receipt,cap);
   setResult(decision.allowed?'서명과 기능 사용권 확인됨':'사용권 거부 · '+decision.reason);
  }catch{setResult('서명 영수증을 확인할 수 없습니다.');}
  finally{setBusy(false);}
 };
 return <section className="panel no-print" data-commercial-license-panel aria-label="오프라인 상용 라이선스 확인">
  <div className="panel-heading"><h2>오프라인 상용 라이선스 확인</h2></div>
  <p className="help-text" data-commercial-release-state>
   {ASTRA_CUSTOMER_BUILD_ENABLED?'고객용 실행 경로는 매번 서명을 검사합니다.':'내부 개발 시험판 · 상용 기능 활성화와 무관합니다.'}
   {!productionSkuAccessConfigured()&&' 현재 정식 판매자 공개키가 없어 모든 상용 사용권은 거부됩니다.'}
  </p>
  <label className="field">서명 영수증 JSON (메모리 전용 · 저장·전송하지 않음)
   <textarea rows={3} maxLength={2048} value={receipt} data-commercial-license-input
    onChange={e=>{onChange(e.target.value);setResult('');}}/>
  </label>
  <label className="field">확인할 기능
   <select data-commercial-capability value={cap} onChange={e=>{setCap(e.target.value as SkuCapability);setResult('');}}>
    {capabilities.map(([value,label])=><option key={value} value={value}>{label}</option>)}
   </select>
  </label>
  <button type="button" className="secondary-button" data-commercial-check disabled={busy}
   onClick={()=>void verify()}>서명과 사용권 확인</button>
  {result&&<p role="status" data-commercial-check-result>{result}</p>}
 </section>;
}
