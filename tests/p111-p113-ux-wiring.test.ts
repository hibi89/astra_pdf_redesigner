import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('P113 STEP7 manual visual parity retains only volatile object URLs and no project writes',()=>{
 const panel=read('src/step7/LocalOcrPanel.tsx');
 for(const required of ['data-step7-ocr-side-by-side','data-step7-ocr-manual-checks',
  'data-step7-ocr-manual-status','URL.createObjectURL(blob)','URL.revokeObjectURL(previewUrl)',
  'numbers:false,meaning:false,layout:false'])assert.ok(panel.includes(required),required);
 assert.ok(!panel.includes('localStorage.setItem('));
 assert.ok(!panel.includes('indexedDB.open('));
});
test('P112 STEP6 source record initiates manually selected STEP5 file, never arbitrary URL fetch',()=>{
 const source=read('src/step6/SourceRecordsPanel.tsx');
 const workspace=read('src/step2/Workspace.tsx');
 for(const key of ['data-step6-source-to-step5','onAnalyzeLocalFile(item)'])assert.ok(source.includes(key),key);
 for(const key of ['pendingReferenceSource.current=source','referenceInput.current?.click()','setLinkedReferenceSource(source?.title??null)','data-step6-linked-reference'])assert.ok(workspace.includes(key),key);
 assert.ok(!source.includes('fetch('));
});
test('P112 BUSINESS batch brand plan applies only in-memory to preview and actual save decision',()=>{
 const workspace=read('src/step2/Workspace.tsx');
 for(const key of ['data-business-batch-target','data-business-batch-apply','data-business-batch-clear',
  'makeBrandBatchPlan(w.documents.map(item=>item.id)','brandBatchPlan[doc.id]',
  'brandKit={activeBrandKit}','pdfExportCapabilities(activeAdvancedLayoutId,Boolean(activeBrandKit))'])
  assert.ok(workspace.includes(key),key);
 assert.ok(!read('src/step4/brandBatchPlan.ts').includes('localStorage'));
});
test('P111 model UI uses only explicit opt-in and differs from the existing rules editor',()=>{
 const workspace=read('src/step2/Workspace.tsx');
 assert.ok(workspace.includes('<RuleReview text={block.text}'));
 assert.ok(workspace.includes('<LocalModelReview text={block.text}'));
 const panel=read('src/humanize/LocalModelReview.tsx');
 assert.ok(panel.includes('fn(before,true)'));
 assert.ok(panel.includes('data-local-ai-before'));
 assert.ok(panel.includes('data-local-ai-after'));
 assert.ok(panel.includes('data-local-ai-undo'));
});
