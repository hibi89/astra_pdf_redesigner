'use strict';
// P111 local Ollama adapter. Optional owner-installed runtime, no bundled model,
// customer uploads, proxy, cloud fallback, API key, user-selected URL or model.
const {validateSuggestion}=require('./local-model-controller.cjs');
const BASE='http://127.0.0.1:11434';
const MODEL='qwen3:4b-instruct';
const PROMPT='다음 한국어 문단을 자연스럽게 윤문하세요. 숫자, 날짜, 금액, 이름, URL, 인용, 부정, 금지 및 의미를 그대로 유지하고, 불확실하면 원문을 그대로 반환하세요. 설명이나 제목 없이 윤문한 문단만 출력하세요.\n\n';
const MAX_INPUT=2400;
const MAX_RESPONSE=16000;
function createOwnerOllamaController({request=globalThis.fetch,timeoutMs=90000}={}){
 if(typeof request!=='function'||!Number.isInteger(timeoutMs)||timeoutMs<100||timeoutMs>120000)
  throw Error('invalid-local-model-adapter');
 let running=null;
 async function call(path,init,signal){
  // URLs are source-owned constants: renderer text is never used to select a host.
  const resp=await request(BASE+path,{...init,redirect:'error',credentials:'omit',cache:'no-store',signal});
  if(!resp||resp.ok!==true)throw Error('local-ollama-unavailable');
  const len=Number(resp.headers?.get?.('content-length')||0);
  if(len>MAX_RESPONSE)throw Error('local-model-output-limit');
  const raw=await resp.text();
  if(raw.length>MAX_RESPONSE)throw Error('local-model-output-limit');
  const parsed=JSON.parse(raw);
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('local-ollama-response-invalid');
  return parsed;
 }
 async function status(){
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),Math.min(timeoutMs,2000));
  try{
   const tags=await call('/api/tags',{method:'GET'},ctrl.signal);
   if(!Array.isArray(tags.models)||!tags.models.some(x=>x?.name===MODEL))
    return{status:'unavailable',reason:'local-ollama-model-not-installed'};
   return{status:'available',modelId:MODEL,engine:'owner-installed-ollama'};
  }catch{return{status:'unavailable',reason:'local-ollama-not-running'};}
  finally{clearTimeout(timer);}
 }
 async function propose(text,{explicitConsent=false}={}){
  if(typeof text!=='string'||!text.trim()||text.length>MAX_INPUT)return{status:'error',reason:'invalid-input'};
  if(explicitConsent!==true)return{status:'error',reason:'local-model-consent-required'};
  if(running)return{status:'busy'};
  const ctrl=new AbortController();
  running=ctrl;
  const timer=setTimeout(()=>ctrl.abort(),timeoutMs);
  try{
   // No input in URL, environment, logs or command line; POST only to fixed loopback.
   const response=await call('/api/generate',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({model:MODEL,prompt:PROMPT+text,stream:false,think:false,
      options:{temperature:0,num_predict:320,num_ctx:2048},keep_alive:0}),
   },ctrl.signal);
   if(response.done!==true||response.model!==MODEL||typeof response.response!=='string')
    return{status:'error',reason:'local-model-output-invalid'};
   const proposed=response.response.normalize('NFC').trim();
   if(proposed.includes('<think>')||proposed.includes('</think>')||
     !validateSuggestion(text,proposed))
    return{status:'error',reason:'unverified-output'};
   return{status:'proposal',suggested:proposed,engine:'owner-installed-local-ollama',externalTransfer:false};
  }catch{return{status:'error',reason:ctrl.signal.aborted?'local-inference-timeout-or-cancelled':'local-inference-failed'};}
  finally{clearTimeout(timer);if(running===ctrl)running=null;}
 }
 function cancel(){
  if(!running)return{status:'idle'};
  running.abort();
  return{status:'cancel-requested'};
 }
 return{status,propose,cancel};
}
module.exports={BASE,MODEL,createOwnerOllamaController};
