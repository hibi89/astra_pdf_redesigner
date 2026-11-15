// G002 synthetic-only PDF.js NUL attribution. Diagnostics never return text,
// item coordinates, file paths, raw font names, or customer document data.
import {createHash} from 'node:crypto';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';

const MAX_PDF_BYTES=32*1024*1024;
const MAX_PAGES=30;
const MAX_ITEMS=300_000;
const MAX_CHARS=2_000_000;
const blocked=()=>{throw Error('G002_NUL_ATTRIBUTION_BLOCKED');};
const hex=s=>createHash('sha256').update(s).digest('hex').slice(0,16);
const count=(s,ch)=>s.split(ch).length-1;
const bucket=family=>/monospace|courier|mono/i.test(family)?'MONOSPACE':
  /sans|arial|helvetica|gothic/i.test(family)?'SANS':
  /serif|times|batang/i.test(family)?'SERIF':'UNCLASSIFIED';

export async function inspectSyntheticPdfNulAttribution(pdfBytes,{useSystemFonts=true}={}){
  if(!Buffer.isBuffer(pdfBytes)||pdfBytes.length<24||
    pdfBytes.length>MAX_PDF_BYTES||
    pdfBytes.subarray(0,5).toString('ascii')!=='%PDF-'||
    typeof useSystemFonts!=='boolean')blocked();
  let task;
  try{
    task=getDocument({
      data:new Uint8Array(pdfBytes),useSystemFonts,disableFontFace:true,
    });
    const pdf=await task.promise;
    if(pdf.numPages<1||pdf.numPages>MAX_PAGES)blocked();
    let items=0,characters=0,nulGlyphs=0,nulItems=0,replacementGlyphs=0;
    const pages=[];
    for(let i=1;i<=pdf.numPages;i++){
      const page=await pdf.getPage(i);
      const data=await page.getTextContent();
      const fonts=new Map();
      let pageNuls=0,pageItems=0,pageCharacters=0,pageReplacements=0;
      for(const item of data.items){
        if(typeof item.str!=='string')continue;
        const value=item.str;
        const nuls=count(value,'\u0000');
        const replacements=count(value,'\uFFFD');
        characters+=value.length;
        pageCharacters+=value.length;
        items++;pageItems++;
        nulGlyphs+=nuls;
        pageNuls+=nuls;
        replacementGlyphs+=replacements;
        pageReplacements+=replacements;
        if(nuls)nulItems++;
        if(items>MAX_ITEMS||characters>MAX_CHARS)blocked();
        const font=typeof item.fontName==='string'?item.fontName:'(unknown)';
        const family=typeof data.styles?.[font]?.fontFamily==='string'
          ?data.styles[font].fontFamily:'(unknown)';
        // Raw font metadata may identify a private document. Only a short
        // deterministic hash and generic family category leave the process.
        const id=hex(font+'\u001f'+family);
        const old=fonts.get(id)||{fontKey:id,familyBucket:bucket(family),
          items:0,characters:0,nulItems:0,nulGlyphs:0,replacementGlyphs:0};
        old.items++;
        old.characters+=value.length;
        if(nuls)old.nulItems++;
        old.nulGlyphs+=nuls;
        old.replacementGlyphs+=replacements;
        fonts.set(id,old);
      }
      pages.push(Object.freeze({
        page:i,items:pageItems,characters:pageCharacters,nulGlyphs:pageNuls,
        replacementGlyphs:pageReplacements,
        fonts:Object.freeze([...fonts.values()].sort((a,b)=>a.fontKey.localeCompare(b.fontKey))
          .map(x=>Object.freeze(x))),
      }));
      page.cleanup();
    }
    if(pages.reduce((n,p)=>n+p.nulGlyphs,0)!==nulGlyphs)blocked();
    return Object.freeze({
      schema:'astra-g002-pdfjs-nul-attribution-v1',
      scope:'SYNTHETIC_QA_ONLY',status:'DIAGNOSTIC_NOT_FONT_CMAP_PROOF',
      parser:'PDF.js',useSystemFonts,disableFontFace:true,
      pages:Object.freeze(pages),pageCount:pdf.numPages,items,characters,
      nulItems,nulGlyphs,replacementGlyphs,
      sourceTextExposed:false,coordinatesExposed:false,
      numericSemanticFidelity:'NOT_CERTIFIED',visualFidelity:'UNASSESSED',
      ownerApproval:'NOT_GRANTED',scoreDelta:0,release:'RELEASE HOLD',
    });
  }catch{blocked();}
  finally{if(task)await task.destroy().catch(()=>{});}
}

export function compareSyntheticNulModes(withSystemFonts,withoutSystemFonts){
  if(withSystemFonts?.schema!=='astra-g002-pdfjs-nul-attribution-v1'||
    withoutSystemFonts?.schema!=='astra-g002-pdfjs-nul-attribution-v1'||
    withSystemFonts.useSystemFonts!==true||
    withoutSystemFonts.useSystemFonts!==false||
    withSystemFonts.pageCount!==withoutSystemFonts.pageCount)blocked();
  return Object.freeze({
    schema:'astra-g002-nul-mode-compare-v1',
    defaultModeNuls:withSystemFonts.nulGlyphs,
    noSystemFontsNuls:withoutSystemFonts.nulGlyphs,
    defaultModeNulPages:withSystemFonts.pages.filter(p=>p.nulGlyphs>0).map(p=>p.page),
    noSystemFontsNulPages:withoutSystemFonts.pages.filter(p=>p.nulGlyphs>0).map(p=>p.page),
    classification:withSystemFonts.nulGlyphs!==withoutSystemFonts.nulGlyphs
      ?'FONT_OPTION_SENSITIVE_EXTRACTION_REVIEW_REQUIRED'
      :'BOTH_FONT_OPTIONS_AGREE_NOT_PROOF_OF_FONT_CMAP',
    underlyingToUnicodeCause:'UNASSESSED',
    numericSemanticFidelity:'NOT_CERTIFIED',
    manualReviewRequired:withSystemFonts.nulGlyphs>0||withoutSystemFonts.nulGlyphs>0,
    scoreDelta:0,release:'RELEASE HOLD',
  });
}
