import { makeClippedImagePdf } from './step3-clipped-pdf.mjs';

export const C008_LARGE_PDF_BYTES = 30 * 1024 * 1024;
export const C008_SOURCE_MARKERS = Object.freeze([
  'STEP3_CLIP_SOURCE_842',
  'STEP3_CLIP_END_842',
]);

// A valid one-page synthetic PDF with a deterministic, standards-compliant
// comment payload before xref. This stresses a 30 MiB local PDF upload/parse
// path without adding a 30 MiB image or any customer content.
export function makeC008LargePdf() {
  const source = Buffer.from(makeClippedImagePdf());
  const startxref = source.toString('ascii').match(/startxref\n(\d+)\n%%EOF/);
  if (!startxref) throw new Error('Synthetic source PDF has no startxref');
  const xrefAt = Number(startxref[1]);
  if (!Number.isSafeInteger(xrefAt) ||
      source.subarray(xrefAt, xrefAt + 5).toString('ascii') !== 'xref\n') {
    throw new Error('Synthetic source PDF xref offset is invalid');
  }

  let paddingBytes = C008_LARGE_PDF_BYTES - source.length;
  let pdf = source;
  for (let attempt = 0; attempt < 4; attempt++) {
    const updatedStartxref = 'startxref\n' + (xrefAt + paddingBytes) + '\n%%EOF';
    const updated = Buffer.from(source.toString('latin1').replace(
      /startxref\n\d+\n%%EOF/,
      updatedStartxref,
    ), 'latin1');
    const nextPaddingBytes = C008_LARGE_PDF_BYTES - updated.length;
    pdf = updated;
    if (nextPaddingBytes === paddingBytes) break;
    paddingBytes = nextPaddingBytes;
  }
  if (paddingBytes < 0 || pdf.length + paddingBytes !== C008_LARGE_PDF_BYTES) {
    throw new Error('Could not size the synthetic PDF to exactly 30 MiB');
  }

  const comments = Buffer.alloc(paddingBytes, 0x41);
  let cursor = 0;
  while (cursor < comments.length) {
    if (comments.length - cursor === 1) {
      comments[cursor] = 0x0a;
      break;
    }
    comments[cursor] = 0x25;
    const newline = Math.min(cursor + 65535, comments.length - 1);
    comments[newline] = 0x0a;
    cursor = newline + 1;
  }

  const finalPdf = Buffer.concat([
    pdf.subarray(0, xrefAt),
    comments,
    pdf.subarray(xrefAt),
  ]);
  if (finalPdf.length !== C008_LARGE_PDF_BYTES) {
    throw new Error('Synthetic PDF length did not match 30 MiB');
  }
  return finalPdf;
}
