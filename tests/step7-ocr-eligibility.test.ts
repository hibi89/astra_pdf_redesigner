import test from 'node:test';
import assert from 'node:assert/strict';
import {pageNeedsOcr} from '../src/step7/ocrEligibility.ts';

test('OCR can propose work on scan-only pages without selectable text',()=>{
 assert.equal(pageNeedsOcr([]),true);
 assert.equal(pageNeedsOcr([{str:''},{str:'   \n'}]),true);
});
test('OCR refuses text, digits, mixed selectable content and invalid metadata',()=>{
 assert.equal(pageNeedsOcr([{str:'보고서'}]),false);
 assert.equal(pageNeedsOcr([{str:'\t'},{str:'2026'}]),false);
 assert.equal(pageNeedsOcr([{str:'Scanned image'},{str:''}]),false);
 assert.equal(pageNeedsOcr([{str:undefined}]),true);
 assert.equal(pageNeedsOcr(null as unknown as []),false);
});
