import {useState} from 'react';
import {inspectRules,ruleDiff,type RuleProposal} from './rules.ts';
interface Props {text:string;disabled:boolean;onApply:(text:string)=>void}
export default function RuleReview({text,disabled,onApply}:Props){
  const [proposal,setProposal]=useState<RuleProposal|null>(null);
  const [undo,setUndo]=useState<{before:string;after:string}|null>(null);
  const [message,setMessage]=useState('');
  const fresh=proposal!==null&&text===proposal.original;
  const canUndo=undo!==null&&text===undo.after;
  const check=()=>{
    const result=inspectRules(text);
    setProposal(result.status==='ready'?result.proposal:null);
    setMessage(result.status==='ready'?'검토 후에만 적용됩니다.':result.reason);
  };
  const accept=()=>{
    if(!fresh||disabled||!proposal)return;
    onApply(proposal.suggested);
    setUndo({before:proposal.original,after:proposal.suggested});
    setProposal(null);
    setMessage('승인한 변경만 문서에 적용했습니다. 바로 아래에서 되돌릴 수 있습니다.');
  };
  const reject=()=>{setProposal(null);setMessage('제안을 거부했습니다. 원문은 그대로 유지됩니다.');};
  const revert=()=>{
    if(!canUndo||disabled||!undo)return;
    onApply(undo.before);setUndo(null);setMessage('직전 규칙 제안을 원래 문장으로 되돌렸습니다.');
  };
  const diff=fresh&&proposal?ruleDiff(proposal.original,proposal.suggested):null;
  return <div className="m03-rule-review no-print" data-m03-review>
    <div className="m03-rule-toolbar">
      <button type="button" className="secondary-button" data-m03-check disabled={disabled||!text.trim()} onClick={check}>규칙 제안 검토</button>
      {undo&&<button type="button" className="text-button" data-m03-undo disabled={disabled||!canUndo} onClick={revert}>직전 적용 되돌리기</button>}
    </div>
    {message&&<p className="help-text" role="status">{message}</p>}
    {proposal&& !fresh&&<p className="warning" role="alert">원문이 바뀌어 이전 제안은 무효입니다. 새로 검토하세요.</p>}
    {fresh&&proposal&&diff&&<div className="m03-proposal" data-m03-proposal>
      <p><strong>규칙 검수 · AI 모델 아님</strong></p>
      <p className="m03-proposal-note">{proposal.note}</p>
      <div className="m03-rule-diff" aria-label="문장 변경 부분 비교">
        <p className="m03-diff-label">기존</p>
        <p data-m03-before>{diff.prefix}<del>{diff.removed}</del>{diff.suffix}</p>
        <p className="m03-diff-label">제안</p>
        <p data-m03-after>{diff.prefix}<ins>{diff.added}</ins>{diff.suffix}</p>
      </div>
      <p className="help-text">적용 규칙: {proposal.appliedRules.join(' · ')}</p>
      <div className="toolbar">
        <button type="button" className="secondary-button" data-m03-reject disabled={disabled} onClick={reject}>거부 · 원문 유지</button>
        <button type="button" className="print-button" data-m03-accept disabled={disabled} onClick={accept}>비교 확인 후 적용</button>
      </div>
    </div>}
  </div>;
}
