// Validate the actual PDF emitted by the app's Electron renderer. CI checks
// the installed Windows executable; local visual review is restricted to the
// explicit synthetic fixture and an isolated OS temp path.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {basename,dirname,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {getDocument,OPS} from 'pdfjs-dist/legacy/build/pdf.mjs';

const source=process.argv[2];
const realStep2=process.argv.includes('--step2-project');
const localSynthetic=process.argv.includes('--local-synthetic');
if(!source||(!localSynthetic&&process.env.GITHUB_ACTIONS!=='true')){
  throw Error('PDF acceptance requires a generated GitHub Actions file or explicit local synthetic mode');
}
const resolvedSource=resolve(source);
if(localSynthetic){
  assert.equal(dirname(resolvedSource),resolve(tmpdir()),
    'Local synthetic PDF must live directly in the OS temp folder');
  assert.match(basename(resolvedSource),/^astra-p5-pdf-visual-[A-Za-z0-9-]+\.pdf$/i,
    'Local synthetic PDF filename is outside the acceptance guard');
}
const data=readFileSync(resolvedSource);
assert.ok(data.length>3000,'PDF must contain meaningful content');
assert.equal(data.subarray(0,5).toString('ascii'),'%PDF-','Output is not a PDF file');
const task=getDocument({data:new Uint8Array(data),useSystemFonts:true});
try{
  const doc=await task.promise;
  if(realStep2)assert.equal(doc.numPages,3,'Synthetic STEP2 document should print across exactly three A4 pages');
  else assert.equal(doc.numPages,2,'Synthetic document must print on exactly two pages');
  const text=[];
  let bitmapDraws=0;
  for(let number=1;number<=doc.numPages;number++){
    const page=await doc.getPage(number);
    const viewport=page.getViewport({scale:1});
    assert.ok(Math.abs(viewport.width-595.276)<2,
      'PDF page '+number+' must be A4 width, actual '+viewport.width);
    assert.ok(Math.abs(viewport.height-841.89)<2,
      'PDF page '+number+' must be A4 height, actual '+viewport.height);
    const extracted=(await page.getTextContent()).items
      .filter(item=>'str' in item).map(item=>item.str).join(' ').normalize('NFC');
    text.push(extracted);
    const operations=(await page.getOperatorList()).fnArray;
    bitmapDraws+=operations.filter(code=>[
      OPS.paintImageXObject,OPS.paintInlineImageXObject,
      OPS.paintImageXObjectRepeat,OPS.paintInlineImageXObjectGroup,
    ].includes(code)).length;
  }
  const normalized=text.map(value=>value.replace(/\s+/g,''));
  if(realStep2){
    const tokens=['ASTRA_STEP2_PRINT_8307','ASTRA_STEP2_BODY_8308',
      'ASTRA_STEP2_CAPTION_8309','한글프로젝트확인','24680'];
    for(const marker of tokens){
      assert.equal(normalized.join('').split(marker).length-1,1,
        'STEP2 persisted document marker missing or duplicated: '+marker);
    }
    assert.ok(!normalized.join('').includes('ASTRA_LIBRARY_ONLY_8310'),
      'Document library/editor UI leaked into printed PDF');
  }else{
    const tokens=[
      'ASTRA_PDF_PAGE_ONE_7401',
      'ASTRA_PDF_PAGE_TWO_7402',
      '한글문서검증',
      '마지막페이지확인',
      '12345','67890',
    ];
    for(const marker of tokens){
      const occurrences=normalized.join('').split(marker).length-1;
      assert.equal(occurrences,1,'Missing/duplicated Korean or numeric token: '+marker);
    }
    assert.ok(normalized[0].includes('ASTRA_PDF_PAGE_ONE_7401'),
      'First page marker absent from PDF page 1');
    assert.ok(normalized[1].includes('ASTRA_PDF_PAGE_TWO_7402'),
      'Second page marker absent from PDF page 2');
    assert.ok(!normalized[0].includes('ASTRA_PDF_PAGE_TWO_7402'),
      'Page 2 content leaked into page 1');
  }
  assert.ok(bitmapDraws>=1,'Printed image does not appear in PDF operator list');
  console.log(realStep2
    ?'PASS ASTRA INSTALLED STEP2 PDF CONTENT: A4 pages='+doc.numPages+', persisted Korean/numeric markers 5/5, raster draw '+bitmapDraws
    :'PASS ASTRA INSTALLED PDF CONTENT: A4 x 2, Korean/numeric markers 6/6, raster draw '+bitmapDraws);
}finally{
  await task.destroy();
}
