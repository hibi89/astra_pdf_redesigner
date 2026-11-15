import test from 'node:test';
import assert from 'node:assert/strict';
import {makeMixedLayoutPdf,MIXED_LAYOUT_MARKERS} from './fixtures/step3-mixed-layout-pdf.mjs';
import {compareSyntheticPdfCrossEngine} from '../tools/gpt-final-qa-pdf-cross-parser.mjs';

test('G002 Poppler and PDF.js recover synthetic original markers with no hidden marker text',async()=>{
 const original=makeMixedLayoutPdf(1);
 const r=await compareSyntheticPdfCrossEngine({
   sourcePdf:original,outputPdf:makeMixedLayoutPdf(2),
   expectedMarkers:[...MIXED_LAYOUT_MARKERS],
 });
 assert.equal(r.schema,'astra-g002-cross-parser-synthetic-v1');
 assert.equal(r.sourcePages,2);
 assert.equal(r.sourceMarkersPresentBoth,MIXED_LAYOUT_MARKERS.length);
 assert.equal(r.sourceMissingBothParsers,0);
 assert.equal(r.outputMarkersPresentBoth,MIXED_LAYOUT_MARKERS.length);
 assert.equal(r.outputMissingBothParsers,0);
 assert.equal(r.outputPdfjsNul,0);
 assert.equal(r.outputPopplerNul,0);
 assert.equal(r.scoreDelta,0);
 assert.equal(r.ownerApproval,'NOT_GRANTED');
 assert.equal(r.release,'RELEASE HOLD');
 for(const marker of MIXED_LAYOUT_MARKERS)
   assert.equal(JSON.stringify(r).includes(marker),false,'Never output source token text');
});
test('G002 cross-parser finds changed synthetic table numeric marker',async()=>{
 const original=makeMixedLayoutPdf(1);
 const altered=Buffer.from(original.toString('binary').replace('TABLE_D_909','TABLE_D_999'),'binary');
 const r=await compareSyntheticPdfCrossEngine({
   sourcePdf:original,outputPdf:altered,expectedMarkers:[...MIXED_LAYOUT_MARKERS],
 });
 assert.equal(r.sourceMarkersPresentBoth,MIXED_LAYOUT_MARKERS.length);
 assert.equal(r.outputMarkersPresentBoth,MIXED_LAYOUT_MARKERS.length-1);
 assert.equal(r.outputMissingBothParsers,1);
 assert.ok(r.issues.includes('OUTPUT_MARKERS_MISSING_BOTH_PARSERS'));
 assert.equal(r.numericSemanticFidelity,'NOT_CERTIFIED');
});
test('G002 cross-parser reports local-only source/output fingerprint without altering original',async()=>{
 const original=makeMixedLayoutPdf(1),sourceBytes=Buffer.from(original);
 const r=await compareSyntheticPdfCrossEngine({
   sourcePdf:sourceBytes,outputPdf:makeMixedLayoutPdf(2),expectedMarkers:['TABLE_A_906'],
 });
 assert.deepEqual(sourceBytes,original);
 assert.notEqual(r.sourceSha256,r.outputSha256);
 assert.equal(r.externalTransfer,false);
 assert.equal(r.filesModified,false);
 assert.equal(r.actualVisualLoss,'UNASSESSED');
});
test('G002 cross-parser refuses malformed PDF and overlong untrusted marker lists',async()=>{
 const valid=makeMixedLayoutPdf(1);
 await assert.rejects(compareSyntheticPdfCrossEngine({
   sourcePdf:valid,outputPdf:Buffer.from('%PDF-1.7\nnot really PDF but header present\n'),
   expectedMarkers:['TABLE_D_909'],
 }),/G002_CROSS_ENGINE_EVIDENCE_BLOCKED/);
 await assert.rejects(compareSyntheticPdfCrossEngine({
   sourcePdf:valid,outputPdf:valid,expectedMarkers:['TABLE_D_909','TABLE_D_909'],
 }),/G002_CROSS_ENGINE_EVIDENCE_BLOCKED/);
 await assert.rejects(compareSyntheticPdfCrossEngine({
   sourcePdf:valid,outputPdf:valid,expectedMarkers:['private name'],
 }),/G002_CROSS_ENGINE_EVIDENCE_BLOCKED/);
});
test('G002 cross-parser never equates two extractors agreeing with visual fidelity',async()=>{
 const original=makeMixedLayoutPdf(1);
 const r=await compareSyntheticPdfCrossEngine({
   sourcePdf:original,outputPdf:Buffer.from(original),
   expectedMarkers:['LEFT_ALPHA_902','TABLE_D_909'],
 });
 assert.equal(r.outputMarkersPresentBoth,2);
 assert.equal(r.actualVisualLoss,'UNASSESSED');
 assert.equal(r.numericSemanticFidelity,'NOT_CERTIFIED');
 assert.equal(r.status,'CROSS_PARSER_RISK_REPORT_NOT_FIDELITY_CERTIFICATION');
});
