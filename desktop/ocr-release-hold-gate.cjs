'use strict';
// Release HOLD gate: this product must never silently acquire native OCR assets.
// The separate supply-chain preflight only checks bytes/evidence, not legal rights.
const fs=require('node:fs');
const path=require('node:path');
const {OCR_MANIFEST}=require('./local-ocr-controller.cjs');
function deny(msg){throw Error('ocr-release-hold:'+msg);}
function verifyOcrReleaseHold(root=path.resolve(__dirname,'..')){
 if(OCR_MANIFEST!==null)deny('manifest-active-without-human-approval');
 const config=fs.readFileSync(path.join(root,'electron-builder.yml'),'utf8');
 if(/\bextraResources\s*:|\bextraFiles\s*:/m.test(config))deny('new-electron-extra-resources-must-be-audited');
 if(!/^\s+- dist\/\*\*/m.test(config)||!/^\s+- desktop\/\*\*/m.test(config))
  deny('packaging-files-changed-review-required');
 let scanned=0;
 function walk(dir){
  if(!fs.existsSync(dir))return;
  for(const name of fs.readdirSync(dir)){
   const absolute=path.join(dir,name);
   const stat=fs.lstatSync(absolute);
   if(stat.isSymbolicLink())deny('unsafe-package-symlink');
   if(stat.isDirectory()){
    if(name.toLowerCase()==='astra-local-ocr')deny('native-ocr-assets-present');
    walk(absolute);
   }else if(stat.isFile()){
    scanned++;
    if(/\.(?:exe|dll|traineddata|so|dylib)$/i.test(name))
     deny('unapproved-native-ocr-binary');
   }else deny('unsafe-package-file');
   if(scanned>10000)deny('excessive-source-files');
  }
 }
 walk(path.join(root,'desktop'));walk(path.join(root,'dist'));
 return {status:'RELEASE_HOLD',nativeOcrAssetsBundled:false,productOcrEnabled:false,scannedSourceFiles:scanned};
}
module.exports={verifyOcrReleaseHold};
if(require.main===module){
 try{const result=verifyOcrReleaseHold();console.log(JSON.stringify(result));}
 catch(error){console.error('BLOCKED:',error.message);process.exitCode=1;}
}
