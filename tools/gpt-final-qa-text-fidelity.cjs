'use strict';
// G002 independent synthetic TEXT snapshot guard. Inputs MUST be obtained from
// separate source/import/output observations; this is not a PDF parser or visual QA.
const crypto = require('node:crypto');
const MAX_TEXT = 2_000_000;
const MAX_PDF = 32 * 1024 * 1024;
const NUMBERS = /[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?/gu;
const NEGATIONS = /않|못|없|아니|금지|불가|거절|미승인|부인|\b(?:not|never|no)\b/giu;
function normalize(text) { return text.normalize('NFC').replace(/\s+/gu, ' ').trim(); }
function tokens(text, re) { return [...text.matchAll(re)].map(m => m[0]); }
function equalOrdered(a,b) { return a.length === b.length && a.every((x,i) => x === b[i]); }
function requireText(s) {
  if (typeof s !== 'string' || s.length > MAX_TEXT || s.includes('\u0000')) throw Error('INVALID_TEXT_SNAPSHOT');
  return normalize(s);
}
function requirePdfBuffer(b) {
  if (!Buffer.isBuffer(b) || b.length < 16 || b.length > MAX_PDF ||
      b.toString('ascii',0,5) !== '%PDF-') throw Error('INVALID_ORIGINAL_PDF_BUFFER');
  return crypto.createHash('sha256').update(b).digest('hex');
}
function checkSnapshots({sourcePdfBefore,sourcePdfAfter,sourceText,importedText,outputText,expectedTableRows=[]}) {
  const beforeSha = requirePdfBuffer(sourcePdfBefore), afterSha = requirePdfBuffer(sourcePdfAfter);
  const text = [sourceText,importedText,outputText].map(requireText);
  if (!Array.isArray(expectedTableRows) || expectedTableRows.length > 200)
    throw Error('INVALID_TABLE_EVIDENCE');
  const tableRows = expectedTableRows.map(requireText);
  if (tableRows.some(x => x.length < 3)) throw Error('INVALID_TABLE_EVIDENCE');
  const issues = [];
  if (beforeSha !== afterSha) issues.push('ORIGINAL_PDF_BYTES_CHANGED');
  if (text[0] !== text[1]) issues.push('SOURCE_IMPORT_TEXT_DIFFERENCE');
  if (text[0] !== text[2]) issues.push('SOURCE_OUTPUT_TEXT_DIFFERENCE');
  for (const [name, regex] of [['NUMERIC', NUMBERS],['NEGATION', NEGATIONS]]) {
    const baseline=tokens(text[0],regex);
    if(!equalOrdered(baseline,tokens(text[1],regex)))issues.push('SOURCE_IMPORT_'+name+'_DIFFERENCE');
    if(!equalOrdered(baseline,tokens(text[2],regex)))issues.push('SOURCE_OUTPUT_'+name+'_DIFFERENCE');
  }
  // Tables are a separate, conservative check: rows must be present exactly
  // once in the same order. PDF table geometry is NOT checked by this function.
  let lastIndex=-1;
  for (const row of tableRows) {
    const first=text[2].indexOf(row);
    if (first<0 || text[2].indexOf(row,first+row.length)>=0 || first<lastIndex) {
      issues.push('TABLE_ROW_ORDER_OR_MULTIPLICITY_RISK');
      break;
    }
    lastIndex=first;
  }
  return Object.freeze({
    status:issues.length?'POTENTIAL_CONTENT_DIFFERENCE_REVIEW_REQUIRED':'SYNTHETIC_TEXT_PARITY_REVIEW_REQUIRED',
    issues,sourcePdfSha256Before:beforeSha,sourcePdfSha256After:afterSha,
    textSnapshotsChecked:3,tableRowsChecked:tableRows.length,
    sourceNumberCount:tokens(text[0],NUMBERS).length,
    sourceNegationCount:tokens(text[0],NEGATIONS).length,
    imagesAndTableGeometry:'NOT_VERIFIED',visualA4AndLayout:'NOT_VERIFIED',
    pdfExtractionAuthenticity:'NOT_VERIFIED',userAcceptance:'UNASSESSED',
    release:'RELEASE HOLD',scoreDelta:0,
  });
}
module.exports={checkSnapshots};
