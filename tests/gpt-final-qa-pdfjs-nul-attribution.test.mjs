import test from 'node:test';
import assert from 'node:assert/strict';
import {makeMixedLayoutPdf,MIXED_LAYOUT_MARKERS} from './fixtures/step3-mixed-layout-pdf.mjs';
import {
  inspectSyntheticPdfNulAttribution,compareSyntheticNulModes,
} from '../tools/gpt-final-qa-pdfjs-nul-attribution.mjs';

test('G002 NUL attribution counts synthetic source by font/page, not content',async()=>{
  const pdf=makeMixedLayoutPdf(1);
  const before=Buffer.from(pdf);
  const yes=await inspectSyntheticPdfNulAttribution(pdf,{useSystemFonts:true});
  const no=await inspectSyntheticPdfNulAttribution(pdf,{useSystemFonts:false});
  assert.deepEqual(pdf,before,'source bytes must not be rewritten');
  for(const r of [yes,no]){
    assert.equal(r.schema,'astra-g002-pdfjs-nul-attribution-v1');
    assert.equal(r.scope,'SYNTHETIC_QA_ONLY');
    assert.equal(r.pageCount,2);
    assert.ok(r.items>=MIXED_LAYOUT_MARKERS.length);
    assert.equal(r.nulGlyphs,0);
    assert.equal(r.nulItems,0);
    assert.equal(r.pages.reduce((n,p)=>n+p.nulGlyphs,0),r.nulGlyphs);
    assert.equal(r.pages.reduce((n,p)=>n+p.items,0),r.items);
    assert.equal(r.pages.reduce((n,p)=>n+p.characters,0),r.characters);
    for(const page of r.pages){
      assert.equal(page.fonts.reduce((n,f)=>n+f.items,0),page.items);
      assert.equal(page.fonts.reduce((n,f)=>n+f.nulGlyphs,0),page.nulGlyphs);
      assert.ok(page.fonts.every(f=>/^[a-f0-9]{16}$/.test(f.fontKey)));
    }
    const serialized=JSON.stringify(r);
    for(const marker of MIXED_LAYOUT_MARKERS){
      assert.equal(serialized.includes(marker),false,'no synthetic text in report');
    }
    assert.equal(r.sourceTextExposed,false);
    assert.equal(r.coordinatesExposed,false);
    assert.equal(r.numericSemanticFidelity,'NOT_CERTIFIED');
    assert.equal(r.visualFidelity,'UNASSESSED');
    assert.equal(r.scoreDelta,0);
    assert.equal(r.release,'RELEASE HOLD');
  }
  const comparison=compareSyntheticNulModes(yes,no);
  assert.equal(comparison.classification,'BOTH_FONT_OPTIONS_AGREE_NOT_PROOF_OF_FONT_CMAP');
  assert.equal(comparison.underlyingToUnicodeCause,'UNASSESSED');
  assert.equal(comparison.manualReviewRequired,false);
  assert.equal(comparison.release,'RELEASE HOLD');
});

test('G002 font-mode disagreement is never automatically cleared',async()=>{
  const pdf=makeMixedLayoutPdf(1);
  const yes=await inspectSyntheticPdfNulAttribution(pdf,{useSystemFonts:true});
  const no=await inspectSyntheticPdfNulAttribution(pdf,{useSystemFonts:false});
  const altered={...yes,nulGlyphs:10,pages:yes.pages.map((p,i)=>i===0?{...p,nulGlyphs:10}:p)};
  const out=compareSyntheticNulModes(altered,no);
  assert.equal(out.classification,'FONT_OPTION_SENSITIVE_EXTRACTION_REVIEW_REQUIRED');
  assert.equal(out.manualReviewRequired,true);
  assert.equal(out.numericSemanticFidelity,'NOT_CERTIFIED');
  assert.deepEqual(out.defaultModeNulPages,[1]);
  assert.equal(out.scoreDelta,0);
});

test('G002 NUL attribution rejects malformed bytes, unbounded size and invalid modes',async()=>{
  const pdf=makeMixedLayoutPdf(1);
  for(const value of [
    null,Buffer.from('not a pdf'),Buffer.alloc(32*1024*1024+1),
    Buffer.from('%PDF-1.7\nnot a valid document, but a long enough header\n'),
  ]){
    await assert.rejects(inspectSyntheticPdfNulAttribution(value),
      /G002_NUL_ATTRIBUTION_BLOCKED/);
  }
  await assert.rejects(inspectSyntheticPdfNulAttribution(pdf,{useSystemFonts:'true'}),
    /G002_NUL_ATTRIBUTION_BLOCKED/);
  assert.throws(()=>compareSyntheticNulModes(
    {schema:'astra-g002-pdfjs-nul-attribution-v1',useSystemFonts:true,pageCount:2},
    {schema:'astra-g002-pdfjs-nul-attribution-v1',useSystemFonts:true,pageCount:2},
  ),/G002_NUL_ATTRIBUTION_BLOCKED/);
});
