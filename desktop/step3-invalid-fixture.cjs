'use strict';
// M08-C: a structurally complete, wholly synthetic two-page PDF whose trailer
// points at a nonexistent Catalog object. The original valid fixture contains
// selectable text and images, so rejection must come from PDF parsing rather
// than the scan-only/no-text policy. No external generators or customer files.
const {makeScannedPagesPdf,SCAN_MARKERS}=require('./step3-scanned-fixture.cjs');
function makeCorruptRootPdf(){
  const pdf=makeScannedPagesPdf({selectableSecondPage:true});
  const original=Buffer.from('/Root 1 0 R','ascii');
  const offset=pdf.lastIndexOf(original);
  if(offset<0||pdf.indexOf(original)!==offset)
    throw Error('Synthetic PDF trailer Root fixture changed');
  // Same byte length: all object locations/xref offsets remain intact.
  pdf.write('/Root 9 0 R',offset,'ascii');
  if(pdf.includes(Buffer.from('9 0 obj','ascii')))
    throw Error('Synthetic missing catalog object unexpectedly exists');
  return pdf;
}
module.exports={makeCorruptRootPdf,SCAN_MARKERS};
