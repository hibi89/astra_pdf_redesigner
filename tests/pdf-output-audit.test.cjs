'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');

test('Electron export preflight independently reads actual PDF pages and identifies A4 text/image content',async()=>{
  const {auditOutputPdf}=require('../desktop/pdf-output-audit.cjs');
  const {makeMixedLayoutPdf}=await import('./fixtures/step3-mixed-layout-pdf.mjs');
  const audit=await auditOutputPdf(makeMixedLayoutPdf());
  assert.equal(audit.pages,2);
  assert.equal(audit.checkedPages,2);
  assert.ok(audit.textItems>=13);
  assert.ok(audit.rasterDraws>=1);
  assert.deepEqual(audit.issues,[]);
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
