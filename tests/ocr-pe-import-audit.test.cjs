'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {inspectPeStaticImports,verifyPeImportClosure}=require('../desktop/ocr-pe-import-audit.cjs');
function image(name,delay=false){
 const b=Buffer.alloc(1024);b.write('MZ',0,'ascii');b.writeUInt32LE(0x80,0x3c);
 b.write('PE\0\0',0x80,'ascii');b.writeUInt16LE(0x8664,0x84);b.writeUInt16LE(1,0x86);
 b.writeUInt16LE(240,0x94);const o=0x98;b.writeUInt16LE(0x20b,o);
 b.writeUInt32LE(0x200,o+60);b.writeUInt32LE(16,o+108);
 b.write('.idata',0x188,'ascii');b.writeUInt32LE(0x200,0x190);
 b.writeUInt32LE(0x1000,0x194);b.writeUInt32LE(0x200,0x198);b.writeUInt32LE(0x200,0x19c);
 if(name){
  const index=delay?13:1,ds=delay?32:20;
  b.writeUInt32LE(0x1000,o+112+8*index);b.writeUInt32LE(ds*2,o+116+8*index);
  if(delay){b.writeUInt32LE(1,0x200);b.writeUInt32LE(0x1060,0x204);}
  else b.writeUInt32LE(0x1060,0x20c);
  b.write(name+'\0',0x260,'ascii');
 }
 return b;
}
function graph(imports,names=[]){
 const paths=new Map(names.map(n=>['bin/'+n.toLowerCase(),{kind:'dependency'}]));
 return verifyPeImportClosure(new Map([['bin/tesseract.exe',imports]]),paths);
}
test('P105 no import directory remains review-only',()=>assert.deepEqual(inspectPeStaticImports(image()),{direct:[],delayed:[]}));
test('P105 direct vendor dependency inventory',()=>{
 const v=inspectPeStaticImports(image('LIBLept.dll'));assert.deepEqual(v.direct,['liblept.dll']);
 assert.equal(graph(v,['liblept.dll']).bundledImportCount,1);
});
test('P105 missing vendor DLL is rejected',()=>assert.throws(()=>graph(inspectPeStaticImports(image('missing.dll'))),/missing-imported-dll/));
test('P105 known Windows DLL is not vendored',()=>{
 const v=inspectPeStaticImports(image('KERNEL32.dll'));
 assert.equal(graph(v).systemImportCount,1);
 assert.throws(()=>graph(v,['kernel32.dll']),/system-dll-shadowing/);
});
test('P105 delayed vendor dependency is required',()=>{
 const v=inspectPeStaticImports(image('msvcp140.dll',true));
 assert.deepEqual(v.delayed,['msvcp140.dll']);
 assert.throws(()=>graph(v),/missing-imported-dll/);
 assert.equal(graph(v,['msvcp140.dll']).delayImportCount,1);
});
test('P105 DLL traversal name is rejected',()=>assert.throws(()=>inspectPeStaticImports(image('../evil.dll')),/unsafe-import-name/));
test('P105 unmapped import RVA is rejected',()=>{
 const b=image('liblept.dll');b.writeUInt32LE(0x4000,0x20c);
 assert.throws(()=>inspectPeStaticImports(b),/unmapped-or-ambiguous-rva/);
});
test('P105 legacy delay import addressing is denied',()=>{
 const b=image('a.dll',true);b.writeUInt32LE(0,0x200);
 assert.throws(()=>inspectPeStaticImports(b),/unsupported-delay-import/);
});
test('P105 truncated import directory is rejected',()=>{
 const b=image('a.dll');b.writeUInt32LE(20,0x98+116+8);
 assert.throws(()=>inspectPeStaticImports(b),/invalid-import-directory/);
});
test('P105 x86 image and invalid section data are denied',()=>{
 const x=image();x.writeUInt16LE(0x14c,0x84);
 assert.throws(()=>inspectPeStaticImports(x),/invalid-x64-pe/);
 const b=image();b.writeUInt32LE(0x2000,0x19c);
 assert.throws(()=>inspectPeStaticImports(b),/out-of-bounds/);
});
test('P105 API-set imports are OS-classified',()=>{
 assert.equal(graph(inspectPeStaticImports(image('api-ms-win-core-file-l1-2-0.dll'))).systemImportCount,1);
});
