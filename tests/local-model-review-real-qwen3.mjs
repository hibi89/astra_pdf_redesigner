// P123 real Qwen3-4B CPU inference through the production Ollama controller and review UI.
// Synthetic inputs only. This test never logs or persists source paragraphs or model outputs.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {cpus,tmpdir,totalmem} from 'node:os';
import {createServer} from 'node:http';
import {launchBrowser} from './browser-process.mjs';

const require=createRequire(import.meta.url);
const {BASE,MODEL,createOwnerOllamaController}=require('../desktop/owner-ollama-controller.cjs');
const reportPath=process.env.P123_REPORT_OUT||join(tmpdir(),'p123-qwen3-report.json');
const bridgeOrigin='http://127.0.0.1:4174';
const pageUrl=process.env.LOCAL_MODEL_REVIEW_URL||'http://127.0.0.1:4173/tests/fixtures/local-model-review-real-qwen3.html';
const browserBinary=process.env.CHROME_PATH||'chromium';
const ollamaPid=Number(process.env.P123_OLLAMA_PID||0);
const ticksPerSecond=Number(execFileSync('getconf',['CLK_TCK'],{encoding:'utf8'}).trim());
const cases=[
 {id:'neutral-01',text:'이 보고서는 여러 자료를 살펴보고 내용을 정리한 다음 그 내용을 다시 검토하는 과정을 통해 작성되었습니다.'},
 {id:'neutral-02',text:'회의에서 나온 의견을 모으고 중요한 부분을 다시 확인한 뒤 결과를 전달하는 방식으로 진행했습니다.'},
 {id:'neutral-03',text:'자료를 확인하는 일을 먼저 진행하고 필요한 내용을 정리하는 작업을 추가로 수행했습니다.'},
 {id:'neutral-04',text:'담당자는 문서를 살펴본 이후 관련 내용을 정리하고 마지막으로 빠진 부분이 있는지 확인했습니다.'},
 {id:'neutral-05',text:'이 안내는 이용 방법에 대한 설명을 포함하고 있으며 각 항목을 순서대로 확인할 수 있도록 구성되어 있습니다.'},
 {id:'neutral-06',text:'새로운 내용을 추가할 때에는 기존 문서의 흐름을 고려하고 문장 사이의 연결을 함께 살펴보는 것이 좋습니다.'},
 {id:'neutral-07',text:'팀은 수집한 정보를 검토한 후 필요한 항목을 나누어 정리하고 공유할 자료를 준비했습니다.'},
 {id:'neutral-08',text:'요청을 받은 뒤 먼저 현재 상태를 확인했고 이후 필요한 사항을 정리하는 절차를 진행했습니다.'},
 {id:'neutral-09',text:'이 문서는 여러 단계에서 확인된 내용을 모아 하나의 흐름으로 읽을 수 있도록 작성한 자료입니다.'},
 {id:'neutral-10',text:'설명에 포함된 내용을 다시 읽어 보면서 이해하기 쉬운 표현으로 정리하는 작업을 진행했습니다.'},
 {id:'neutral-11',text:'검토 과정에서 확인한 항목을 기록하고 나중에 같은 내용을 다시 찾기 쉽도록 문서를 정리했습니다.'},
 {id:'neutral-12',text:'초안을 작성한 다음에는 문장의 순서를 살펴보고 서로 비슷한 설명이 반복되는 부분을 확인했습니다.'},
 {id:'neutral-13',text:'필요한 자료를 먼저 모은 후 주요 내용을 구분하고 읽는 사람이 확인하기 편한 형태로 구성했습니다.'},
 {id:'neutral-14',text:'이번 안내에서는 작업의 목적을 설명하고 이어서 진행 방법을 차례대로 소개하고 있습니다.'},
 {id:'neutral-15',text:'문서에 있는 여러 설명을 확인하고 서로 관련된 내용을 가까운 위치에 배치하도록 정리했습니다.'},
 {id:'neutral-16',text:'사용자가 확인할 내용을 먼저 제시하고 그 다음에 필요한 추가 설명을 이어서 작성했습니다.'},
 {id:'neutral-17',text:'회의 내용을 정리하면서 중요한 의견을 기록하고 나중에 확인할 수 있도록 자료를 보관했습니다.'},
 {id:'neutral-18',text:'요청한 사항을 확인한 다음 필요한 답변을 준비하고 관련된 설명을 함께 전달했습니다.'},
 {id:'neutral-19',text:'각 항목에 대한 내용을 읽어 보고 서로 겹치지 않게 나누어 정리하는 방식으로 문서를 구성했습니다.'},
 {id:'neutral-20',text:'처음에는 전체 내용을 확인하고 이후에 자세한 설명을 살펴보며 빠진 정보가 없는지 검토했습니다.'},
 {id:'number-01',text:'신청 수량은 12개이며 배송 일정은 별도 안내합니다.'},
 {id:'amount-01',text:'최종 결제 금액은 230,000원으로 기록되어 있습니다.'},
 {id:'date-01',text:'계약 시작일은 2026년 11월 15일이며 종료일은 2027년 11월 14일입니다.'},
 {id:'quote-01',text:'담당자는 “원본 파일은 그대로 보관합니다”라고 안내했습니다.'},
 {id:'negation-01',text:'승인 전에는 문서를 외부에 전달하지 않습니다.'},
 {id:'negation-02',text:'해당 변경은 아직 완료되지 않았으며 추가 검토가 필요합니다.'},
 {id:'url-01',text:'참고 주소는 https://example.invalid/guide 이며 열람 전에 출처를 확인합니다.'},
 {id:'table-01',text:'항목 | 수량 | 금액\n연필 | 12 | 3,600원'},
 {id:'name-01',text:'담당자 이름: 김하늘. 연락 전에 수신인 정보를 확인합니다.'},
 {id:'mixed-01',text:'보증 기간은 24개월이고 환불은 승인되지 않습니다. “최종 금액은 80,000원”이라는 기록을 유지합니다.'},
 {id:'negative-03',text:'고객 정보는 동의 없이 수집하거나 저장하지 않으며, 문의는 https://example.invalid/privacy 에서 확인합니다.'},
];
assert.ok(cases.length>=30,'at least 30 fixed synthetic Korean cases are required');
const sha=value=>createHash('sha256').update(value,'utf8').digest('hex');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const waitFor=async(fn,predicate=x=>Boolean(x),timeout=120000)=>{
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){last=await fn();if(predicate(last))return last;await sleep(100);}
 throw Error('P123 real-model test timeout');
};
function processTreeSnapshot(){
 const entries=new Map();
 let ids=[];
 try{ids=readdirSync('/proc').filter(name=>/^\d+$/.test(name));}catch{return entries;}
 for(const id of ids){
  try{
   const raw=readFileSync('/proc/'+id+'/stat','utf8');
   const close=raw.lastIndexOf(')');
   const fields=raw.slice(close+2).trim().split(/\s+/);
   const ppid=Number(fields[1]),ticks=Number(fields[11])+Number(fields[12]);
   const status=readFileSync('/proc/'+id+'/status','utf8');
   const rssMatch=status.match(/^VmRSS:\s+(\d+)\s+kB/m);
   entries.set(Number(id),{ppid,ticks,rssBytes:Number(rssMatch?.[1]||0)*1024});
  }catch{}
 }
 const keep=new Set();
 if(entries.has(ollamaPid)){
  keep.add(ollamaPid);
  let changed=true;
  while(changed){changed=false;for(const [pid,p] of entries)if(!keep.has(pid)&&keep.has(p.ppid)){keep.add(pid);changed=true;}}
 }
 return new Map([...keep].map(pid=>[pid,entries.get(pid)]));
}
function beginResourceSample(){
 const start=processTreeSnapshot();let previous=start;let cpuTicks=0,peakRss=0,samples=0;
 const sample=()=>{
  const current=processTreeSnapshot();let totalRss=0;
  for(const [pid,p] of current){
   const prior=previous.get(pid)||start.get(pid);
   if(prior)cpuTicks+=Math.max(0,p.ticks-prior.ticks);
   else cpuTicks+=Math.max(0,p.ticks);
   totalRss+=p.rssBytes;
  }
  if(totalRss>peakRss)peakRss=totalRss;
  previous=current;samples++;
 };
 const timer=setInterval(sample,50);timer.unref?.();
 return{
  finish(){sample();clearInterval(timer);return{ollama_cpu_seconds:Number((cpuTicks/ticksPerSecond).toFixed(3)),
   ollama_process_tree_peak_rss_bytes:peakRss,resource_samples:samples};},
 };
}
const controller=createOwnerOllamaController();
const records=[];
const allowedOrigin='http://127.0.0.1:4173';
const sendJson=(res,status,value)=>{
 res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store',
  'access-control-allow-origin':allowedOrigin,'access-control-allow-methods':'GET, POST, OPTIONS',
  'access-control-allow-headers':'content-type','access-control-allow-private-network':'true','vary':'origin'});
 res.end(JSON.stringify(value));
};
const readJson=req=>new Promise((resolve,reject)=>{
 let raw='',size=0;
 req.on('data',part=>{size+=part.length;if(size>6000){reject(Error('payload-limit'));req.destroy();return;}raw+=part.toString('utf8');});
 req.on('end',()=>{try{resolve(JSON.parse(raw||'{}'));}catch{reject(Error('invalid-json'));}});
 req.on('error',reject);
});
const server=createServer(async(req,res)=>{
 if(req.headers.origin!==allowedOrigin){sendJson(res,403,{status:'error',reason:'origin-not-allowed'});return;}
 if(req.method==='OPTIONS'){res.writeHead(204,{'access-control-allow-origin':allowedOrigin,
  'access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'content-type',
  'access-control-allow-private-network':'true','vary':'origin'});res.end();return;}
 try{
  if(req.method==='GET'&&req.url==='/status'){sendJson(res,200,await controller.status());return;}
  if(req.method==='POST'&&req.url==='/cancel'){sendJson(res,200,controller.cancel());return;}
  if(req.method==='POST'&&req.url==='/propose'){
   const body=await readJson(req),caseId=typeof body.caseId==='string'&&/^[a-z0-9-]{1,32}$/.test(body.caseId)?body.caseId:'invalid-case';
   const input=typeof body.text==='string'?body.text:'';
   const started=process.hrtime.bigint(),resources=beginResourceSample();
   const result=await controller.propose(input,{explicitConsent:body.explicitConsent===true});
   const elapsedMs=Number(process.hrtime.bigint()-started)/1e6;
   const measured=resources.finish();
   records.push({case_id:caseId,input_sha256:sha(input),status:result.status,
    reason:result.reason||null,latency_ms:Number(elapsedMs.toFixed(1)),...measured,
    proposal_sha256:result.status==='proposal'?sha(result.suggested):null});
   sendJson(res,200,result);return;
  }
  sendJson(res,404,{status:'error',reason:'not-found'});
 }catch{sendJson(res,500,{status:'error',reason:'bridge-error'});}
});
const browserProfile=join(tmpdir(),'astra-p123-real-qwen3-profile');
const browser=launchBrowser(browserBinary,browserProfile,'P123 actual Qwen3 CPU');
let ws,seq=0,serverInfo,failed=null;
const pending=new Map(),external=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function browserEventually(fn,predicate=x=>Boolean(x),timeout=120000){
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){last=await fn();if(predicate(last))return last;await pause(100);}
 throw Error('P123 review UI timeout');
}
const runReport={
 schema:'astra-p123-real-qwen3-report-v1',model:{id:'Qwen3-4B-Instruct-2507',quantization:'Q8_0',
  github_repository:'locomotive-works/npu-local-model-running',release_tag:'v1.0',
  release_commit:'6bbfd43a548c506734fb8899ed5adee5878a5e4a',
  combined_sha256:'eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee',
  license:{name:'Apache-2.0',repository_file:'LICENSE',git_blob_sha:'6634c8cc3133b3848ec74b9f275acaaa1ea618ab',test_only:true,redistribution:false},
  release_assets:[{name:'qwen3-4b-instruct-2507-Q8_0.gguf.part0',size_bytes:2013265920,sha256:'611f555849d7360ac5157df694b2ca7327a9d69a40612cf86807e765cbfdb75c'},
   {name:'qwen3-4b-instruct-2507-Q8_0.gguf.part1',size_bytes:2013265920,sha256:'4d329adca10c17ab73a64d47a22ffc8163f0f89567459ccb149ef685cf33e87a'},
   {name:'qwen3-4b-instruct-2507-Q8_0.gguf.part2',size_bytes:253871776,sha256:'8aa6a472d08a4ba1922eff00e2833cbb36f30ae7b13d98620ff84d8b81862e21'}],},
 runtime:{ollama_version:'v0.40.16',ollama_release_asset_sha256:'87bfafb2acbc89b2e6a1be0a9043de6aa75fb450696f86bc426e65fc448f788d',mode:'GitHub-hosted ubuntu-latest CPU-only standard runner',
  system_cpu_threads:cpus().length,system_total_ram_bytes:totalmem(),
  network:'loopback-only inference; OLLAMA_NO_CLOUD=1'},
 cases:[],cancellation:null,summary:{status:'RUNNING',case_count:0,visible_valid_proposals:0,
  rejected_or_error:0,automatic_applies:0,external_browser_requests:0},
 limitations:['Synthetic fixture and isolated browser profile only; no customer files or production V1/V2 database were opened.',
  'Third-party conversion repository does not pin the upstream safetensors revision; the exact GitHub release assets and repository Apache-2.0 LICENSE are pinned and hash-checked.',
  'This action proves loopback CPU inference and review UI behavior, not Windows performance or buyer acceptance.'],
};
const signature=value=>{
 const text=value.normalize('NFC').replaceAll('\u2212','-');
 const urls=text.match(/https?:\/\/[^\s]+/g)||[];
 const numbers=text.match(/(?:[$₩€£]|[+\-])?\d+(?:[.,:/%\-]\d+)*(?:%|원|달러|만원|억원)?/g)||[];
 const quotes=text.match(/"[^"\n]*"|'[^'\n]*'|“[^”\n]*”|‘[^’\n]*’/g)||[];
 const protectedRoots=['않','못','없','아니','불가','금지','거부','취소','미승인','불허','제외','비승인'];
 const protectedCounts=protectedRoots.map(root=>[root,text.split(root).length-1]).filter(([,count])=>count>0);
 const negationPattern=/(?:않|못|없|아니|불가|금지|거부|취소|미승인|불허|제외|비승인|(?:^|\s)안(?=\s)|\b(?:not|no|never|cannot|can't|without|deny|denied|prohibit\w*)\b)/i;
 const negativeSentences=text.split(/(?<=[.!?。])|[\r\n;]+/)
  .map(part=>part.replace(/\s+/g,' ').trim()).filter(part=>part&&negationPattern.test(part));
 const labelNames=[...text.matchAll(/(?:성명|이름|담당자|수신인|발신인|고객명|회사명|대표자)\s*[:：=]\s*([가-힣]{2,4}|[A-Z][A-Za-z0-9_.-]{1,31})/g)].map(match=>match[1]);
 const titledNames=[...text.matchAll(/([가-힣]{2,4}|[A-Z][A-Za-z0-9_.-]{1,31})(?=(?:님|씨|대표|사장|회장|이사)(?:은|이|가|을|를|께서|께|으로|와|과|[,.;!?]|\s|$))/g)].map(match=>match[1]);
 const capitalized=[...(text.match(/\b[A-Z][A-Za-z0-9_.-]{1,31}\b/g)||[])];
 const protectedNames=[...new Set([...labelNames,...titledNames,...capitalized])].sort();
 const tableRows=text.split(/\r?\n/).filter(line=>/^\s*\|.+\|\s*$/.test(line)||line.split('\t').length>=3)
  .map(line=>line.trim().replace(/\s+/g,' '));
 const spacedAnCount=(text.match(/(?:^|[\s(])안(?=\s)/g)||[]).length;
 return JSON.stringify([urls,numbers,quotes,protectedNames,tableRows,protectedCounts,negativeSentences,spacedAnCount]);
};
const caseResults=[];
try{
 serverInfo=await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4174,'127.0.0.1',()=>resolve(server.address()));});
 ws=await browser.connect();
 ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.method==='Network.requestWillBeSent'){
   const request=message.params?.request?.url||'';
   if(request.startsWith('http://')||request.startsWith('https://')){
    const target=new URL(request);
    if(target.hostname!=='127.0.0.1'&&target.hostname!=='localhost')external.push(target.hostname);
   }
  }
  if(message.id&&pending.has(message.id)){
   const item=pending.get(message.id);pending.delete(message.id);
   if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
  }
 });
 const request=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
  const id=++seq;pending.set(id,{resolve,reject});
  ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
 });
 const {targetId}=await request('Target.createTarget',{url:pageUrl});
 const {sessionId}=await request('Target.attachToTarget',{targetId,flatten:true});
 const send=(method,params={})=>request(method,params,sessionId);
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 const evaluate=async expression=>{
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw Error('P123 browser evaluation failed');
  return result.result.value;
 };
 const click=selector=>evaluate('document.querySelector('+JSON.stringify(selector)+')?.click()');
 const setSource=value=>evaluate('(()=>{const input=document.querySelector("[data-model-source]");'+
  'const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set;'+
  'set.call(input,'+JSON.stringify(value)+');input.dispatchEvent(new Event("input",{bubbles:true}));'+
  'input.dispatchEvent(new Event("change",{bubbles:true}));return true;})()');
 await browserEventually(()=>evaluate('Boolean(document.querySelector("[data-local-model-harness]")&&document.querySelector("[data-local-ai-probe]"))'));
 await browserEventually(()=>evaluate('window.__astraStorageReady.then(()=>true)'),Boolean,20000);
 assert.equal((await evaluate('window.__astraSnapshotStorage()')).length>0,true,'synthetic storage sentinel seeded');
 const storageBefore=await evaluate('window.__astraSnapshotStorage()');
 assert.equal(await evaluate('document.querySelector("[data-local-ai-run]").disabled'),true);
 assert.equal(records.length,0,'no inference occurs before consent');
 await click('[data-local-ai-probe]');
 await browserEventually(()=>evaluate('Boolean(document.querySelector("[data-local-ai-consent]"))'));
 await click('[data-local-ai-consent]');
 assert.equal(records.length,0,'consent alone does not start inference');
 assert.equal(await evaluate('document.querySelector("[data-local-ai-run]").disabled'),false);
 for(const item of cases){
  await evaluate('window.__astraCurrentCase='+JSON.stringify(item.id));
  await setSource(item.text);
  await browserEventually(()=>evaluate('document.querySelector("[data-model-source]").value==='+JSON.stringify(item.text)));
  await click('[data-local-ai-run]');
  await browserEventually(()=>evaluate('document.querySelector("[data-local-ai-cancel]")===null&&'+
   '(Boolean(document.querySelector("[data-local-ai-proposal]"))||document.querySelector("[data-local-ai-status]")?.textContent.includes("원문은 변경되지 않았습니다"))'));
  await waitFor(()=>records.find(record=>record.case_id===item.id));
  const metric=records.find(record=>record.case_id===item.id);
  const proposalVisible=await evaluate('Boolean(document.querySelector("[data-local-ai-proposal]"))');
  const sourceValue=await evaluate('document.querySelector("[data-model-source]").value');
  assert.equal(sourceValue,item.text,'the model never auto-applies a draft');
  assert.equal(await evaluate('Number(document.querySelector("[data-model-apply-count]").textContent)'),0);
  let protectedFactsEqual=null,visibleProposalSha=null;
  if(proposalVisible){
   const proposal=await evaluate('document.querySelector("[data-local-ai-after]").innerText');
   protectedFactsEqual=signature(item.text)===signature(proposal);
   assert.equal(protectedFactsEqual,true,'protected factual tokens stay unchanged in every displayed draft');
   visibleProposalSha=sha(proposal);
   assert.equal(metric.status,'proposal');
   assert.equal(visibleProposalSha,metric.proposal_sha256);
  }
  caseResults.push({case_id:item.id,input_sha256:sha(item.text),status:metric.status,reason:metric.reason,
   latency_ms:metric.latency_ms,ollama_cpu_seconds:metric.ollama_cpu_seconds,
   ollama_process_tree_peak_rss_bytes:metric.ollama_process_tree_peak_rss_bytes,
   resource_samples:metric.resource_samples,proposal_visible_in_review_ui:proposalVisible,
   proposal_sha256:visibleProposalSha,protected_facts_equal:protectedFactsEqual,auto_applied:false});
 }
 assert.ok(caseResults.filter(item=>item.proposal_visible_in_review_ui).length>=5,'at least five real proposals must be shown in the review UI');
 const cancelCase='cancel-real-01';
 const cancelText='이 문단은 실제 추론 취소를 검증하기 위한 합성 문장입니다. '.repeat(22).slice(0,1800);
 await evaluate('window.__astraCurrentCase='+JSON.stringify(cancelCase));
 await setSource(cancelText);
 await click('[data-local-ai-run]');
 await browserEventually(()=>evaluate('Boolean(document.querySelector("[data-local-ai-cancel]"))'),Boolean,20000);
 await pause(100);
 await click('[data-local-ai-cancel]');
 await browserEventually(()=>evaluate('document.querySelector("[data-local-ai-cancel]")===null'));
 await waitFor(()=>records.find(record=>record.case_id===cancelCase),Boolean,30000);
 const cancelMetric=records.find(record=>record.case_id===cancelCase);
 assert.equal(cancelMetric.status,'error','cancel case must interrupt actual running inference');
 assert.equal(cancelMetric.reason,'local-inference-timeout-or-cancelled');
 assert.equal(await evaluate('document.querySelector("[data-local-ai-proposal]")===null'),true);
 assert.equal(await evaluate('document.querySelector("[data-model-source]").value'),cancelText);
 assert.equal(await evaluate('Number(document.querySelector("[data-model-apply-count]").textContent)'),0);
 runReport.cancellation={case_id:cancelCase,input_sha256:sha(cancelText),status:cancelMetric.status,
  reason:cancelMetric.reason,latency_ms:cancelMetric.latency_ms,ollama_cpu_seconds:cancelMetric.ollama_cpu_seconds,
  ollama_process_tree_peak_rss_bytes:cancelMetric.ollama_process_tree_peak_rss_bytes,
  resource_samples:cancelMetric.resource_samples,auto_applied:false};
 const storageAfter=await evaluate('window.__astraSnapshotStorage()');
 assert.equal(storageAfter,storageBefore,'synthetic V1/V2 persistence sentinels are unchanged');
 assert.deepEqual(external,[],'browser traffic remains loopback-only');
 runReport.cases=caseResults;
 runReport.summary={status:'PASS',case_count:caseResults.length,
  visible_valid_proposals:caseResults.filter(item=>item.proposal_visible_in_review_ui).length,
  rejected_or_error:caseResults.filter(item=>item.status!=='proposal').length,
  automatic_applies:caseResults.filter(item=>item.auto_applied).length,
  external_browser_requests:external.length,
  synthetic_v1_v2_storage_unchanged:true};
 console.log('PASS P123: actual local Qwen3-4B inference, '+cases.length+' synthetic Korean cases, >=5 reviewed proposals, cancellation, protected facts, CPU/RAM/latency, loopback-only, storage unchanged');
}catch(error){
 failed=error;
 runReport.cases=caseResults;
 runReport.summary={...runReport.summary,status:'FAIL',case_count:caseResults.length,
  visible_valid_proposals:caseResults.filter(item=>item.proposal_visible_in_review_ui).length,
  rejected_or_error:caseResults.filter(item=>item.status!=='proposal').length,
  automatic_applies:caseResults.filter(item=>item.auto_applied).length,
  external_browser_requests:external.length,error_code:'P123_REAL_MODEL_ACCEPTANCE_FAILED'};
 console.log('FAIL P123 real Qwen3 acceptance; redacted report written for diagnosis');
}finally{
 if(server.listening)await new Promise(resolve=>server.close(()=>resolve()));
 if(ws)try{ws.close();}catch{}
 try{await browser.close();}catch{}
 writeFileSync(reportPath,JSON.stringify(runReport,null,2)+'\n',{encoding:'utf8',mode:0o600});
}
if(failed)throw Error('P123 real Qwen3 acceptance failed');
