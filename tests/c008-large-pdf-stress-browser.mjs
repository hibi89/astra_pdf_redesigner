// GitHub-hosted real Chrome/Edge ingest, review, save and print of a 30 MiB
// synthetic PDF. Only a sanitized JSON metrics record is written as an artifact.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { launchBrowser } from './browser-process.mjs';
import { C008_LARGE_PDF_BYTES, C008_SOURCE_MARKERS, makeC008LargePdf } from './fixtures/c008-large-pdf.mjs';

const binary = process.env.CHROME_PATH || 'chromium';
const url = process.env.SMOKE_URL || 'http://127.0.0.1:4173';
const reportPath = process.env.ASTRA_C008_STRESS_REPORT;
if (!reportPath || !process.env.RUNNER_TEMP) {
  throw new Error('C008 report must be written under GitHub runner temp');
}
const dir = mkdtempSync(join(tmpdir(), 'astra-c008-'));
const sourcePath = join(dir, 'c008-synthetic-30mib.pdf');
const outputPath = join(dir, 'c008-output.pdf');
const browser = launchBrowser(binary, join(dir, 'profile'), 'C008 30 MiB PDF');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let ws;
let seq = 0;
const pending = new Map();
const report = {
  task: 'C008',
  status: 'RUNNING',
  browser: binary,
  input_size_bytes: C008_LARGE_PDF_BYTES,
  input_sha256: null,
  generated_pdf_pages: null,
  input_text_markers: [],
  upload_parse_ms: null,
  consent_gate_closed_before_review: null,
  save_ms: null,
  retained_source_sha256_matches: null,
  output_size_bytes: null,
  output_pages: null,
  output_image_xobjects: null,
  output_markers_preserved: null,
  print_ms: null,
  browser_js_heap_used_bytes: null,
  pdf_content_uploaded_as_artifact: false,
  customer_data_used: false,
};

function rpc(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

async function eventually(fn, predicate = value => Boolean(value), timeout = 90000) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeout) {
    last = await fn();
    if (predicate(last)) return last;
    await sleep(200);
  }
  throw new Error('C008 browser timeout; last value=' + String(last).slice(0, 300));
}

try {
  const generationStart = Date.now();
  const pdf = makeC008LargePdf();
  assert.equal(pdf.length, C008_LARGE_PDF_BYTES);
  writeFileSync(sourcePath, pdf);
  report.input_sha256 = createHash('sha256').update(pdf).digest('hex');
  const info = execFileSync('pdfinfo', [sourcePath], { encoding: 'utf8' });
  const sourceText = execFileSync('pdftotext', [sourcePath, '-'], { encoding: 'utf8' });
  const sourceImages = execFileSync('pdfimages', ['-list', sourcePath], { encoding: 'utf8' });
  assert.match(info, /Pages:\s+1\b/);
  for (const marker of C008_SOURCE_MARKERS) {
    assert.ok(sourceText.includes(marker), 'Synthetic PDF preflight missed a text marker');
    report.input_text_markers.push(marker);
  }
  assert.match(sourceImages, /^\s*\d+\s+\d+\s+image/m);
  report.fixture_generation_and_preflight_ms = Date.now() - generationStart;

  ws = await browser.connect();
  await new Promise((resolve, reject) => {
    if (ws.readyState === 1) return resolve();
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const item = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
    }
  });

  const { targetId } = await rpc('Target.createTarget', { url });
  const { sessionId } = await rpc('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params = {}) => rpc(method, params, sessionId);
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');
  await send('Performance.enable');
  await eventually(() => evaluate(
    "Boolean(document.querySelector('.step3-import-panel input[type=file]')&&document.querySelector('.doc-list-item.active'))",
  ));
  const beforeCount = await evaluate("document.querySelectorAll('.doc-list-item').length");
  const uploadStart = Date.now();
  const { root } = await send('DOM.getDocument', { depth: -1 });
  const fileInput = await send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector: '.step3-import-panel input[type=file]',
  });
  assert.ok(fileInput.nodeId, 'Native PDF picker input is missing');
  await send('DOM.setFileInputFiles', { nodeId: fileInput.nodeId, files: [sourcePath] });
  const importedText = await eventually(
    () => evaluate("document.querySelector('.step3-import-panel')?.textContent"),
    text => C008_SOURCE_MARKERS.every(marker => text?.includes(marker)),
  );
  report.upload_parse_ms = Date.now() - uploadStart;
  assert.ok(importedText.includes(C008_SOURCE_MARKERS[0]));
  assert.ok(importedText.includes(C008_SOURCE_MARKERS[1]));
  assert.ok(await evaluate("document.querySelectorAll('.step3-image-thumbnail').length") >= 1,
    'PDF.js review must show the source raster image');

  const gate = await evaluate("(()=>{const c=document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]');const b=document.querySelector('.step3-import-panel .print-button');return c&&b?{checked:c.checked,disabled:b.disabled,count:document.querySelectorAll('.doc-list-item').length}:null})()");
  assert.ok(gate, 'Manual review controls missing');
  report.consent_gate_closed_before_review = gate.checked === false && gate.disabled === true &&
    gate.count === beforeCount;
  assert.equal(report.consent_gate_closed_before_review, true,
    'PDF import must not save without explicit source review consent');

  await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').click()");
  await eventually(() => evaluate("document.querySelector('.step3-import-panel .print-button')?.disabled"), disabled => disabled === false);
  const saveStart = Date.now();
  await evaluate("(()=>{const b=[...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('검수 결과를 새 문서로 저장'));if(!b||b.disabled)throw Error('Review save control is unavailable');b.click()})()");
  await eventually(() => evaluate("document.querySelectorAll('.doc-list-item').length"), count => count === beforeCount + 1);
  await eventually(() => evaluate("document.querySelector('.project-paper')?.textContent"),
    text => C008_SOURCE_MARKERS.every(marker => text?.includes(marker)));
  report.save_ms = Date.now() - saveStart;

  const retainedSha = await evaluate("(async()=>{const frame=document.querySelector('.studio-source-panel iframe');if(!frame?.src.startsWith('blob:'))throw Error('Original PDF source comparison is missing');const bytes=await (await fetch(frame.src)).arrayBuffer();const digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')})()");
  report.retained_source_sha256_matches = retainedSha === report.input_sha256;
  assert.equal(report.retained_source_sha256_matches, true,
    'The source PDF must remain byte-identical in the local source comparison');

  const printStart = Date.now();
  const printed = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true });
  writeFileSync(outputPath, Buffer.from(printed.data, 'base64'));
  report.print_ms = Date.now() - printStart;
  report.output_size_bytes = Buffer.byteLength(printed.data, 'base64');
  const outputInfo = execFileSync('pdfinfo', [outputPath], { encoding: 'utf8' });
  const outputText = execFileSync('pdftotext', [outputPath, '-'], { encoding: 'utf8' });
  const outputImages = execFileSync('pdfimages', ['-list', outputPath], { encoding: 'utf8' });
  report.output_pages = Number(outputInfo.match(/Pages:\s+(\d+)/)?.[1] || 0);
  report.output_image_xobjects = (outputImages.match(/^\s*\d+\s+\d+\s+image/gm) || []).length;
  report.output_markers_preserved = C008_SOURCE_MARKERS.every(marker => outputText.includes(marker));
  assert.ok(report.output_pages >= 1, 'Printed PDF has no pages');
  assert.equal(report.output_markers_preserved, true, 'Printed PDF lost source text markers');
  assert.ok(report.output_image_xobjects >= 1, 'Printed PDF lost the source raster image');

  const metrics = await send('Performance.getMetrics');
  report.browser_js_heap_used_bytes = metrics.metrics.find(item => item.name === 'JSHeapUsedSize')?.value ?? null;
  report.status = 'PASS';
  console.log('PASS C008 LARGE PDF: 30 MiB synthetic PDF parsed, manual consent enforced, exact source SHA retained, output printed with text and raster');
} catch (error) {
  report.status = 'FAIL';
  report.error = String(error?.message || error).slice(0, 500);
  throw error;
} finally {
  try {
    writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  } catch {}
  if (ws && ws.readyState === 1) ws.close();
  try { browser.child.kill('SIGTERM'); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
}
