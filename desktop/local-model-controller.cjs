'use strict';
// M03-B preparation: no model or binary ships with this build. The disabled
// release manifest is CODE-owned and never sourced from untrusted renderer IPC.
const fs=require('node:fs');
const fsp=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const DEFAULT_TIMEOUT_MS=20000;
const SHA=/^[a-f0-9]{64}$/i;
const RELEASE_MANIFEST=null; // NOT AUTHORIZED FOR COMMERCIAL OR MODEL EXECUTION

const unavailable=Object.freeze({status:'unavailable',reason:'model-not-shipped'});
function isManifest(m){
  return !!m&&m.id&&typeof m.id==='string'&&/^[a-z0-9-]{1,64}$/.test(m.id)&&
    ['runtime','model'].every(k=>m[k]&&
      typeof m[k].name==='string'&&/^[A-Za-z0-9_.-]{2,80}$/.test(m[k].name)&&
      SHA.test(m[k].sha256)&&Number.isInteger(m[k].maxBytes)&&m[k].maxBytes>0&&
      m[k].maxBytes<=(k==='model'?4*1024**3:256*1024**2));
}
async function hashFile(file){
  const hash=crypto.createHash('sha256');
  for await(const data of fs.createReadStream(file))hash.update(data);
  return hash.digest('hex');
}
async function verifiedAsset(root,folder,entry){
  const target=path.join(root,'astra-local-model',folder,entry.name);
  const real=await fsp.realpath(target);
  const safeRoot=await fsp.realpath(root);
  if(!real.startsWith(safeRoot+path.sep))throw Error('Bundle asset escaped resources directory');
  const stat=await fsp.stat(real);
  if(!stat.isFile()||stat.size<4||stat.size>entry.maxBytes)throw Error('Model bundle file size invalid');
  const digest=await hashFile(real);
  if(digest.toLowerCase()!==entry.sha256.toLowerCase())throw Error('Model bundle file hash mismatch');
  return real;
}
// Conservative, local-only protection of literal high-impact facts. This is a
// syntactic fail-closed filter, never a guarantee of semantic preservation.
function stableTokens(value){
  const v=value.normalize('NFC').replaceAll('\u2212','-');
  const urls=v.match(/https?:\/\/[^\s]+/g)||[];
  const numbers=v.match(/(?:[$₩€£]|[+\-])?\d+(?:[.,:/%\-]\d+)*(?:%|원|달러|만원|억원)?/g)||[];
  const quoted=v.match(/"[^"\n]*"|'[^'\n]*'|“[^”\n]*”|‘[^’\n]*’/g)||[];
  const protectedRoots=['않','못','없','아니','불가','금지','거부','취소','미승인','불허','제외','비승인'];
  const protectedCounts=protectedRoots.map(root=>[root,v.split(root).length-1])
    .filter(([,count])=>count>0);
  const negationPattern=/(?:않|못|없|아니|불가|금지|거부|취소|미승인|불허|제외|비승인|(?:^|\s)안(?=\s)|\b(?:not|no|never|cannot|can't|without|deny|denied|prohibit\w*)\b)/i;
  // Freeze any sentence that carries a negation/prohibition token. This can
  // reject harmless rewrites, but it prevents moving the same negative token
  // onto a different actor, amount or clause.
  const negationSentences=v.split(/(?<=[.!?。])|[\r\n;]+/)
    .map(part=>part.replace(/\s+/g,' ').trim())
    .filter(part=>part&&negationPattern.test(part));
  const labelNames=[...v.matchAll(/(?:성명|이름|담당자|수신인|발신인|고객명|회사명|대표자)\s*[:：=]\s*([가-힣]{2,4}|[A-Z][A-Za-z0-9_.-]{1,31})/g)]
    .map(match=>match[1]);
  const titledNames=[...v.matchAll(/([가-힣]{2,4}|[A-Z][A-Za-z0-9_.-]{1,31})(?=(?:님|씨|대표|사장|회장|이사)(?:은|이|가|을|를|께서|께|으로|와|과|[,.;!?]|\s|$))/g)]
    .map(match=>match[1]);
  // Capitalized Latin identifiers include common English names/company names.
  // This conservative rule may reject style edits to English words.
  const capitalized=[...(v.match(/\b[A-Z][A-Za-z0-9_.-]{1,31}\b/g)||[])];
  const protectedNames=[...new Set([...labelNames,...titledNames,...capitalized])].sort();
  // Table rows are left untouched: free-form prose rewriting is unsafe there.
  const tableRows=v.split(/\r?\n/)
    .filter(line=>/^\s*\|.+\|\s*$/.test(line)||line.split('\t').length>=3)
    .map(line=>line.trim().replace(/\s+/g,' '));
  const spacedAnCount=(v.match(/(?:^|[\s(])안(?=\s)/g)||[]).length;
  return JSON.stringify([urls,numbers,quoted,protectedNames,tableRows,protectedCounts,negationSentences,spacedAnCount]);
}
function validateSuggestion(before,after){
  if(typeof after!=='string'||after.trim().length===0||after.length>5000||after.trim()===before.trim())
    return false;
  if(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(after))return false;
  if(stableTokens(before)!==stableTokens(after))return false;
  if(after.length>before.length*1.65||after.length<before.length*0.45)return false;
  return true;
}
function createLocalModelController({resourcesDir,manifest=RELEASE_MANIFEST,spawnProcess=spawn,timeoutMs=DEFAULT_TIMEOUT_MS}={}){
  if(!Number.isInteger(timeoutMs)||timeoutMs<100||timeoutMs>120000)throw Error('Invalid timeout');
  let running=null;
  async function verify(){
    if(!isManifest(manifest))return null;
    try{
      const runtime=await verifiedAsset(resourcesDir,'bin',manifest.runtime);
      const model=await verifiedAsset(resourcesDir,'models',manifest.model);
      return{runtime,model};
    }catch{return null;}
  }
  async function status(){
    const files=await verify();
    return files?{status:'available',modelId:manifest.id}:{...unavailable};
  }
  async function propose(text){
    if(typeof text!=='string'||!text.trim()||text.length>2400)
      return{status:'error',reason:'invalid-input'};
    if(running)return{status:'busy'};
    // Acquire the single-flight gate BEFORE any awaited checksum work.
    let dir=null,child=null,timer=null,cancelled=false;
    const task={cancel:()=>{cancelled=true;if(child&&!child.killed)child.kill('SIGKILL');}};
    running=task;
    try{
      const files=await verify();
      if(cancelled)return{status:'error',reason:'cancelled'};
      if(!files)return{...unavailable};
      // No original document or prompt appears in command-line args, stdout
      // logs or network services. Per-request prompt file is deleted.
      dir=await fsp.mkdtemp(path.join(os.tmpdir(),'astra-llm-'));
      await fsp.chmod(dir,0o700);
      const promptFile=path.join(dir,'prompt.txt');
      const instructions='Rewrite ONLY the Korean paragraph, preserving all numbers, names, dates, quotes and negation. Output only the rewritten paragraph. If uncertain, output the original.\n\n'+text;
      await fsp.writeFile(promptFile,instructions,{flag:'wx',mode:0o600,encoding:'utf8'});
      const args=['--model',files.model,'--file',promptFile,'--simple-io','--no-display-prompt',
        '--no-show-timings','--single-turn','--ctx-size','2048','--threads','2','--predict','256'];
      const output=await new Promise((resolve,reject)=>{
        let stdout='',size=0,settled=false;
        const finish=(err,value)=>{
          if(settled)return;settled=true;
          if(timer)clearTimeout(timer);
          if(err)reject(err);else resolve(value);
        };
        try{
          child=spawnProcess(files.runtime,args,{
            cwd:path.dirname(files.runtime),shell:false,windowsHide:true,
            stdio:['ignore','pipe','pipe'],
            env:{PATH:process.env.PATH||'',SystemRoot:process.env.SystemRoot||'',
              WINDIR:process.env.WINDIR||'',TEMP:dir,TMP:dir,HOME:dir},
          });
        }catch(e){finish(e);return;}
        child.stdout.on('data',part=>{
          size+=part.length;
          if(size>16*1024){child.kill('SIGKILL');finish(Error('Model output too long'));}
          else stdout+=part.toString('utf8');
        });
        child.stderr.on('data',()=>{}); // Never persist customer content
        child.once('error',error=>finish(error));
        child.once('close',code=>code===0?finish(null,stdout):finish(Error('Inference failed')));
        timer=setTimeout(()=>{child.kill('SIGKILL');finish(Error('Inference timeout'));},timeoutMs);
        timer.unref?.();
      });
      const suggested=output.trim();
      return validateSuggestion(text,suggested)?
        {status:'proposal',suggested,engine:'local-llm-unverified'}:
        {status:'error',reason:'unverified-output'};
    }catch{return{status:'error',reason:'local-inference-failed'};}
    finally{
      if(timer)clearTimeout(timer);
      running=null;
      if(dir)await fsp.rm(dir,{recursive:true,force:true}).catch(()=>{});
    }
  }
  function cancel(){if(!running)return{status:'idle'};running.cancel();return{status:'cancel-requested'};}
  return{status,propose,cancel};
}
module.exports={RELEASE_MANIFEST,createLocalModelController,validateSuggestion};
