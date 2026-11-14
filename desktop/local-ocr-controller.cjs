'use strict';
// Opt-in, offline-only OCR for explicitly selected rasterized PDF pages.
// No runtime or language data is shipped until independently pinned and licensed.
const fs=require('node:fs');
const fsp=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const OCR_MANIFEST=null;
const SHA=/^[0-9a-f]{64}$/i;
const PNG_SIGNATURE=Buffer.from([137,80,78,71,13,10,26,10]);
const MAX_PNG_BYTES=8*1024*1024;
const MAX_PIXELS=8_000_000;
const MAX_TEXT_BYTES=128*1024;
function validEntry(e,limit){
 return e&&typeof e.name==='string'&&/^[A-Za-z0-9_.-]{2,80}$/.test(e.name)&&
  SHA.test(e.sha256)&&Number.isSafeInteger(e.maxBytes)&&e.maxBytes>=4&&e.maxBytes<=limit;
}
function validManifest(m){
 return m&&m.id==='tesseract-kor-eng-v1'&&validEntry(m.binary,256*1024*1024)&&
  validEntry(m.kor,32*1024*1024)&&validEntry(m.eng,32*1024*1024);
}
// Reject truncated or malformed PNG chunks before any native subprocess reads them.
const CRC_TABLE=Uint32Array.from({length:256},(_,i)=>{
 let x=i;for(let bit=0;bit<8;bit++)x=x&1?0xedb88320^(x>>>1):x>>>1;
 return x>>>0;
});
function chunkCrc(bytes,offset,length){
 let crc=0xffffffff;
 for(let i=offset;i<offset+4+length;i++)
  crc=CRC_TABLE[(crc^bytes[i])&255]^(crc>>>8);
 return(crc^0xffffffff)>>>0;
}
function validatePng(input){
 if(!(input instanceof Uint8Array)||input.byteLength<45||input.byteLength>MAX_PNG_BYTES)
  throw Error('invalid-image');
 const bytes=Buffer.from(input.buffer,input.byteOffset,input.byteLength);
 if(!bytes.subarray(0,8).equals(PNG_SIGNATURE))throw Error('invalid-image');
 let pos=8,seenIdat=false,seenEnd=false,chunkCount=0;
 while(pos<bytes.length){
  if(++chunkCount>1024||bytes.length-pos<12)throw Error('invalid-image');
  const length=bytes.readUInt32BE(pos);
  if(length>bytes.length-pos-12)throw Error('invalid-image');
  const type=bytes.toString('ascii',pos+4,pos+8);
  if(!/^[A-Za-z]{4}$/.test(type))throw Error('invalid-image');
  if(chunkCount===1){
   if(type!=='IHDR'||length!==13)throw Error('invalid-image');
   const w=bytes.readUInt32BE(pos+8),h=bytes.readUInt32BE(pos+12);
   if(w<1||h<1||w>10000||h>10000||w*h>MAX_PIXELS)throw Error('image-pixel-limit');
   const bitDepth=bytes[pos+16],color=bytes[pos+17];
   if(bitDepth!==8||![0,2,3,4,6].includes(color)||
      bytes[pos+18]!==0||bytes[pos+19]!==0||bytes[pos+20]>1)
    throw Error('invalid-image');
  }else if(type==='IHDR')throw Error('invalid-image');
  if(type==='IDAT')seenIdat=true;
  if(type==='IEND'){
   if(length!==0||!seenIdat)throw Error('invalid-image');
   seenEnd=true;
  }
  const actual=chunkCrc(bytes,pos+4,length);
  if(actual!==bytes.readUInt32BE(pos+8+length))throw Error('invalid-image');
  pos+=12+length;
  if(seenEnd){if(pos!==bytes.length)throw Error('invalid-image');break;}
 }
 if(!seenEnd||!seenIdat)return (()=>{throw Error('invalid-image')})();
 return Buffer.from(bytes);
}
async function digest(file){
 const hash=crypto.createHash('sha256');
 for await(const chunk of fs.createReadStream(file))hash.update(chunk);
 return hash.digest('hex');
}
async function checkedAsset(root,subdir,entry){
 const base=path.join(root,'astra-local-ocr',subdir);
 const expected=path.join(base,entry.name);
 const rootReal=await fsp.realpath(root);
 const baseReal=await fsp.realpath(base);
 if(!baseReal.startsWith(rootReal+path.sep))throw Error('unsafe-assets');
 const info=await fsp.lstat(expected);
 if(!info.isFile()||info.isSymbolicLink()||info.size<4||info.size>entry.maxBytes)throw Error('unsafe-assets');
 const real=await fsp.realpath(expected);
 if(path.dirname(real)!==baseReal)throw Error('unsafe-assets');
 if((await digest(real)).toLowerCase()!==entry.sha256.toLowerCase())throw Error('asset-hash');
 return real;
}
function createLocalOcrController({resourcesDir,manifest=OCR_MANIFEST,spawnProcess=spawn,timeoutMs=20000}={}){
 if(!Number.isInteger(timeoutMs)||timeoutMs<100||timeoutMs>120000)throw Error('invalid-timeout');
 let running=null;
 const unavailable=()=>({status:'unavailable',reason:'ocr-assets-not-shipped'});
 async function assets(){
  if(!validManifest(manifest)||typeof resourcesDir!=='string')return null;
  try{
   const binary=await checkedAsset(resourcesDir,'bin',manifest.binary);
   const kor=await checkedAsset(resourcesDir,'tessdata',manifest.kor);
   const eng=await checkedAsset(resourcesDir,'tessdata',manifest.eng);
   return{binary,tessdata:path.dirname(kor),kor,eng};
  }catch{return null;}
 }
 async function status(){
  return (await assets())?{status:'available',engineId:manifest.id}:unavailable();
 }
 async function recognizePng(input){
  let bytes;
  try{bytes=validatePng(input);}catch(error){
   return{status:'error',reason:error instanceof Error?error.message:'invalid-image'};
  }
  if(running)return{status:'busy'};
  let dir=null,child=null,timer=null,cancelled=false;
  const task={cancel:()=>{cancelled=true;if(child&&!child.killed)child.kill('SIGKILL');}};
  running=task;
  try{
   const found=await assets();
   if(cancelled)return{status:'error',reason:'cancelled'};
   if(!found)return unavailable();
   dir=await fsp.mkdtemp(path.join(os.tmpdir(),'astra-ocr-'));
   await fsp.chmod(dir,0o700);
   if(cancelled)return{status:'error',reason:'cancelled'};
   const file=path.join(dir,'page.png');
   await fsp.writeFile(file,bytes,{flag:'wx',mode:0o600});
   if(cancelled)return{status:'error',reason:'cancelled'};
   const args=[file,'stdout','--tessdata-dir',found.tessdata,'-l','kor+eng','--psm','6'];
   const output=await new Promise((resolve,reject)=>{
    let stdout='',outBytes=0,settled=false;
    const finish=(err,value)=>{
     if(settled)return;settled=true;clearTimeout(timer);
     if(err)reject(err);else resolve(value);
    };
    try{
     child=spawnProcess(found.binary,args,{
      shell:false,windowsHide:true,cwd:dir,stdio:['ignore','pipe','pipe'],
     });
    }catch{finish(Error('ocr-spawn-failed'));return;}
    timer=setTimeout(()=>{child.kill('SIGKILL');finish(Error('ocr-timeout'));},timeoutMs);
    child.stdout.on('data',part=>{
     outBytes+=part.length;
     if(outBytes>MAX_TEXT_BYTES){child.kill('SIGKILL');finish(Error('ocr-output-limit'));return;}
     stdout+=part.toString('utf8');
    });
    // Never echo stderr: OCR diagnostics can contain document details.
    child.stderr.on('data',()=>{});
    child.on('error',()=>finish(Error('ocr-spawn-failed')));
    child.on('close',code=>{
     if(cancelled)finish(Error('cancelled'));
     else if(code!==0)finish(Error('ocr-exit'));
     else finish(null,stdout);
    });
    if(cancelled)child.kill('SIGKILL');
   });
   if(cancelled)return{status:'error',reason:'cancelled'};
   const text=output.normalize('NFC').trim();
   if(!text||text.length>100000)return{status:'error',reason:'ocr-no-reviewable-text'};
   return{status:'review',text,reviewOnly:true,approved:false,engine:'local-tesseract',externalTransfer:false};
  }catch(error){
   return{status:'error',reason:cancelled?'cancelled':error instanceof Error?error.message:'ocr-error'};
  }finally{
   clearTimeout(timer);
   if(dir)await fsp.rm(dir,{recursive:true,force:true}).catch(()=>{});
   if(running===task)running=null;
  }
 }
 async function cancel(){
  if(!running)return{status:'idle'};
  running.cancel();
  return{status:'cancel-requested'};
 }
 return{status,recognizePng,cancel};
}
module.exports={createLocalOcrController,validatePng,OCR_MANIFEST};
