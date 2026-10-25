// M08-A independent on-disk PDF.js audit of eight PDFs printed by the
// installed Windows Electron app, not DOM or CSS-only state assertions.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname,basename,join} from 'node:path';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {auditPdfBytes} from './pdf-integrity-audit.mjs';

const expected=['report','minimal','diary','compact','editorial','ledger','brief','folio'];
const input=process.argv[2];
assert.equal(process.env.GITHUB_ACTIONS,'true','Only CI synthetic content is supported');
assert.equal(process.platform,'win32','Expected actual installed Windows runner');
assert.ok(input&&process.env.RUNNER_TEMP,'Missing isolated eight-layout directory');
const folder=resolve(input),root=resolve(process.env.RUNNER_TEMP);
assert.equal(dirname(folder),root,'Folder must be directly under runner temp');
assert.match(basename(folder),/^astra-step3-layouts-[A-Za-z0-9-]+$/i);
const manifest=JSON.parse(readFileSync(join(folder,'manifest.json'),'utf8'));
assert.deepEqual(manifest.themes,expected,'All eight template IDs must be accounted for');
assert.ok(typeof manifest.title==='string'&&manifest.title.length>0,'Missing original output title');
assert.deepEqual(readdirSync(folder).sort(),
  [...expected.map(id=>'astra-'+id+'.pdf'),'manifest.json'].sort(),
  'Refuse missing or extra files in eight-template acceptance directory');

const signatures=[];
const markers=['ASTRA_PDF_PAGE_ONE_7401','한글문서검증','12345',
  'ASTRA_PDF_PAGE_TWO_7402','마지막페이지확인','67890'];
for(const theme of expected){
  const file=join(folder,'astra-'+theme+'.pdf');
  const buffer=readFileSync(file);
  assert.ok(buffer.length>3000&&buffer.subarray(0,5).toString('ascii')==='%PDF-',
    'Invalid native Windows PDF '+theme);
  const audit=await auditPdfBytes(buffer,{markers,requireRaster:true,
    label:'M08-A installed '+theme,maxPages:15});
  assert.equal(audit.skippedRotation,0,'Unverified rotated output text: '+theme);
  const task=getDocument({data:new Uint8Array(buffer),useSystemFonts:true});
  try{
    const document=await task.promise;
    const firstPage=await document.getPage(1);
    const items=(await firstPage.getTextContent()).items.filter(x=>typeof x.str==='string');
    const heading=manifest.title.normalize('NFC').replace(/\s+/g,'');
    const item=items.find(x=>x.str.normalize('NFC').replace(/\s+/g,'')===heading);
    assert.ok(item,'First-page identical source heading must be printable: '+theme+' / '+heading);
    const [a,b,c,d,x,y]=item.transform;
    assert.ok([a,b,c,d,x,y,item.width].every(Number.isFinite),'Nonfinite heading transform: '+theme);
    assert.ok(Math.abs(b)<.05&&Math.abs(c)<.05,'Rotated heading not audited: '+theme);
    assert.ok(x>=0&&x+item.width<=595.3&&y>0&&y<841.9,'Heading outside A4: '+theme);
    const signature=[x,y,item.width].map(v=>Math.round(v/3));
    signatures.push({theme,signature});
    console.log('PASS M08-A WINDOWS LAYOUT',theme,JSON.stringify({
      pages:audit.pages,markers:audit.markers,raster:audit.rasterDraws,
      titleX:x,titleY:y,titleWidth:item.width,signature}));
  }finally{await task.destroy();}
}
for(let i=0;i<signatures.length;i++)for(let j=i+1;j<signatures.length;j++)
  assert.ok(signatures[i].signature.some((v,k)=>v!==signatures[j].signature[k]),
    'Windows print geometry equal (not eight distinct layouts): '+
    signatures[i].theme+' and '+signatures[j].theme);
assert.equal(signatures.length,8);
console.log('PASS M08-A INSTALLED WINDOWS 8/8 DIFFERENT A4 OUTPUTS: PDF.js read-back, exact original markers and image, unique title geometry');
