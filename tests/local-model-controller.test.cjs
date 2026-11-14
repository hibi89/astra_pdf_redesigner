'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync,existsSync}=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {EventEmitter}=require('node:events');
const {PassThrough}=require('node:stream');
const {createLocalModelController,validateSuggestion,RELEASE_MANIFEST}=require('../desktop/local-model-controller.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function fixture(){
  const root=mkdtempSync(path.join(os.tmpdir(),'astra-llm-fixture-'));
  const binary=Buffer.from('not real executable -- offline test stub');
  const model=Buffer.from('GGUF test fixture NOT MODEL WEIGHTS');
  for(const d of ['bin','models'])mkdirSync(path.join(root,'astra-local-model',d),{recursive:true});
  writeFileSync(path.join(root,'astra-local-model','bin','llama-cli.exe'),binary);
  writeFileSync(path.join(root,'astra-local-model','models','tiny.gguf'),model);
  return{root,manifest:{id:'ci-test-not-real',runtime:{name:'llama-cli.exe',sha256:hash(binary),maxBytes:1024},
    model:{name:'tiny.gguf',sha256:hash(model),maxBytes:1024}},cleanup:()=>rmSync(root,{force:true,recursive:true})};
}
test('M03-B is disabled by default: no external weights, downloads or spawn',async()=>{
  assert.equal(RELEASE_MANIFEST,null);
  let launches=0;
  const c=createLocalModelController({resourcesDir:'/not-installed',spawnProcess:()=>{launches++;throw Error('unexpected execution');}});
  assert.equal((await c.status()).status,'unavailable');
  assert.equal((await c.propose('synthetic paragraph')).status,'unavailable');
  assert.equal(launches,0);
  const first=c.propose('synthetic paragraph');
  const second=await c.propose('synthetic second paragraph');
  assert.equal(second.status,'busy','Concurrent request must fail closed while checking availability');
  assert.equal((await first).status,'unavailable');
});
test('M03-B requires exact SHA256 manifest and bundled resources',async()=>{
  const f=fixture();
  try{
    const c=createLocalModelController({resourcesDir:f.root,manifest:{...f.manifest,model:{...f.manifest.model,sha256:'f'.repeat(64)}}});
    assert.equal((await c.status()).status,'unavailable');
    assert.equal((await c.propose('synthetic paragraph')).status,'unavailable');
    assert.equal((await createLocalModelController({resourcesDir:f.root,manifest:f.manifest}).status()).status,'available');
    assert.equal((await createLocalModelController({resourcesDir:f.root,manifest:{...f.manifest,model:{...f.manifest.model,name:'../secrets'}}}).status()).status,'unavailable');
  }finally{f.cleanup();}
});
test('M03-B fixed CLI has no input in argv; uses temporary 0600 prompt and no shell',async()=>{
  const f=fixture();
  let argv,options,content,prompt;
  function fakeSpawn(_bin,args,opts){
    argv=args;options=opts;
    const index=args.indexOf('--file');
    prompt=args[index+1];content=readFileSync(prompt,'utf8');
    const child=new EventEmitter();
    child.stdout=new PassThrough();child.stderr=new PassThrough();child.killed=false;
    child.kill=()=>{child.killed=true;child.emit('close',1);};
    process.nextTick(()=>{
      child.stdout.write('문서를 확인했습니다.');
      child.stdout.end();child.emit('close',0);
    });
    return child;
  }
  try{
    const c=createLocalModelController({resourcesDir:f.root,manifest:f.manifest,spawnProcess:fakeSpawn});
    const response=await c.propose('문서를  확인하였습니다.');
    assert.equal(response.status,'proposal');
    assert.equal(response.suggested,'문서를 확인했습니다.');
    assert.equal(options.shell,false);
    assert.ok(argv.includes('--no-display-prompt'));
    assert.ok(!argv.join(' ').includes('문서를'));
    assert.ok(content.includes('문서를  확인하였습니다.'));
    assert.equal(existsSync(prompt),false,'Transient prompt file must be deleted on completion');
  }finally{f.cleanup();}
});
test('M03-B validation blocks numbers, quoted spans, URLs and empty output',()=>{
  assert.equal(validateSuggestion('결제 금액 30,000원입니다.','결제 금액 31,000원입니다.'),false);
  assert.equal(validateSuggestion('문서 "원문" 검토하였습니다.','문서 "수정" 검토했습니다.'),false);
  assert.equal(validateSuggestion('참고 https://example.com','참고 https://other.com'),false);
  assert.equal(validateSuggestion('문서를 확인하였습니다.',''),false);
});


test('P90 local model guard: 20 synthetic Korean golden suggestions preserve protected literals and negation',()=>{
 const cases=[
  ['문서를  확인하였습니다.','문서를 확인했습니다.',true],
  ['계약서 원본을  확인하였습니다.','계약서 원본을 확인했습니다.',true],
  ['금액은 30,000원으로  확정하였습니다.','금액은 30,000원으로 확정했습니다.',true],
  ['결제 -100원으로 했습니다.','결제 +100원으로 했습니다.',false],
  ['입금 +100원 입니다.','입금 100원 입니다.',false],
  ['숫자 2026년 11월 14일','숫자 2026년 11월 15일',false],
  ['이행하지 않습니다.','이행합니다.',false],
  ['제안이 없습니다.','제안이 있습니다.',false],
  ['결제를 안 합니다.','결제를 합니다.',false],
  ['협조는 불가합니다.','협조는 가능합니다.',false],
  ['등록이 금지됩니다.','등록이 허용됩니다.',false],
  ['문서는 미승인 상태입니다.','문서는 승인 상태입니다.',false],
  ['계약은 취소되었습니다.','계약은 유지되었습니다.',false],
  ['본문에서 해당 항목을 제외하였습니다.','본문에서 해당 항목을 포함하였습니다.',false],
  ['“원문”으로 작성한 문장입니다.','“수정”으로 작성한 문장입니다.',false],
  ['‘원문’과 결론을 유지합니다.','‘수정’과 결론을 유지합니다.',false],
  ['참고 https://example.com','참고 https://other.com',false],
  ['비율은 25% 입니다.','비율은 30% 입니다.',false],
  ['총 $100 입금하였습니다.','총 $200 입금했습니다.',false],
  ['이름 홍길동께서 검토하였습니다.','이름 홍길동께서 검토했습니다.',true],
 ];
 assert.equal(cases.length,20);
 for(const [before,after,expected] of cases){
   assert.equal(validateSuggestion(before,after),expected,JSON.stringify({before,after}));
 }
});
test('P90 local rewrite guard rejects numeric polarity and Korean negation without model weight',()=>{
 assert.equal(validateSuggestion('잔고 -1200원입니다.','잔고 1200원입니다.'),false);
 assert.equal(validateSuggestion('결제를 승인하지 않습니다.','결제를 승인합니다.'),false);
 assert.equal(validateSuggestion('구매는 불가합니다.','구매는 가능합니다.'),false);
 assert.equal(RELEASE_MANIFEST,null,'No real GGUF activation or download');
});

test('P122: 30 synthetic Korean golden paragraphs preserve names, tables, numbers, dates, negation and URLs',()=>{
 const cases=[
  ['이름: 홍길동님이 문서를 확인하였습니다.','이름: 홍길동님이 문서를 확인했습니다.',true],
  ['박서연님께서 견적서를 검토하였습니다.','박서연님께서 견적서를 살펴보았습니다.',true],
  ['회사명: Astra Labs가 계약서를 검토하였습니다.','회사명: Astra Labs가 계약서를 확인했습니다.',true],
  ['일정은 2026년 11월 15일입니다. 상세를 확인하였습니다.','일정은 2026년 11월 15일입니다. 상세를 검토했습니다.',true],
  ['청구액은 ₩50,000원으로 확정하였습니다.','청구액은 ₩50,000원으로 정했습니다.',true],
  ['결제 수량은 12개로 확인되었습니다.','결제 수량은 12개로 확인했습니다.',true],
  ['문서를 읽었습니다. 환불하지 않습니다.','문서를 검토했습니다. 환불하지 않습니다.',true],
  ['참고: https://example.com/terms 문서를 확인하였습니다.','참고: https://example.com/terms 내용을 확인했습니다.',true],
  ['요약을 작성하였습니다.\n| 항목 | 금액 |\n| 수수료 | 30,000원 |\n마지막 문장을 확인했습니다.','간략히 정리했습니다.\n| 항목 | 금액 |\n| 수수료 | 30,000원 |\n끝 문장을 검토했습니다.',true],
  ['인용문 “원본을 그대로 보존”을 확인하였습니다.','인용문 “원본을 그대로 보존”을 검토했습니다.',true],
  ['OpenAI 대표님께서 일정을 확인하였습니다.','OpenAI 대표님께서 일정을 검토했습니다.',true],
  ['비율은 25%로 확인하였습니다.','비율은 25%로 확인했습니다.',true],
  ['담당자: 김민수님이 초안을 확인하였습니다.','담당자: 김민수님이 초안을 검토했습니다.',true],
  ['Acme Corp 문서를 확인하였습니다.','Acme Corp 자료를 검토했습니다.',true],
  ['| 날짜 | 금액 |\\n| 2026-11-15 | 120,000원 |\\n표를 확인하였습니다.','| 날짜 | 금액 |\\n| 2026-11-15 | 120,000원 |\\n표를 검토했습니다.',true],
  ['이름: 홍길동님이 확인하였습니다.','이름: 김철수님이 확인했습니다.',false],
  ['회사명: Astra Labs를 확인하였습니다.','회사명: Nova Labs를 확인했습니다.',false],
  ['예정일은 2026년 11월 15일입니다.','예정일은 2026년 11월 16일입니다.',false],
  ['청구액은 50,000원입니다.','청구액은 55,000원입니다.',false],
  ['문서 수량은 12개입니다.','문서 수량은 21개입니다.',false],
  ['환불하지 않습니다.','환불합니다.',false],
  ['A는 승인하지 않고 B는 동의했습니다.','A는 승인했고 B는 동의하지 않았습니다.',false],
  ['참고: https://example.com/terms','참고: https://example.com/refund',false],
  ['| 수수료 | 30,000원 |','| 수수료 | 80,000원 |',false],
  ['| 1행 | A |\\n| 2행 | B |','| 2행 | B |\\n| 1행 | A |',false],
  ['인용문 “원본을 그대로 보존”을 확인합니다.','인용문 “원본을 수정”을 확인합니다.',false],
  ['홍길동님이 문서를 확인했습니다.','김철수님이 문서를 확인했습니다.',false],
  ['등록은 금지됩니다.','등록은 허용됩니다.',false],
  ['비율은 25% 입니다.','비율은 35% 입니다.',false],
  ['시작일 2026-11-15, 종료일 2026-12-01입니다.','시작일 2026-11-16, 종료일 2026-12-01입니다.',false],
 ];
 assert.equal(cases.length,30);
 for(const [before,after,expected] of cases)
  assert.equal(validateSuggestion(before,after),expected,JSON.stringify({before,after}));
});
