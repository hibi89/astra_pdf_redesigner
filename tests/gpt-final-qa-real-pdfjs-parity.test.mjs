import test from 'node:test';
import assert from 'node:assert/strict';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {makeMixedLayoutPdf} from './fixtures/step3-mixed-layout-pdf.mjs';
import {inspectRealPdfPair} from '../tools/gpt-final-qa-real-pdfjs-parity.mjs';

async function sourceText(bytes){
  const task=getDocument({data:new Uint8Array(bytes),useSystemFonts:true,disableFontFace:true});
  try{
    const document=await task.promise, pages=[];
    for(let n=1;n<=document.numPages;n++){
      const page=await document.getPage(n);
      pages.push((await page.getTextContent()).items.filter(x=>typeof x.str==='string').map(x=>x.str).join(' ').normalize('NFC').replace(/\s+/gu,' ').trim());
      page.cleanup();
    }
    return pages.join(' ');
  }finally{await task.destroy();}
}
async function run(output,changes={}) {
  const source=makeMixedLayoutPdf(1);
  return inspectRealPdfPair({
    sourcePdfBefore:source,sourcePdfAfter:changes.sourcePdfAfter??Buffer.from(source),
    outputPdf:output,importedText:changes.importedText??await sourceText(source),
    expectedTableRows:['TABLE_A_906','TABLE_C_908'],
  });
}
test('G002 actual PDF.js parses 2-page PDF with selectable table, vector and raster; no false acceptance',async()=>{
  const report=await run(makeMixedLayoutPdf(2));
  assert.equal(report.schema,'astra-g002-real-pdfjs-parity-v1');
  assert.equal(report.sourcePages,2);assert.equal(report.outputPages,2);
  assert.equal(report.rasterSource,1);assert.equal(report.rasterOutput,2);
  assert.ok(report.vectorSource>=1);
  assert.ok(report.issues.includes('RASTER_DRAW_COUNT_CHANGED'));
  assert.equal(report.humanApproval,'UNASSESSED');
  assert.equal(report.scoreDelta,0);
  assert.equal(report.release,'RELEASE HOLD');
});
test('G002 real identical PDFs cannot masquerade as a redesign',async()=>{
  const r=await run(makeMixedLayoutPdf(1));
  assert.ok(r.issues.includes('OUTPUT_IDENTICAL_TO_ORIGINAL_BYTES'));
  assert.ok(!r.issues.includes('SOURCE_OUTPUT_TEXT_DIFFERENCE'));
});
test('G002 actual PDF.js detects different page reading order despite preserved global tokens',async()=>{
  const raw=makeMixedLayoutPdf(1).toString('binary');
  assert.ok(raw.includes('/Kids [3 0 R 7 0 R]'));
  const swapped=Buffer.from(raw.replace('/Kids [3 0 R 7 0 R]','/Kids [7 0 R 3 0 R]'),'binary');
  const r=await run(swapped);
  assert.ok(r.issues.includes('SOURCE_OUTPUT_TEXT_DIFFERENCE'));
  assert.ok(r.issues.includes('PAGE_LEVEL_TEXT_REVIEW_REQUIRED'));
});
test('G002 actual PDF.js catches numeric token corruption in a table cell',async()=>{
  const raw=makeMixedLayoutPdf(1).toString('binary');
  assert.ok(raw.includes('TABLE_D_909'));
  const changed=Buffer.from(raw.replace('TABLE_D_909','TABLE_D_999'),'binary');
  const r=await run(changed);
  assert.ok(r.issues.includes('SOURCE_OUTPUT_TEXT_DIFFERENCE'));
  assert.ok(r.issues.includes('SOURCE_OUTPUT_NUMERIC_DIFFERENCE'));
});
test('G002 actual PDF.js counts missing raster draw separately from text preservation',async()=>{
  const r=await run(makeMixedLayoutPdf(0));
  assert.ok(r.issues.includes('RASTER_DRAW_COUNT_CHANGED'));
  assert.ok(!r.issues.includes('SOURCE_OUTPUT_TEXT_DIFFERENCE'));
});
test('G002 actual PDF.js detects A4 geometry loss',async()=>{
  const raw=makeMixedLayoutPdf(1).toString('binary');
  assert.ok(raw.includes('/MediaBox [0 0 595 842]'));
  const nonA4=Buffer.from(raw.replaceAll('/MediaBox [0 0 595 842]','/MediaBox [0 0 700 900]'),'binary');
  const r=await run(nonA4);
  assert.ok(r.issues.includes('OUTPUT_NOT_A4'));
});
test('G002 original source bytes changed after audit are reported',async()=>{
  const source=makeMixedLayoutPdf(1);
  const r=await run(makeMixedLayoutPdf(2),{sourcePdfAfter:Buffer.concat([source,Buffer.from('\n%tampered')])});
  assert.ok(r.issues.includes('ORIGINAL_PDF_BYTES_CHANGED'));
  assert.notEqual(r.sourcePdfSha256Before,r.sourcePdfSha256After);
});
test('G002 import snapshot mismatch is independently marked and does not disclose data',async()=>{
  const r=await run(makeMixedLayoutPdf(2),{importedText:'irrelevant content'});
  assert.ok(r.issues.includes('SOURCE_IMPORT_TEXT_DIFFERENCE'));
  assert.ok(r.issues.includes('SOURCE_IMPORT_NUMERIC_DIFFERENCE'));
  const serialized=JSON.stringify(r);
  assert.ok(!serialized.includes('RUNNING_HEADER_P1_914'));
  assert.ok(!serialized.includes('irrelevant content'));
  assert.equal(r.importTextProvenance,'CALLER_ASSERTION_NOT_AUTHENTICATED');
});
test('G002 malformed PDF with plausible header fails closed, never receives passing report',async()=>{
  const source=makeMixedLayoutPdf(1);
  await assert.rejects(inspectRealPdfPair({
    sourcePdfBefore:source,sourcePdfAfter:Buffer.from(source),
    outputPdf:Buffer.from('%PDF-1.7\nthis is not a real document\n'),
    importedText:await sourceText(source),
  }),/G002_PDF_PARSING_OR_LIMIT_FAILED/);
});
test('G002 missing imported text cannot be silently treated as independently verified',async()=>{
  const source=makeMixedLayoutPdf(1);
  await assert.rejects(inspectRealPdfPair({
    sourcePdfBefore:source,sourcePdfAfter:Buffer.from(source),
    outputPdf:makeMixedLayoutPdf(2),
  }),/G002_IMPORTED_TEXT_REQUIRED/);
});


test('G002 real PDF.js flags reordered vector-table cells even when every cell value exists',async()=>{
  const raw=makeMixedLayoutPdf(1).toString('binary');
  assert.ok(raw.includes('TABLE_A_906')&&raw.includes('TABLE_C_908'));
  const swapped=Buffer.from(raw.replace('TABLE_A_906','__TABLE_TMP')
    .replace('TABLE_C_908','TABLE_A_906').replace('__TABLE_TMP','TABLE_C_908'),'binary');
  const r=await run(swapped);
  assert.ok(r.issues.includes('TABLE_ROW_ORDER_OR_MULTIPLICITY_RISK'));
  assert.ok(r.issues.includes('SOURCE_OUTPUT_TEXT_DIFFERENCE'));
});
test('G002 actual PDF.js detects clipped output glyphs before a human visually accepts A4',async()=>{
  const raw=makeMixedLayoutPdf(1).toString('binary');
  assert.ok(raw.includes('333 713 Td'));
  const moved=Buffer.from(raw.replace('333 713 Td','550 713 Td'),'binary');
  const r=await run(moved);
  assert.ok(r.issues.includes('OUTPUT_TEXT_OVERFLOW'));
  assert.equal(r.humanApproval,'UNASSESSED');
});


test('G002 reports PDF.js unmapped U+0000 glyph as critical manual risk, not a passing comparison',async()=>{
  const source=makeMixedLayoutPdf(1);
  const original=await sourceText(source);
  const report=await inspectRealPdfPair({
    sourcePdfBefore:source,sourcePdfAfter:Buffer.from(source),
    outputPdf:makeMixedLayoutPdf(2),importedText:original+'\u0000',
  });
  assert.ok(report.issues.includes('PDFJS_IMPORTED_NUL_GLYPH_REVIEW_REQUIRED'));
  assert.ok(report.issues.includes('SOURCE_IMPORT_TEXT_DIFFERENCE'));
  assert.equal(report.status,'POTENTIAL_DIFFERENCES_REQUIRE_MANUAL_REVIEW');
  assert.equal(report.scoreDelta,0);
  assert.equal(report.release,'RELEASE HOLD');
  assert.ok(!JSON.stringify(report).includes('STEP3_SOURCE_P1_BEGIN_901'));
});
