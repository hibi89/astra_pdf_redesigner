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
