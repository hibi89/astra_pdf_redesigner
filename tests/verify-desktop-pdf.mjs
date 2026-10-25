// Validate the *actual PDF file produced by the installed Windows Electron
// executable*. Never validate a synthetic stand-in PDF.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {getDocument,OPS} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {auditPdfBytes} from './pdf-integrity-audit.mjs';

const source=process.argv[2];
const realStep2=process.argv.includes('--step2-project');
const importedStep3=process.argv.includes('--step3-import');
assert.ok(!(realStep2&&importedStep3),'Specify exactly one acceptance variant');
if(!source||process.env.GITHUB_ACTIONS!=='true'){
  throw Error('PDF acceptance requires a generated file path on GitHub Actions');
}
const data=readFileSync(resolve(source));
assert.ok(data.length>3000,'PDF must contain meaningful content');
assert.equal(data.subarray(0,5).toString('ascii'),'%PDF-','Output is not a PDF file');
const task=getDocument({data:new Uint8Array(data),useSystemFonts:true});
try{
  const doc=await task.promise;
  if(realStep2||importedStep3)assert.ok(doc.numPages>=1&&doc.numPages<=15,'Imported document must yield 1-15 A4 pages');
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
  }else if(importedStep3){
    const tokens=['ASTRA_PDF_PAGE_ONE_7401','ASTRA_PDF_PAGE_TWO_7402',
      '한글문서검증','마지막페이지확인','12345','67890'];
    const combined=normalized.join('');
    for(const marker of tokens){
      assert.equal(combined.split(marker).length-1,1,
        'STEP3 import/export marker missing or duplicated: '+marker);
    }
    assert.ok(combined.indexOf('ASTRA_PDF_PAGE_ONE_7401')<
      combined.indexOf('ASTRA_PDF_PAGE_TWO_7402'),'STEP3 imported source order changed');
    assert.ok(!combined.includes('STEP 3 · 기존 PDF 가져오기'),
      'Editor UI leaked into installed STEP3 PDF');
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
  if(!importedStep3)assert.ok(bitmapDraws>=1,'Printed image does not appear in PDF operator list');
  // M04 second-pass audit: media-box geometry, source marker parity/order and
  // actual Windows output raster, independent of the first PDF.js text pass.
  const m04Expected=importedStep3?
    ['ASTRA_PDF_PAGE_ONE_7401','한글문서검증','12345',
      'ASTRA_PDF_PAGE_TWO_7402','마지막페이지확인','67890']:
    realStep2?
    ['ASTRA_STEP2_PRINT_8307','ASTRA_STEP2_BODY_8308',
      'ASTRA_STEP2_CAPTION_8309']:
    ['ASTRA_PDF_PAGE_ONE_7401','한글문서검증','12345',
      'ASTRA_PDF_PAGE_TWO_7402','마지막페이지확인','67890'];
  const m04=await auditPdfBytes(data,{markers:m04Expected,requireRaster:true,
    label:importedStep3?'M04 installed imported PDF':'M04 installed native PDF'});
  assert.equal(m04.skippedRotation,0,'Rotated text requires separate review');
  console.log('PASS M04 INSTALLED PDF AUDIT:',m04);
  console.log(importedStep3
    ?'PASS ASTRA INSTALLED STEP3 PDF CONTENT: native A4 pages='+doc.numPages+', six source markers verified, raster draw '+bitmapDraws
    :realStep2
    ?'PASS ASTRA INSTALLED STEP2 PDF CONTENT: A4 pages='+doc.numPages+', persisted Korean/numeric markers 5/5, raster draw '+bitmapDraws
    :'PASS ASTRA INSTALLED PDF CONTENT: A4 x 2, Korean/numeric markers 6/6, raster draw '+bitmapDraws);
}finally{
  await task.destroy();
}
