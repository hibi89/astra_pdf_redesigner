'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');

test('Electron export preflight independently reads actual PDF pages and identifies A4 text/image content',async()=>{
  const {auditOutputPdf}=require('../desktop/pdf-output-audit.cjs');
  const {makeMixedLayoutPdf,MIXED_LAYOUT_MARKERS}=await import('./fixtures/step3-mixed-layout-pdf.mjs');
  const audit=await auditOutputPdf(makeMixedLayoutPdf(),MIXED_LAYOUT_MARKERS,1);
  assert.equal(audit.pages,2);
  assert.equal(audit.checkedPages,2);
  assert.ok(audit.textItems>=13);
  assert.ok(audit.rasterDraws>=1);
  assert.equal(audit.expected,MIXED_LAYOUT_MARKERS.length);
  assert.equal(audit.found,MIXED_LAYOUT_MARKERS.length);
  assert.deepEqual(audit.missing,[]);
  assert.deepEqual(audit.issues,[]);
});

test('Electron export preflight flags source text markers missing from actual PDF output',async()=>{
  const {auditOutputPdf}=require('../desktop/pdf-output-audit.cjs');
  const {makeMixedLayoutPdf}=await import('./fixtures/step3-mixed-layout-pdf.mjs');
  const audit=await auditOutputPdf(makeMixedLayoutPdf(),[
    'STEP3_SOURCE_P1_BEGIN_901','EXPECTED_SOURCE_TEXT_MISSING_992',
  ]);
  assert.equal(audit.found,1);
  assert.deepEqual(audit.missing,['EXPECTED_SOURCE_TEXT_MISSING_992']);
  assert.ok(audit.issues.some(issue=>issue.includes('텍스트 표식 1/2개')));
});

test('Electron export preflight flags image placements missing from actual PDF output',async()=>{
  const {auditOutputPdf}=require('../desktop/pdf-output-audit.cjs');
  const {makeMixedLayoutPdf}=await import('./fixtures/step3-mixed-layout-pdf.mjs');
  const source=makeMixedLayoutPdf().toString('binary');
  const withoutImage=source.replace('/Im1 Do','       ');
  assert.notEqual(withoutImage,source,'Fixture must omit its one image paint operator');
  const audit=await auditOutputPdf(Buffer.from(withoutImage,'binary'),[],1);
  assert.equal(audit.rasterDraws,0);
  assert.ok(audit.issues.some(issue=>issue.includes('문서 이미지 1개 중 출력 PDF에서 래스터 이미지 0개')));
});

test('Electron export preflight compares all expected image blocks instead of only checking zero output images',async()=>{
  const {auditOutputPdf}=require('../desktop/pdf-output-audit.cjs');
  const {makeMixedLayoutPdf}=await import('./fixtures/step3-mixed-layout-pdf.mjs');
  const audit=await auditOutputPdf(makeMixedLayoutPdf(),[],2);
  assert.equal(audit.rasterDraws,1);
  assert.ok(audit.issues.some(issue=>issue.includes('문서 이미지 2개 중 출력 PDF에서 래스터 이미지 1개')));
});

test('Electron export preflight also warns when raster output exceeds image block count',async()=>{
  const {auditOutputPdf}=require('../desktop/pdf-output-audit.cjs');
  const {makeMixedLayoutPdf}=await import('./fixtures/step3-mixed-layout-pdf.mjs');
  const audit=await auditOutputPdf(makeMixedLayoutPdf(2),[],1);
  assert.equal(audit.rasterDraws,2);
  assert.ok(audit.issues.some(issue=>issue.includes('문서 이미지 블록 1개보다 출력 PDF의 래스터 이미지 연산 2개가 많습니다')));
});

test('Electron export preflight warns about non-A4 pages and text extending outside page bounds',async()=>{
  const {auditOutputPdf}=require('../desktop/pdf-output-audit.cjs');
  const {makeMixedLayoutPdf}=await import('./fixtures/step3-mixed-layout-pdf.mjs');
  const source=makeMixedLayoutPdf().toString('binary');
  const nonA4=source.replaceAll('/MediaBox [0 0 595 842]','/MediaBox [0 0 700 900]');
  const sizeAudit=await auditOutputPdf(Buffer.from(nonA4,'binary'));
  assert.ok(sizeAudit.issues.some(issue=>issue.includes('A4와 다릅니다')));
  const outside=source.replace('333 713 Td','550 713 Td');
  const extentAudit=await auditOutputPdf(Buffer.from(outside,'binary'));
  assert.ok(extentAudit.issues.some(issue=>issue.includes('페이지 밖으로 벗어난 텍스트')));
});
