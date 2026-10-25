import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectRules,ruleDiff} from '../src/humanize/rules.ts';
test('M03 offline rules only generate an opt-in concise suggestion',()=>{
  const source='문서를  확인하였습니다. 다음 단계도  진행하였습니다.';
  const result=inspectRules(source);
  assert.equal(result.status,'ready');
  if(result.status!=='ready')return;
  assert.equal(result.proposal.original,source);
  assert.equal(result.proposal.suggested,'문서를 확인했습니다. 다음 단계도 진행했습니다.');
  assert.equal(result.proposal.appliedRules.length,2);
  assert.ok(result.proposal.note.includes('AI 모델을 사용하지'));
});
test('M03 blocks structured text and overly long paragraphs',()=>{
  assert.equal(inspectRules('첫째  항목 | 둘째 항목').status,'blocked');
  assert.equal(inspectRules('  문단  확인하였습니다.').status,'blocked');
  assert.equal(inspectRules('확인하였습니다.'.repeat(900)).status,'blocked');
});
test('M03 leaves sensitive numbers, URL, quote and negation unchanged',()=>{
  const source='2026-10-25 금액 30,000원은 변하지 않았습니다. "꼭 확인하였습니다" 문서를  검토하였습니다. https://example.org/test';
  const result=inspectRules(source);
  assert.equal(result.status,'ready');
  if(result.status!=='ready')return;
  assert.ok(result.proposal.suggested.includes('2026-10-25 금액 30,000원은 변하지 않았습니다.'));
  assert.ok(result.proposal.suggested.includes('"꼭 확인하였습니다"'));
  assert.ok(result.proposal.suggested.includes('https://example.org/test'));
});
test('M03 never emits a suggestion if there is no approved change',()=>{
  assert.equal(inspectRules('이미 정돈된 문장입니다.').status,'unchanged');
  assert.equal(inspectRules('   ').status,'unchanged');
});
test('M03 before/after span is lossless even with multiple changes',()=>{
  const result=inspectRules('문서를  확인하였습니다.');
  assert.equal(result.status,'ready');
  if(result.status!=='ready')return;
  const diff=ruleDiff(result.proposal.original,result.proposal.suggested);
  assert.equal(diff.prefix+diff.removed+diff.suffix,result.proposal.original);
  assert.equal(diff.prefix+diff.added+diff.suffix,result.proposal.suggested);
});
