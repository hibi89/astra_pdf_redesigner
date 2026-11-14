// Fifteen deterministic A4 PDF A/B pairs. All text, amounts, dates and links are synthetic.
const cases=[
 {id:'negative-money-sign',sourceText:'Invoice total -1250.50 USD',outputText:'Invoice total 1250.50 USD',expected:{missingNumericTokens:1,missingSymbols:1}},
 {id:'positive-rate-sign',sourceText:'Annual rate +4.25%',outputText:'Annual rate 4.25%',expected:{missingNumericTokens:1,missingSymbols:1}},
 {id:'effective-date',sourceText:'Effective 2026-11-15',outputText:'Effective 2026-11-16',expected:{missingNumericTokens:1}},
 {id:'decimal-amount',sourceText:'Balance 10500.50',outputText:'Balance 10500.05',expected:{missingNumericTokens:1}},
 {id:'currency-symbol',sourceText:'Refund $250.00',outputText:'Refund 250.00',expected:{missingSymbols:1}},
 {id:'percent-symbol',sourceText:'Rate 5.00%',outputText:'Rate 5.00',expected:{missingSymbols:1}},
 {id:'parenthesis-symbols',sourceText:'Adjustment (250.00)',outputText:'Adjustment 250.00',expected:{missingSymbols:2}},
 {id:'sign-flip',sourceText:'Net amount -100.00',outputText:'Net amount +100.00',expected:{missingNumericTokens:1,missingSymbols:1,addedSymbols:1}},
 {id:'negation-not',sourceText:'Payment NOT APPROVED',outputText:'Payment APPROVED',expected:{missingNegations:1}},
 {id:'negation-no',sourceText:'NO TRANSFER AUTHORIZED',outputText:'TRANSFER AUTHORIZED',expected:{missingNegations:1}},
 {id:'negation-without',sourceText:'Access WITHOUT consent',outputText:'Access with consent',expected:{missingNegations:1}},
 {id:'link-target-change',sourceText:'Open official notice',outputText:'Open official notice',sourceLink:'https://example.test/notice/1001',outputLink:'https://example.test/notice/1002',expected:{missingLinkTargets:1,addedLinkTargets:1}},
 {id:'link-removed',sourceText:'Open source policy',outputText:'Open source policy',sourceLink:'https://example.test/policy/1001',expected:{missingLinkTargets:1}},
 {id:'link-added',sourceText:'Open new policy',outputText:'Open new policy',outputLink:'https://example.test/policy/1002',expected:{addedLinkTargets:1}},
 {id:'duplicate-reference',sourceText:'Reference REF-108',outputText:'Reference REF-108 REF-108',expected:{addedTokens:1}},
];
export const STEP7_PDF_PARITY_CASES=Object.freeze(cases);
function escapePdfLiteral(value){
 return value.replace(/\\/gu,'\\\\').replace(/\(/gu,'\\(').replace(/\)/gu,'\\)');
}
function makeA4Pdf(text,linkTarget){
 const textBytes=Buffer.from('BT /F1 12 Tf 56 760 Td ('+escapePdfLiteral(text)+') Tj ET\n','ascii');
 const content=Buffer.concat([Buffer.from('<< /Length '+textBytes.length+' >>\nstream\n','ascii'),textBytes,Buffer.from('endstream','ascii')]);
 const page=Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.276 841.89] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R'+(linkTarget?' /Annots [6 0 R]':'')+' >>','ascii');
 const objects=[
  Buffer.from('<< /Type /Catalog /Pages 2 0 R >>','ascii'),
  Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>','ascii'),
  page,
  Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','ascii'),
  content,
 ];
 if(linkTarget)objects.push(Buffer.from('<< /Type /Annot /Subtype /Link /Rect [56 748 350 780] /Border [0 0 0] /A << /S /URI /URI ('+escapePdfLiteral(linkTarget)+') >> >>','ascii'));
 const header=Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary'),chunks=[header],offsets=[0];
 let position=header.length;
 for(let i=0;i<objects.length;i++){
  offsets.push(position);
  const object=Buffer.concat([Buffer.from((i+1)+' 0 obj\n','ascii'),objects[i],Buffer.from('\nendobj\n','ascii')]);
  chunks.push(object);position+=object.length;
 }
 const xref=position;
 const entries=offsets.slice(1).map(offset=>String(offset).padStart(10,'0')+' 00000 n ').join('\n');
 chunks.push(Buffer.from('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+entries+'\ntrailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n','ascii'));
 return Buffer.concat(chunks);
}
export function makeStep7PdfParityCorpus(){
 return STEP7_PDF_PARITY_CASES.map(item=>({
  ...item,source:makeA4Pdf(item.sourceText,item.sourceLink),output:makeA4Pdf(item.outputText,item.outputLink),
 }));
}
