'use strict';
// G003 read-only evidence classification of a pinned Codex P124 checkout.
// This is a structural reviewer, NOT a real Qwen3/Windows/3-SKU product E2E.
const fs=require('node:fs');
const path=require('node:path');
const SHA=/^[0-9a-f]{40}$/;
function read(root,rel) {
  if (!root || !rel || rel.includes('..') || rel.startsWith('/') || rel.includes('\\')) throw Error('INVALID_REVIEW_PATH');
  const file=path.join(root,rel),stat=fs.lstatSync(file);
  if(!stat.isFile()||stat.isSymbolicLink()||stat.size>512000)throw Error('UNSAFE_REVIEW_FILE');
  return fs.readFileSync(file,'utf8');
}
function reviewP124Source(root,sha) {
  if(typeof sha!=='string'||!SHA.test(sha))throw Error('INVALID_PINNED_SHA');
  const fixture=read(root,'tests/fixtures/p124-electron-qwen3.jsx');
  const run=read(root,'desktop/p124-electron-qwen3-acceptance.cjs');
  const main=read(root,'desktop/main.cjs');
  const pack=read(root,'electron-builder.yml');
  const workflow=read(root,'.github/workflows/p124-windows-qwen3-electron.yml');
  const sourceWorkspace=read(root,'src/step2/Workspace.tsx');
  const assertions = {
    productionReviewComponentImportedByFixture:fixture.includes("from '../../src/humanize/LocalModelReview.tsx'"),
    syntheticSkuSelector:fixture.includes("data-p124-sku") && fixture.includes("useState('BASIC')") &&
      fixture.includes('Test-only SKU context'),
    fixtureBypassesProductEntitlement:fixture.includes('disabled={false}') &&
      !fixture.includes('CommercialLicensePanel') && !fixture.includes('runSkuGatedAction'),
    productionWorkspaceHasModelReview:sourceWorkspace.includes('LocalModelReview'),
    acceptanceChecksRealModelProposalMinimum:/proposalCases\.length>=10/.test(run),
    acceptanceChecksUndoAndCancel:run.includes('[data-local-ai-undo]')&&run.includes('[data-local-ai-cancel]'),
    acceptanceChecksPdfSourceText:run.includes('printPdf(')&&run.includes('readPdfText('),
    runnerWorkflowPinsModelHash:workflow.includes('P124_MODEL_SHA256: eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee'),
    fixtureExcludedFromStandardProductionViteOutput:workflow.includes("if (Test-Path 'dist/tests/fixtures/p124-electron-qwen3.html')"),
    desktopCodePackaged:pack.split(/\r?\n/).some(x=>/^\s*- desktop\/\*\*\s*$/.test(x)),
    acceptanceModuleStaticallyImportedByProductionMain:main.includes("require('./p124-electron-qwen3-acceptance.cjs')"),
  };
  const risk=[];
  if(assertions.syntheticSkuSelector&&assertions.fixtureBypassesProductEntitlement)
    risk.push('C001_TEST_SKU_LABELS_DO_NOT_EXERCISE_PRODUCT_ENTITLEMENTS');
  if(assertions.desktopCodePackaged&&assertions.acceptanceModuleStaticallyImportedByProductionMain)
    risk.push('P124_TEST_HARNESS_IN_PRODUCTION_DESKTOP_BUNDLE');
  if(!assertions.productionWorkspaceHasModelReview||!assertions.productionReviewComponentImportedByFixture)
    risk.push('PRODUCTION_REVIEW_COMPONENT_CHAIN_NOT_PROVEN');
  if(!assertions.acceptanceChecksRealModelProposalMinimum||!assertions.acceptanceChecksUndoAndCancel||
    !assertions.acceptanceChecksPdfSourceText||!assertions.runnerWorkflowPinsModelHash)
    risk.push('P124_ACCEPTANCE_ASSERTION_OR_PIN_MISSING');
  return {
    schema:'astra-g003-p124-static-review-v1',pinnedCodexSha:sha,
    verdict:risk.length?'REVIEW_REQUIRED':'STATIC_ONLY_NOT_APPROVED',
    risks:risk,assertions,
    conclusion:'Static inspection cannot prove model runtime, Windows installer, product SKU entitlement or true buyer acceptance.',
    customerProductSkuE2E:'NOT_VERIFIED',modelExecution:'NOT_VERIFIED_BY_THIS_TOOL',
    packageContentIndependentlyExtracted:'NOT_VERIFIED',release:'RELEASE HOLD',
    officialAcceptance:'UNASSESSED',scoreDelta:0,
  };
}
module.exports={reviewP124Source};
if(require.main===module){
  try{
    if(process.argv.length!==4)throw Error('Usage: node tools/gpt-final-qa-p124-review.cjs <read-only-codex-checkout> <full-commit-sha>');
    const result=reviewP124Source(path.resolve(process.argv[2]),process.argv[3]);
    process.stdout.write(JSON.stringify(result,null,2)+'\n');
    if(result.risks.includes('P124_ACCEPTANCE_ASSERTION_OR_PIN_MISSING')||
       result.risks.includes('PRODUCTION_REVIEW_COMPONENT_CHAIN_NOT_PROVEN'))process.exitCode=1;
  }catch(error){console.error('G003_REVIEW_FAILED:',error.message);process.exitCode=2;}
}
