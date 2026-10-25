'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync,readdirSync}=require('node:fs');
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
    assert.ok(!readdirSync(path.dirname(prompt)).includes(path.basename(prompt)));
  }finally{f.cleanup();}
});
test('M03-B validation blocks numbers, quoted spans, URLs and empty output',()=>{
  assert.equal(validateSuggestion('결제 금액 30,000원입니다.','결제 금액 31,000원입니다.'),false);
  assert.equal(validateSuggestion('문서 "원문" 검토하였습니다.','문서 "수정" 검토했습니다.'),false);
  assert.equal(validateSuggestion('참고 https://example.com','참고 https://other.com'),false);
  assert.equal(validateSuggestion('문서를 확인하였습니다.',''),false);
});
