'use strict';
// P105: static PE evidence only; no binary execution, signature or release approval.
const MAX_PE_BYTES=64*1024*1024;
const SYSTEM=new Set('advapi32.dll bcrypt.dll cabinet.dll comctl32.dll comdlg32.dll crypt32.dll gdi32.dll gdi32full.dll imm32.dll iphlpapi.dll kernel32.dll kernelbase.dll msvcrt.dll ntdll.dll ole32.dll oleaut32.dll rpcrt4.dll secur32.dll shell32.dll shlwapi.dll user32.dll userenv.dll version.dll winhttp.dll wininet.dll winmm.dll ws2_32.dll ucrtbase.dll'.split(' '));
function fail(m){throw Error('pe-import:'+m);}
function check(b,p,n){if(!Number.isSafeInteger(p)||!Number.isSafeInteger(n)||p<0||n<0||p>b.length||n>b.length-p)fail('out-of-bounds');}
function inspectPeStaticImports(b){
 if(!Buffer.isBuffer(b)||b.length>MAX_PE_BYTES)fail('input-too-large-or-invalid');
 check(b,0x3c,4);if(b.toString('ascii',0,2)!=='MZ')fail('invalid-dos-header');
 const pe=b.readUInt32LE(0x3c);check(b,pe,24);
 if(b.toString('ascii',pe,pe+4)!=='PE\0\0'||b.readUInt16LE(pe+4)!==0x8664)fail('invalid-x64-pe');
 const count=b.readUInt16LE(pe+6),size=b.readUInt16LE(pe+20),o=pe+24;
 if(count>96||size<240)fail('unsupported-optional-header');
 check(b,o,size+count*40);
 if(b.readUInt16LE(o)!==0x20b)fail('invalid-pe32-plus');
 const headerBytes=b.readUInt32LE(o+60),dirCount=b.readUInt32LE(o+108);
 if(dirCount>32)fail('invalid-directory-count');
 const sections=[];
 for(let i=0;i<count;i++){
  const q=o+size+i*40;
  const s={vsize:b.readUInt32LE(q+8),vaddr:b.readUInt32LE(q+12),rawsize:b.readUInt32LE(q+16),raw:b.readUInt32LE(q+20)};
  if(s.rawsize)check(b,s.raw,s.rawsize);
  sections.push(s);
 }
 function at(rva,n){
  if(!rva)fail('zero-rva');
  const result=[];
  if(rva<headerBytes&&n<=headerBytes-rva&&rva+n<=b.length)result.push(rva);
  for(const s of sections){
   if(rva<s.vaddr)continue;
   const delta=rva-s.vaddr;
   if(delta<=s.rawsize&&n<=s.rawsize-delta&&delta<=Math.max(s.vsize,s.rawsize))
    result.push(s.raw+delta);
  }
  if(result.length!==1)fail('unmapped-or-ambiguous-rva');
  check(b,result[0],n);return result[0];
 }
 function name(rva){
  const arr=[];
  for(let i=0;i<96;i++){
   const c=b[at(rva+i,1)];
   if(c===0){
    const value=Buffer.from(arr).toString('ascii').toLowerCase();
    if(!/^[a-z0-9_][a-z0-9_.+-]{0,89}\.dll$/.test(value))fail('unsafe-import-name');
    return value;
   }
   if(c<32||c>126)fail('invalid-import-name');
   arr.push(c);
  }
  fail('unterminated-import-name');
 }
 function dir(index,ds,offset,delay){
  if(dirCount<=index)return [];
  const entry=o+112+8*index;check(b,entry,8);
  const rva=b.readUInt32LE(entry),bytes=b.readUInt32LE(entry+4);
  if(!rva&&!bytes)return [];
  if(!rva||bytes<ds*2||bytes>1024*1024)fail('invalid-import-directory');
  const out=[];let ended=false;
  for(let i=0;i<Math.floor(bytes/ds);i++){
   const p=at(rva+i*ds,ds);let zero=true;
   for(let j=0;j<ds;j++)if(b[p+j]){zero=false;break;}
   if(zero){ended=true;break;}
   if(delay&&b.readUInt32LE(p)!==1)fail('unsupported-delay-import');
   out.push(name(b.readUInt32LE(p+offset)));
   if(out.length>512)fail('too-many-imports');
  }
  if(!ended)fail('unterminated-import-directory');
  return out;
 }
 return {direct:dir(1,20,12,false),delayed:dir(13,32,4,true)};
}
function verifyPeImportClosure(perFile,byName){
 let direct=0,delayed=0,system=0,bundled=0;
 for(const [source,imports] of perFile){
  for(const [kind,names] of [['direct',imports.direct],['delayed',imports.delayed]]){
   for(const name of names){
    if(kind==='direct')direct++;else delayed++;
    const file='bin/'+name,has=byName.has(file);
    const isSystem=SYSTEM.has(name)||/^(?:api-ms-win|ext-ms-win)-[a-z0-9._-]+\.dll$/.test(name);
    if(isSystem){if(has)fail('system-dll-shadowing:'+source+':'+name);system++;}
    else if(has&&byName.get(file).kind==='dependency')bundled++;
    else fail('missing-imported-dll:'+source+':'+name);
   }
  }
 }
 return {directImportCount:direct,delayImportCount:delayed,systemImportCount:system,bundledImportCount:bundled};
}
module.exports={inspectPeStaticImports,verifyPeImportClosure,MAX_PE_BYTES};
