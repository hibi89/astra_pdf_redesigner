'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {BASE,MODEL,createOwnerOllamaController}=require('../desktop/owner-ollama-controller.cjs');
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}});
function fixture(rewrite='문서를 확인했습니다.'){
 const calls=[];
 const request=async(url,options)=>{
  calls.push({url,options});
  if(url===BASE+'/api/tags')return json({models:[{name:MODEL}]});
  if(url===BASE+'/api/generate')return json({done:true,model:MODEL,response:rewrite});
  return json({},404);
 };
 return{calls,request};
}
test('P111 status detects only locally installed exact model and never sends source paragraphs',async()=>{
 const f=fixture(),c=createOwnerOllamaController({request:f.request});
 assert.deepEqual(await c.status(),{status:'available',modelId:MODEL,engine:'owner-installed-ollama'});
 assert.equal(f.calls.length,1);
 assert.equal(f.calls[0].url,'http://127.0.0.1:11434/api/tags');
 assert.equal(f.calls[0].options.method,'GET');
 assert.equal(f.calls[0].options.credentials,'omit');
 assert.equal(f.calls[0].options.redirect,'error');
});
test('P111 no user consent means no inference call or document transfer',async()=>{
 const f=fixture(),c=createOwnerOllamaController({request:f.request});
 assert.equal((await c.propose('문서를 확인하였습니다.')).reason,'local-model-consent-required');
 assert.equal(f.calls.length,0);
});
test('P111 trusted fixed loopback POST, exact model and non-streaming output, no external endpoint',async()=>{
 const f=fixture(),c=createOwnerOllamaController({request:f.request});
 const result=await c.propose('문서를 확인하였습니다.',{explicitConsent:true});
 assert.deepEqual(result,{status:'proposal',suggested:'문서를 확인했습니다.',engine:'owner-installed-local-ollama',externalTransfer:false});
 assert.equal(f.calls.length,1);
 assert.equal(f.calls[0].url,BASE+'/api/generate');
 assert.equal(f.calls[0].options.method,'POST');
 assert.equal(f.calls[0].options.redirect,'error');
 assert.equal(f.calls[0].options.credentials,'omit');
 const body=JSON.parse(f.calls[0].options.body);
 assert.equal(body.model,'qwen3:4b-instruct');
 assert.equal(body.stream,false);assert.equal(body.think,false);
 assert.equal(body.options.temperature,0);
 assert.equal(body.prompt.includes('문서를 확인하였습니다.'),true);
 assert.equal(JSON.stringify(body).includes('https://'),false);
});
test('P111 rejects hallucinated numbers, missing negation and thinking trace',async()=>{
 for(const text of ['문서 금액 30,000원입니다.','문서는 승인하지 않습니다.','문서를 확인하였습니다.']){
  const rewritten=text.includes('금액')?'문서 금액 33,000원입니다.':text.includes('승인')?'문서는 승인합니다.':'<think>private reasoning</think>문서를 확인했습니다.';
  const f=fixture(rewritten),c=createOwnerOllamaController({request:f.request});
  assert.equal((await c.propose(text,{explicitConsent:true})).reason,'unverified-output');
 }
});
test('P111 rejects absent model, remote redirect, malformed JSON and oversized output',async()=>{
 const bad=[
  async()=>json({models:[{name:'qwen3:wrong'}]}),
  async()=>new Response('',{status:302,headers:{location:'https://example.com'}}),
  async()=>new Response('not-json'),
  async()=>new Response('x'.repeat(20000)),
 ];
 for(const request of bad){
  const c=createOwnerOllamaController({request});
  assert.equal((await c.status()).status,'unavailable');
 }
});
test('P111 one inference at a time and cancellation aborts stale response',async()=>{
 let start,finish;
 const request=(url,opts)=>new Promise((resolve,reject)=>{
  start=()=>resolve(json({done:true,model:MODEL,response:'문서를 확인했습니다.'}));
  finish=()=>reject(new Error('cancelled'));
  opts.signal.addEventListener('abort',finish,{once:true});
 });
 const c=createOwnerOllamaController({request,timeoutMs:1000});
 const first=c.propose('문서를 확인하였습니다.',{explicitConsent:true});
 assert.equal((await c.propose('문서 123',{explicitConsent:true})).status,'busy');
 assert.equal((await c.cancel()).status,'cancel-requested');
 assert.equal((await first).status,'error');
 assert.equal((await c.cancel()).status,'idle');
 void start;
});
test('P111 invalid input and invalid response do not report user approved rewrite',async()=>{
 const c=createOwnerOllamaController({request:async()=>json({done:false,model:MODEL,response:'문서를 확인했습니다.'})});
 assert.equal((await c.propose('',{explicitConsent:true})).reason,'invalid-input');
 assert.equal((await c.propose('x'.repeat(2401),{explicitConsent:true})).reason,'invalid-input');
 assert.equal((await c.propose('문서를 확인하였습니다.',{explicitConsent:true})).reason,'local-model-output-invalid');
});
test('P111 renderer UI explicitly asks consent, displays before/after and retains reject/undo',()=>{
 const fs=require('node:fs'),path=require('node:path');
 const panel=fs.readFileSync(path.join(__dirname,'../src/humanize/LocalModelReview.tsx'),'utf8');
 const main=fs.readFileSync(path.join(__dirname,'../desktop/main.cjs'),'utf8');
 const preload=fs.readFileSync(path.join(__dirname,'../desktop/preload.cjs'),'utf8');
 for(const term of ['data-local-ai-consent','data-local-ai-before','data-local-ai-after','data-local-ai-reject','data-local-ai-accept','data-local-ai-undo','fn(before,true)'])assert.ok(panel.includes(term),term);
 assert.ok(main.includes("require('./owner-ollama-controller.cjs')"));
 assert.ok(main.includes("if(explicitConsent!==true)return{status:'error',reason:'local-model-consent-required'};"));
 assert.ok(preload.includes("ipcRenderer.invoke('astra:local-model-propose',text,explicitConsent)"));
});

test('P122 Electron IPC keeps the trusted sender and consent argument order',()=>{
 const fs=require('node:fs'),path=require('node:path');
 const main=fs.readFileSync(path.join(__dirname,'../desktop/main.cjs'),'utf8');
 const preload=fs.readFileSync(path.join(__dirname,'../desktop/preload.cjs'),'utf8');
 const controller=fs.readFileSync(path.join(__dirname,'../desktop/owner-ollama-controller.cjs'),'utf8');
 const start=main.indexOf("ipcMain.handle('astra:local-model-propose'");
 const end=main.indexOf("ipcMain.handle('astra:local-model-cancel'",start);
 assert.ok(start>=0&&end>start,'proposal IPC handler is present');
 const handler=main.slice(start,end);
 assert.match(handler,/async\\(event,text,explicitConsent\\)/);
 assert.ok(handler.indexOf('if(!trusted(event))')<handler.indexOf('if(explicitConsent!==true)'));
 assert.ok(handler.includes("ownerOllama.propose(text,{explicitConsent:true})"));
 assert.ok(preload.includes("localModelPropose:(text,explicitConsent)=>ipcRenderer.invoke('astra:local-model-propose',text,explicitConsent)"));
 assert.ok(controller.includes("const BASE='http://127.0.0.1:11434'"));
 assert.ok(controller.includes("const MODEL='qwen3:4b-instruct'"));
 assert.ok(controller.includes("redirect:'error'"));
 assert.ok(!handler.includes('url')&&!handler.includes('modelId'));
});
