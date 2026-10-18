// No test browser dependency: uses Node 22 WebSocket + Chrome DevTools Protocol.
// Run while the Vite server is listening on http://127.0.0.1:4173.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { launchBrowser } from './browser-process.mjs';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browser = process.env.CHROME_PATH || 'chromium';
const url = process.env.SMOKE_URL || 'http://127.0.0.1:4173';
const dir = mkdtempSync(join(tmpdir(), 'astra-browser-'));
const session = launchBrowser(browser,dir,'STEP1 browser-smoke');
let ws;
let seq = 1;
const pending = new Map();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function devtools() {return session.devtools();}

function request(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = seq++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

async function eventually(action, check = (result) => Boolean(result), timeout = 8000) {
  const started = Date.now();
  let navigationError;
  while (Date.now() - started < timeout) {
    try {
      const value = await action();
      if (check(value)) return value;
    } catch (error) {
      // Page.reload temporarily destroys Chrome's JavaScript execution context.
      if (!/navigated or closed|Execution context was destroyed|Cannot find context/i.test(String(error))) throw error;
      navigationError = error;
    }
    await wait(120);
  }
  throw new Error(`Timed out waiting for browser condition: ${String(navigationError ?? 'false')}`);
}

try {
  const wsUrl = await devtools();
  ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  ws.addEventListener('message', (event) => {
    const value = JSON.parse(event.data);
    if (value.id && pending.has(value.id)) {
      const entry = pending.get(value.id);
      pending.delete(value.id);
      if (value.error) entry.reject(new Error(value.error.message));
      else entry.resolve(value.result);
    }
  });
  const { targetId } = await request('Target.createTarget', { url });
  const { sessionId } = await request('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params = {}) => request(method, params, sessionId);
  const evalJs = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  const reload = async () => {
    let finish, fail, listener, timer;
    const loaded = new Promise((resolve, reject) => {
      finish = resolve;
      fail = reject;
      listener = (event) => {
        const message = JSON.parse(event.data);
        if (message.method === 'Page.loadEventFired' && message.sessionId === sessionId) {
          clearTimeout(timer);
          ws.removeEventListener('message', listener);
          resolve();
        }
      };
      ws.addEventListener('message', listener);
      timer = setTimeout(() => {
        ws.removeEventListener('message', listener);
        reject(new Error('Page load event timed out'));
      }, 12000);
    });
    try { await send('Page.reload', { ignoreCache: true }); await loaded; }
    catch (error) { clearTimeout(timer); ws.removeEventListener('message', listener); throw error; }
  };

  const openLegacy = async () => {
    await eventually(() => evalJs("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('기존 회고록 편집') && !b.disabled)"));
    await evalJs("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('기존 회고록 편집')).click()");
    await eventually(() => evalJs("Boolean(document.querySelector('textarea[name=learned]'))"));
  };
  await openLegacy();
  await eventually(() => evalJs("Boolean(document.querySelector('.document') && document.querySelector('textarea[name=learned]'))"));
  assert.equal(await evalJs("document.querySelectorAll('.document-section').length"), 0);
  assert.equal(await evalJs("Boolean(document.querySelector('.document-author'))"), false);
  console.log('PASS: Chrome React renderer, empty sections and optional author');

  const sample = 'React 상태 입력 유지 123\n\n두 번째 문단 원문 확인';
  await evalJs(`(() => { const e=document.querySelector('textarea[name="learned"]'); const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set; setter.call(e,${JSON.stringify(sample)});e.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  await eventually(() => evalJs("document.querySelector('.document-section .section-body')?.textContent"), (value) => value === sample);
  await evalJs("document.querySelectorAll('.theme-option')[2].querySelector('input').click()");
  await eventually(() => evalJs("document.querySelector('.document')?.classList.contains('paper-theme-diary')"));
  assert.equal(await evalJs("document.querySelector('.document-section .section-body')?.textContent"), sample);
  await eventually(() => evalJs("JSON.parse(localStorage.getItem('astra-pdf-redesigner:current:v1') || '{}').design?.theme"), (v) => v === 'diary');
  await reload();
  await openLegacy();
  await eventually(() => evalJs("document.querySelector('.document-section .section-body')?.textContent"), (v) => v === sample);
  assert.equal(await evalJs("document.querySelector('.document')?.classList.contains('paper-theme-diary')"), true);
  console.log('PASS: live editing, exact paragraphs, theme switch, reload persistence');

  await evalJs("window.confirm=()=>true;document.querySelector('.text-button').click()");
  await eventually(() => evalJs("document.querySelectorAll('.document-section').length"), (v) => v === 0);
  await reload();
  await openLegacy();
  await eventually(() => evalJs("document.querySelector('.document') !== null"));
  assert.equal(await evalJs("document.querySelectorAll('.document-section').length"), 0);
  console.log('PASS: reset clears state across reload');

  await evalJs("localStorage.setItem('astra-pdf-redesigner:current:v1', '{broken');");
  await reload();
  await openLegacy();
  await eventually(() => evalJs("Boolean(document.querySelector('textarea[name=learned]'))"));
  console.log('PASS: malformed localStorage recovery');

  const longValue = `START_MARKER_LONG_PDF\n\n${('오늘은 학습한 내용을 검증했습니다. 정확한 문단과 한글 텍스트를 유지합니다.\n\n').repeat(230)}\nEND_MARKER_LONG_PDF\nhttps://example.org/${'abcdef'.repeat(140)}`;
  const restored = {
    schemaVersion: 1,
    document: { title: '장문 학습 회고록', author: '', date: '2026-10-18', learned: longValue, difficult: '', solved: '', reflection: '' },
    design: { theme: 'report', accent: '#285a73', textSize: 'medium', font: 'sans' },
  };
  await evalJs(`localStorage.setItem('astra-pdf-redesigner:current:v1', ${JSON.stringify(JSON.stringify(restored))})`);
  await reload();
  await openLegacy();
  await eventually(() => evalJs("document.querySelector('.section-body')?.textContent?.includes('END_MARKER_LONG_PDF')"));
  assert.equal(await evalJs("document.querySelectorAll('.document-section').length"), 1);
  assert.equal(await evalJs("Boolean(document.querySelector('.document-author'))"), false);
  const overflow = await evalJs("(() => {const e=document.querySelector('.section-body');const p=document.querySelector('.document');return e.getBoundingClientRect().right > p.getBoundingClientRect().right + 1})()");
  assert.equal(overflow, false);
  console.log('PASS: long text and URL, single non-empty section, no horizontal overflow');

  const result = await send('Page.printToPDF', { printBackground: false, preferCSSPageSize: true });
  const pdf = join(dir, 'smoke.pdf');
  writeFileSync(pdf, Buffer.from(result.data, 'base64'));
  const info = execFileSync('pdfinfo', [pdf], { encoding: 'utf8' });
  const pages = Number(info.match(/Pages:\s+(\d+)/)?.[1]);
  assert.ok(pages >= 2, `Expected >=2 PDF pages, got ${pages}`);
  const text = execFileSync('pdftotext', [pdf, '-'], { encoding: 'utf8' });
  assert.ok(text.includes('START_MARKER_LONG_PDF'), 'Missing start of printed content');
  assert.ok(text.includes('END_MARKER_LONG_PDF'), 'Missing end of printed content');
  assert.ok(!text.includes('예시 불러오기'), 'Editor UI leaked into print');
  assert.ok(info.includes('A4'), 'Expected A4 paper size');
  console.log(`PASS: Chrome print CSS, A4 PDF ${pages} pages, text extraction, no editor UI`);
} finally {
  if (ws) ws.close();
  await session.close();
  try{rmSync(dir,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
  catch(error){
    if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP1: temporary browser profile cleanup deferred ('+error.code+')');
  }
}
