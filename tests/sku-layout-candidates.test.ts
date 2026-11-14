import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {SKU_LAYOUT_CANDIDATES,skuLayoutCandidate} from '../src/step4/skuLayoutCandidates.ts';

test('P89 8 BASIC preserved plus 12 PRO and 10 BUSINESS print-only candidates',()=>{
 assert.equal(SKU_LAYOUT_CANDIDATES.length,22);
 assert.equal(SKU_LAYOUT_CANDIDATES.filter(l=>l.tier==='pro').length,12);
 assert.equal(SKU_LAYOUT_CANDIDATES.filter(l=>l.tier==='business').length,10);
 assert.equal(new Set(SKU_LAYOUT_CANDIDATES.map(l=>l.id)).size,22);
 assert.equal(new Set(SKU_LAYOUT_CANDIDATES.map(l=>l.family)).size,11);
 assert.equal(new Set(SKU_LAYOUT_CANDIDATES.map(l=>JSON.stringify([l.family,l.topMarginMm,l.sideMarginMm,l.alignment,l.titleEm]))).size,22);
 for(const layout of SKU_LAYOUT_CANDIDATES)assert.deepEqual(skuLayoutCandidate(layout.id),layout);
 assert.equal(skuLayoutCandidate('report'),undefined);
 assert.equal(skuLayoutCandidate('../pro-01'),undefined);
 assert.equal(skuLayoutCandidate('business-11'),undefined);
});
test('P89 new print classes exist and no persistent DesignSettings or document schema touched',()=>{
 const css=fs.readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 for(const l of SKU_LAYOUT_CANDIDATES){
   assert.ok(css.includes('.project-paper.paper-advanced-'+l.id+' .document-heading'),l.id);
   assert.ok(css.includes('@media print{.project-paper.paper-advanced-'+l.id),l.id);
 }
 const module=fs.readFileSync(new URL('../src/step4/skuLayoutCandidates.ts',import.meta.url),'utf8');
 assert.doesNotMatch(module,/indexedDB|localStorage|network|fetch\(/);
});
