'use strict';
// Linux-only reproducible local OCR golden review. Never ships binaries or
// stores recognized customer text. Explicit local asset paths only.
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {createLocalOcrController,OCR_MANIFEST}=require('../desktop/local-ocr-controller.cjs');

function digest(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}
function normalize(value){return value.normalize('NFC').replace(/\s+/g,'');}
function charError(reference,recognized){
 const a=Array.from(reference),b=Array.from(recognized);
 let previous=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  const next=[i];
  for(let j=1;j<=b.length;j++)
   next[j]=Math.min(next[j-1]+1,previous[j]+1,previous[j-1]+Number(a[i-1]!==b[j-1]));
  previous=next;
 }
 return previous[b.length]/Math.max(1,a.length);
}
async function run(){
 if(process.platform!=='linux')throw Error('Golden harness verified on Linux only');
 if(process.argv.length!==6&&process.argv.length!==7)throw Error('Usage: node scripts/run-ocr-golden.cjs samplesDir tesseractBin kor.traineddata eng.traineddata [3|6]');
 if(OCR_MANIFEST!==null)throw Error('Test must not activate a release OCR manifest');
 const [, ,samplesDir,binaryPath,korPath,engPath]=process.argv;
 const pageSegmentationMode=process.argv.length===7?Number(process.argv[6]):6;
 if(pageSegmentationMode!==3&&pageSegmentationMode!==6)throw Error('Only OCR segmentation mode 3 or 6 is allowed');
 const base=fs.realpathSync(samplesDir);
 const cases=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
 if(!Array.isArray(cases)||cases.length!==20)throw Error('Expected 20 synthetic cases');
 const entries=[['binary',binaryPath,'bin','tesseract'],['kor',korPath,'tessdata','kor.traineddata'],['eng',engPath,'tessdata','eng.traineddata']];
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'astra-ocr-native-'));
 try{
  const target=path.join(root,'astra-local-ocr');
  fs.mkdirSync(path.join(target,'bin'),{recursive:true});
  fs.mkdirSync(path.join(target,'tessdata'),{recursive:true});
  const manifest={id:'tesseract-kor-eng-v1'};
  for(const [key,original,subdir,name] of entries){
   const source=fs.realpathSync(original),stat=fs.lstatSync(original);
   if(!stat.isFile()||stat.isSymbolicLink())throw Error('Must select ordinary local trusted OCR assets');
   const contents=fs.readFileSync(source);
   if(contents.length<4||contents.length>(key==='binary'?256:32)*1024*1024)throw Error('Asset size exceeds limit');
   const destination=path.join(target,subdir,name);
   fs.copyFileSync(source,destination);
   if(key==='binary')fs.chmodSync(destination,0o755);
   manifest[key]={name,sha256:digest(contents),maxBytes:contents.length};
  }
  const engine=createLocalOcrController({resourcesDir:root,manifest,timeoutMs:20000});
  if((await engine.status()).status!=='available')throw Error('Pinned local engine unavailable');
  const outcomes=[];
  for(let i=0;i<cases.length;i++){
   const sample=cases[i];
   if(!sample||sample.case!==i+1||typeof sample.file!=='string'||
      !/^ocr_\d{2}\.png$/.test(sample.file)||typeof sample.expected!=='string'||
      sample.expected.length>200||!(/^[0-9a-f]{64}$/).test(sample.sha256))
    throw Error('Invalid synthetic case');
   const input=path.join(base,sample.file);
   const metadata=fs.lstatSync(input);
   if(!metadata.isFile()||metadata.isSymbolicLink())throw Error('Symlink/unsafe test input');
   const png=fs.readFileSync(input);
   if(png.length>8*1024*1024||digest(png)!==sample.sha256)throw Error('Synthetic PNG hash mismatch');
   const started=Date.now();
   const reply=await engine.recognizePng(png,pageSegmentationMode);
   const reference=normalize(sample.expected);
   const recognized=normalize(reply.status==='review'&&typeof reply.text==='string'?reply.text:'');
   outcomes.push({case:sample.case,status:reply.status,exact:reference===recognized,
    cer:charError(reference,recognized),ms:Date.now()-started});
  }
  const exact=outcomes.filter(x=>x.exact).length;
  const average=outcomes.reduce((total,x)=>total+x.cer,0)/outcomes.length;
  const summary={
   format:'astra-ocr-synthetic-golden-v1',synthetic:true,
   engine:'tesseract-kor-eng-local-pinned',pageSegmentationMode,tested:outcomes.length,reviewed:outcomes.filter(x=>x.status==='review').length,
   exact,nonExact:outcomes.length-exact,meanCharacterErrorRate:Number(average.toFixed(4)),
   mismatchedCaseIds:outcomes.filter(x=>!x.exact).map(x=>x.case),
   totalDurationMs:outcomes.reduce((total,x)=>total+x.ms,0),
   ownerApproval:'NOT_GRANTED',saleReady:false,realCustomerAccuracyCertified:false,
  };
  console.log(JSON.stringify(summary,null,2));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
}
run().catch(error=>{console.error('OCR synthetic golden test failed:',error instanceof Error?error.message:'unknown');process.exitCode=1;});
