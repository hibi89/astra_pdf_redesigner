import {useEffect,useRef,useState} from 'react';
import {ruleDiff} from './rules.ts';
type Props={text:string;disabled:boolean;onApply:(text:string)=>void};
type Proposal={before:string;after:string};
export default function LocalModelReview({text,disabled,onApply}:Props){
 const [ready,setReady]=useState(false);
 const [consent,setConsent]=useState(false);
 const [checking,setChecking]=useState(false);
 const [busy,setBusy]=useState(false);
 const [proposal,setProposal]=useState<Proposal|null>(null);
 const [undo,setUndo]=useState<Proposal|null>(null);
 const [message,setMessage]=useState('설치된 로컬 Ollama 모델은 필요할 때만 확인합니다.');
 const generation=useRef(0);
 const busyRef=useRef(false);
 useEffect(()=>()=>{generation.current++;if(busyRef.current)void window.astraDesktop?.localModelCancel?.();},[]);
 const probe=async()=>{
  const fn=window.astraDesktop?.localModelStatus;
  if(!fn){setMessage('로컬 AI는 설치형 Electron에서만 사용할 수 있습니다.');return;}
  setChecking(true);
  try{
   const result=await fn();
   setReady(result.status==='available');
   setMessage(result.status==='available'?'이 PC의 로컬 모델을 찾았습니다. 원하는 문단에만 수동 실행하세요.':
    '설치된 로컬 Qwen3 모델을 찾지 못했습니다. 기존 규칙 검수는 계속 사용할 수 있습니다.');
  }catch{setReady(false);setMessage('로컬 모델 상태 확인 실패. 외부 모델로 자동 전환하지 않습니다.');}
  finally{setChecking(false);}
 };
 const run=async()=>{
  const fn=window.astraDesktop?.localModelPropose;
  if(!fn||!consent||!ready||disabled||busy||!text.trim()||text.length>2400)return;
  const current=++generation.current;
  busyRef.current=true;setBusy(true);setProposal(null);
  const before=text;
  try{
   const response=await fn(before,true);
   if(current!==generation.current)return;
   if(response.status==='proposal'&&response.externalTransfer===false&&typeof response.suggested==='string'){
    setProposal({before,after:response.suggested});
    setMessage('로컬 모델 제안 초안입니다. 원문과 뜻·고유명사·수치를 직접 확인한 뒤 적용하세요.');
   }else{
    setMessage('윤문 제안이 거부되었거나 모델이 준비되지 않았습니다. 원문은 변경되지 않았습니다.');
   }
  }catch{if(current===generation.current)setMessage('로컬 추론 실패. 원문은 유지됩니다.');}
  finally{if(current===generation.current){busyRef.current=false;setBusy(false);}}
 };
 const cancel=()=>{generation.current++;setBusy(false);busyRef.current=false;
  void window.astraDesktop?.localModelCancel?.();setMessage('로컬 추론을 중단했습니다. 원문은 유지됩니다.');};
 const fresh=!!proposal&&proposal.before===text;
 const canUndo=!!undo&&undo.after===text;
 const accept=()=>{
  if(!fresh||!proposal||disabled)return;
  const chosen=proposal;
  onApply(chosen.after);setUndo(chosen);setProposal(null);setMessage('승인한 문단만 바꿨습니다. 직전 변경은 되돌릴 수 있습니다.');
 };
 const revert=()=>{
  if(!canUndo||disabled||!undo)return;
  onApply(undo.before);setUndo(null);setMessage('로컬 AI 윤문 적용 전 원문으로 복원했습니다.');
 };
 const diff=fresh&&proposal?ruleDiff(proposal.before,proposal.after):null;
 return <section className="m03-rule-review no-print" data-local-ai-review aria-label="한국어 로컬 AI 윤문">
  <div className="m03-rule-toolbar">
   <button type="button" className="secondary-button" data-local-ai-probe disabled={checking||busy}
    onClick={()=>void probe()}>설치된 로컬 모델 확인</button>
   {ready&&<label className="field"><span><input type="checkbox" data-local-ai-consent checked={consent} disabled={busy}
    onChange={event=>setConsent(event.target.checked)}/> 선택한 문단을 내 PC의 127.0.0.1 Ollama 프로세스에서 분석하는 데 동의합니다.</span></label>}
   <button type="button" className="secondary-button" data-local-ai-run
    disabled={!ready||!consent||disabled||busy||!text.trim()||text.length>2400} onClick={()=>void run()}>
    {busy?'로컬 추론 중…':'로컬 AI 윤문 초안 만들기'}</button>
   {busy&&<button type="button" data-local-ai-cancel className="text-button" onClick={cancel}>취소</button>}
   {canUndo&&<button type="button" data-local-ai-undo className="text-button" disabled={disabled} onClick={revert}>AI 적용 되돌리기</button>}
  </div>
  <p className="help-text" role="status" data-local-ai-status>{message}</p>
  {proposal&&!fresh&&<p role="alert" className="warning">원문이 변경되어 이전 제안은 무효입니다. 다시 분석하세요.</p>}
  {fresh&&proposal&&diff&&<div className="m03-proposal" data-local-ai-proposal>
   <p><strong>로컬 AI 제안 · 자동 반영 없음 · 의미보존 미보증</strong></p>
   <div className="m03-rule-diff" aria-label="로컬 AI 윤문 전후 비교">
    <p className="m03-diff-label">원문</p>
    <p data-local-ai-before>{diff.prefix}<del>{diff.removed}</del>{diff.suffix}</p>
    <p className="m03-diff-label">제안</p>
    <p data-local-ai-after>{diff.prefix}<ins>{diff.added}</ins>{diff.suffix}</p>
   </div>
   <div className="toolbar"><button className="secondary-button" data-local-ai-reject type="button"
    onClick={()=>{setProposal(null);setMessage('제안을 폐기했습니다. 원문은 그대로입니다.');}}>거부</button>
    <button className="print-button" data-local-ai-accept type="button" disabled={disabled} onClick={accept}>검토 후 이 문단만 적용</button></div>
  </div>}
 </section>;
}
