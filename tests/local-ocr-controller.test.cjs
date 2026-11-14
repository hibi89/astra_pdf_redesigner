'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {EventEmitter}=require('node:events');
const {PassThrough}=require('node:stream');
const {createLocalOcrController,validatePng,OCR_MANIFEST}=require('../desktop/local-ocr-controller.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function png(w=4,h=4){
 const b=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAFklEQVR4nGP8////fwYkwMSABggLAAAGXQQE3kxYjAAAAABJRU5ErkJggg==','base64');
 b.writeUInt32BE(w,16);b.writeUInt32BE(h,20);
 return new Uint8Array(b);
}
function fixture(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'astra-ocr-ci-'));
 const entries={};
 for(const [subdir,key,name] of [
  ['bin','binary','tesseract.exe'],['tessdata','kor','kor.traineddata'],['tessdata','eng','eng.traineddata']]){
  const folder=path.join(root,'astra-local-ocr',subdir);
  fs.mkdirSync(folder,{recursive:true});
  const content=Buffer.from('synthetic-only-'+key);
  fs.writeFileSync(path.join(folder,name),content);
  entries[key]={name,sha256:hash(content),maxBytes:2048};
 }
 return{root,manifest:{id:'tesseract-kor-eng-v1',...entries},
  cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
}
function fakeSpawn(expected,hold=false){
 return(_bin,args,options)=>{
  const input=args[0];expected.push({args,options,input});
  const child=new EventEmitter();
  child.stdout=new PassThrough();child.stderr=new PassThrough();child.killed=false;
  child.kill=()=>{child.killed=true;process.nextTick(()=>child.emit('close',1));};
  if(!hold)process.nextTick(()=>{
   child.stdout.end('한글 숫자 123 검토');
   child.stderr.end('suppressed sensitive diagnostic');
   child.emit('close',0);
  });
  return child;
 };
}
test('OCR defaults OFF, no spawn or cloud processing',async()=>{
 assert.equal(OCR_MANIFEST,null);
 let invoked=0;
 const ocr=createLocalOcrController({resourcesDir:'/absent',spawnProcess:()=>{invoked++;throw Error('spawn')}});
 assert.equal((await ocr.status()).status,'unavailable');
 assert.equal((await ocr.recognizePng(png())).status,'unavailable');
 assert.equal(invoked,0);
});
test('OCR rejects malformed PNG, excessive pixels, unsupported data',()=>{
 assert.throws(()=>validatePng(Buffer.alloc(33)),/invalid-image/);
 assert.throws(()=>validatePng(png(5000,5000)),/image-pixel-limit/);
 assert.throws(()=>validatePng(new Uint8Array(8*1024*1024+1)),/invalid-image/);
 const bad=png();bad[40]^=1;assert.throws(()=>validatePng(bad),/invalid-image/,'Tampered IDAT CRC must fail');
 assert.deepEqual(validatePng(png()).subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]));
});
test('OCR requires all pinned hashes, rejects symlink escape',async()=>{
 const f=fixture();
 try{
  const bad={...f.manifest,kor:{...f.manifest.kor,sha256:'0'.repeat(64)}};
  assert.equal((await createLocalOcrController({resourcesDir:f.root,manifest:bad}).status()).status,'unavailable');
  assert.equal((await createLocalOcrController({resourcesDir:f.root,manifest:f.manifest}).status()).status,'available');
  const kor=path.join(f.root,'astra-local-ocr','tessdata','kor.traineddata');
  fs.unlinkSync(kor);
  try{fs.symlinkSync(path.join(f.root,'astra-local-ocr','bin','tesseract.exe'),kor);}
  catch(error){if(process.platform==='win32'&&error?.code==='EPERM')return;throw error;}
  assert.equal((await createLocalOcrController({resourcesDir:f.root,manifest:f.manifest}).status()).status,'unavailable');
 }finally{f.cleanup();}
});
test('OCR never puts content in argv and leaves no temp page files',async()=>{
 const f=fixture(),calls=[];
 try{
  const ocr=createLocalOcrController({resourcesDir:f.root,manifest:f.manifest,spawnProcess:fakeSpawn(calls)});
  const result=await ocr.recognizePng(png());
  assert.deepEqual(result,{status:'review',text:'한글 숫자 123 검토',reviewOnly:true,approved:false,
   engine:'local-tesseract',externalTransfer:false});
  assert.equal(calls.length,1);
  assert.equal(calls[0].options.shell,false);
  assert.deepEqual(calls[0].args.slice(1,2),['stdout']);
  assert.ok(calls[0].args.includes('kor+eng'));
  assert.ok(!calls[0].args.join(' ').includes('한글'));
  assert.equal(fs.existsSync(calls[0].input),false);
 }finally{f.cleanup();}
});
test('OCR is single-flight and cancellation is fail-closed',async()=>{
 const f=fixture(),calls=[];
 try{
  const ocr=createLocalOcrController({resourcesDir:f.root,manifest:f.manifest,spawnProcess:fakeSpawn(calls,true)});
  const current=ocr.recognizePng(png());
  assert.equal((await ocr.recognizePng(png())).status,'busy');
  assert.equal((await ocr.cancel()).status,'cancel-requested');
  const result=await current;
  assert.equal(result.status,'error');
  assert.equal(result.reason,'cancelled');
  assert.equal((await ocr.cancel()).status,'idle');
 }finally{f.cleanup();}
});


test('OCR reassembles split UTF-8 Korean bytes without replacement characters',async()=>{
 const f=fixture();
 try{
  const expected='한글 검수 2026';
  function splitUtf8Spawn(){
   const child=new EventEmitter();
   child.stdout=new PassThrough();child.stderr=new PassThrough();child.killed=false;
   child.kill=()=>{child.killed=true;process.nextTick(()=>child.emit('close',1));};
   process.nextTick(()=>{
    const bytes=Buffer.from(expected,'utf8');
    // Split inside the very first three-byte Hangul syllable.
    child.stdout.write(bytes.subarray(0,1));
    child.stdout.write(bytes.subarray(1,2));
    child.stdout.write(bytes.subarray(2,7));
    child.stdout.end(bytes.subarray(7));
    child.emit('close',0);
   });
   return child;
  }
  const c=createLocalOcrController({resourcesDir:f.root,manifest:f.manifest,spawnProcess:splitUtf8Spawn});
  const result=await c.recognizePng(png());
  assert.equal(result.status,'review');
  assert.equal(result.text,expected);
  assert.equal(result.text.includes('\ufffd'),false);
 }finally{f.cleanup();}
});


test('OCR accepts only fixed PSM 3 or 6; arbitrary native CLI args are refused',async()=>{
 const f=fixture(),calls=[];
 try{
  const controller=createLocalOcrController({
   resourcesDir:f.root,manifest:f.manifest,spawnProcess:fakeSpawn(calls)
  });
  const malicious=await controller.recognizePng(png(),'--psm 0');
  assert.deepEqual(malicious,{status:'error',reason:'invalid-layout-mode'});
  assert.equal(calls.length,0,'Untrusted layout mode must not start a native process');
  const mixed=await controller.recognizePng(png(),3);
  assert.equal(mixed.status,'review');
  assert.equal(calls.length,1);
  assert.equal(calls[0].args.at(-1),'3');
  const paragraph=await controller.recognizePng(png(),6);
  assert.equal(paragraph.status,'review');
  assert.equal(calls[1].args.at(-1),'6');
 }finally{f.cleanup();}
});
