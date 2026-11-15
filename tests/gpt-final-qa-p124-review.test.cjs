'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {reviewP124Source}=require('../tools/gpt-final-qa-p124-review.cjs');
const PIN='6e8b2eeb381874a12be041fa080fb545b5e1fb82';
function checkoutFixture() {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'astra-g003-'));
  const files={
    'tests/fixtures/p124-electron-qwen3.jsx':"import LocalModelReview from '../../src/humanize/LocalModelReview.tsx';\nconst [sku,setSku] = useState('BASIC');\n<div data-p124-sku>Test-only SKU context</div>\n<LocalModelReview disabled={false} />",
    'desktop/p124-electron-qwen3-acceptance.cjs':"if(proposalCases.length>=10){}; click('[data-local-ai-undo]');click('[data-local-ai-cancel]'); printPdf(); readPdfText()",
    'desktop/main.cjs':"const p124=require('./p124-electron-qwen3-acceptance.cjs')",
    'electron-builder.yml':"files:\n  - dist/**\n  - desktop/**\n  - package.json\n",
    '.github/workflows/p124-windows-qwen3-electron.yml':
      "P124_MODEL_SHA256: eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee\n"+
      "if (Test-Path 'dist/tests/fixtures/p124-electron-qwen3.html')",
    'src/step2/Workspace.tsx':"import LocalModelReview from '../humanize/LocalModelReview.tsx'",
  };
  for(const [name,body] of Object.entries(files)){
    const target=path.join(root,name);
    fs.mkdirSync(path.dirname(target),{recursive:true});
    fs.writeFileSync(target,body);
  }
  return{root,pathFor:p=>path.join(root,p),close:()=>fs.rmSync(root,{recursive:true,force:true,maxRetries:2})};
}
test('G003 distinguishes production review component from fixture-only SKU entitlement',t=>{
  const f=checkoutFixture();t.after(f.close);
  const report=reviewP124Source(f.root,PIN);
  assert.equal(report.pinnedCodexSha,PIN);
  assert.equal(report.verdict,'REVIEW_REQUIRED');
  assert.ok(report.risks.includes('C001_TEST_SKU_LABELS_DO_NOT_EXERCISE_PRODUCT_ENTITLEMENTS'));
  assert.equal(report.customerProductSkuE2E,'NOT_VERIFIED');
  assert.equal(report.scoreDelta,0);
  assert.equal(report.release,'RELEASE HOLD');
});
test('G003 detects production packaging of statically imported desktop acceptance harness',t=>{
  const f=checkoutFixture();t.after(f.close);
  assert.ok(reviewP124Source(f.root,PIN).risks.includes('P124_TEST_HARNESS_IN_PRODUCTION_DESKTOP_BUNDLE'));
});
test('G003 differentiates missing model pin from ordinary review requirements',t=>{
  const f=checkoutFixture();t.after(f.close);
  fs.writeFileSync(f.pathFor('.github/workflows/p124-windows-qwen3-electron.yml'),'name: altered\n');
  const r=reviewP124Source(f.root,PIN);
  assert.ok(r.risks.includes('P124_ACCEPTANCE_ASSERTION_OR_PIN_MISSING'));
  assert.equal(r.scoreDelta,0);
});
test('G003 never infers real model execution from static assertions',t=>{
  const f=checkoutFixture();t.after(f.close);
  assert.equal(reviewP124Source(f.root,PIN).modelExecution,'NOT_VERIFIED_BY_THIS_TOOL');
});
test('G003 rejects unfixed, synthetic or malformed commit IDs',t=>{
  const f=checkoutFixture();t.after(f.close);
  for(const sha of ['main','abcdef','f'.repeat(41),null])assert.throws(()=>reviewP124Source(f.root,sha),/INVALID_PINNED_SHA/);
});
test('G003 refuses symlinked source files instead of following outside checkout',t=>{
  const f=checkoutFixture();t.after(f.close);
  const file=f.pathFor('desktop/main.cjs'),target=f.pathFor('main-backup.cjs');
  fs.renameSync(file,target);
  try{fs.symlinkSync(target,file,'file');}catch(error){if(process.platform==='win32'&&error.code==='EPERM')return;throw error;}
  assert.throws(()=>reviewP124Source(f.root,PIN),/UNSAFE_REVIEW_FILE/);
});
