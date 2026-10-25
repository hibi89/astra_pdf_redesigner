// Deterministic, offline proofreading ONLY; this is not an LLM.
export interface RuleProposal {
  original:string;
  suggested:string;
  appliedRules:string[];
  note:string;
}
export type RuleResult={status:'ready';proposal:RuleProposal}|{status:'unchanged'|'blocked';reason:string};
const anchors=(text:string)=>[
  ...(text.match(/https?:\/\/[^\s]+/g)||[]),
  ...(text.match(/\d+(?:[.,:/%-]\d+)*/g)||[]),
  ...(text.match(/\b[A-Z]{2,}\b/g)||[]),
  ...(text.match(/"[^"\n]*"|'[^'\n]*'/g)||[]),
];
// Explicitly refuse formatted tables/indented blocks. Do not reshape structure.
export function inspectRules(original:string):RuleResult{
  if(!original.trim())return{status:'unchanged',reason:'빈 문단에는 제안을 만들지 않습니다.'};
  if(original.length>5000)return{status:'blocked',reason:'긴 문단은 5,000자 이하로 나누어 검수하세요.'};
  if(/(^|\n)[ \t]{2,}|[|\t]/.test(original))
    return{status:'blocked',reason:'표·들여쓰기 구조가 감지되어 자동 제안을 보류합니다.'};
  let candidate=original;
  const appliedRules:string[]=[];
  const spaced=candidate.replace(/([가-힣]) {2,}(?=[가-힣])/g,'$1 ');
  if(spaced!==candidate){candidate=spaced;appliedRules.push('한글 단어 사이 중복 공백');}
  const concise=candidate.replace(/(확인|진행|수행|검토|완료)하였습니다/g,'$1했습니다');
  if(concise!==candidate){candidate=concise;appliedRules.push('한정된 문체 간결화');}
  if(candidate===original)return{status:'unchanged',reason:'이 문단에서 검증된 규칙의 수정 후보를 찾지 못했습니다.'};
  if(JSON.stringify(anchors(original))!==JSON.stringify(anchors(candidate)))
    return{status:'blocked',reason:'숫자·URL·영문 약어·인용문 변화가 감지되어 제안을 차단했습니다.'};
  return{status:'ready',proposal:{
    original,suggested:candidate,appliedRules,
    note:'규칙 기반 교정 제안입니다. AI 모델을 사용하지 않았으며, 의미·고유명사·뉘앙스는 직접 확인해야 합니다.',
  }};
}
// Diff uses one contiguous changed span; both full versions remain visible.
export function ruleDiff(before:string,after:string):{prefix:string;removed:string;added:string;suffix:string}{
  let start=0;
  while(start<before.length&&start<after.length&&before[start]===after[start])start++;
  let endBefore=before.length,endAfter=after.length;
  while(endBefore>start&&endAfter>start&&before[endBefore-1]===after[endAfter-1]){endBefore--;endAfter--;}
  return{prefix:before.slice(0,start),removed:before.slice(start,endBefore),
    added:after.slice(start,endAfter),suffix:before.slice(endBefore)};
}
