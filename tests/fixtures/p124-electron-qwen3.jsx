import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import LocalModelReview from '../../src/humanize/LocalModelReview.tsx';

const sentinelKey = 'astra-p124-synthetic-v1-sentinel';
const databaseName = 'astra-p124-synthetic-v2-sentinel';

async function seedSyntheticV1V2() {
  localStorage.setItem(sentinelKey, JSON.stringify({ kind: 'synthetic-only', version: 1, value: 'unchanged' }));
  await new Promise((resolve, reject) => {
    const open = indexedDB.open(databaseName, 1);
    open.onupgradeneeded = () => open.result.createObjectStore('state');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction('state', 'readwrite');
      transaction.objectStore('state').put({ kind: 'synthetic-only', version: 2, value: 'unchanged' }, 'sentinel');
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
  });
}

window.__p124StorageReady = seedSyntheticV1V2();
async function stableValue(value) {
  if (value instanceof Date) return { type: 'Date', value: value.toISOString() };
  const bytesToBase64 = bytes => {
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  };
  if (value instanceof Blob) return { type: 'Blob', mimeType: value.type, bytes: bytesToBase64(new Uint8Array(await value.arrayBuffer())) };
  if (value instanceof ArrayBuffer) return { type: 'ArrayBuffer', bytes: bytesToBase64(new Uint8Array(value)) };
  if (ArrayBuffer.isView(value)) return { type: value.constructor.name,
    bytes: bytesToBase64(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)) };
  if (Array.isArray(value)) return Promise.all(value.map(stableValue));
  if (value && typeof value === 'object') {
    const entries = await Promise.all(Object.keys(value).sort().map(async key => [key, await stableValue(value[key])]));
    return Object.fromEntries(entries);
  }
  return value;
}
window.__p124SnapshotProductStorage = async () => {
  const local = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).sort()
    .map(key => [key, localStorage.getItem(key)]);
  const database = await new Promise((resolve, reject) => {
    const open = indexedDB.open('astra-pdf-redesigner:v2');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result, names = Array.from(db.objectStoreNames).sort();
      if (!names.length) { db.close(); resolve({ version: db.version, stores: [] }); return; }
      const transaction = db.transaction(names, 'readonly'), raw = new Map();
      transaction.oncomplete = async () => {
        try {
          const stores = await Promise.all(names.map(async name => {
            const record = raw.get(name);
            return [name, { keys: await stableValue(record.keys), records: await stableValue(record.records) }];
          }));
          db.close(); resolve({ version: db.version, stores });
        } catch (error) { db.close(); reject(error); }
      };
      transaction.onerror = () => { db.close(); reject(transaction.error); };
      for (const name of names) {
        const store = transaction.objectStore(name), keys = store.getAllKeys(), records = store.getAll();
        raw.set(name, {});
        keys.onsuccess = () => { raw.get(name).keys = keys.result; };
        records.onsuccess = () => { raw.get(name).records = records.result; };
      }
    };
  });
  return JSON.stringify({ local, database });
};
window.__p124SnapshotStorage = async () => {
  const local = localStorage.getItem(sentinelKey);
  const value = await new Promise((resolve, reject) => {
    const open = indexedDB.open(databaseName);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('state', 'readonly');
      const read = tx.objectStore('state').get('sentinel');
      read.onsuccess = () => resolve(read.result || null);
      read.onerror = () => reject(read.error);
      tx.oncomplete = () => db.close();
    };
  });
  return JSON.stringify({ local, indexeddb: value });
};

function AcceptanceUi() {
  const [sku, setSku] = useState('BASIC');
  const [text, setText] = useState('ASTRA_P124_PDF_SOURCE_7401 · 최종 결제 금액은 230,000원이며, 승인 전에는 외부에 전달하지 않습니다.');
  const [applyCount, setApplyCount] = useState(0);
  const original = next => { setText(next); setApplyCount(value => value + 1); };
  return <>
    <div data-p124-controls>
      <label>Test-only SKU context
        <select data-p124-sku value={sku} onChange={event => setSku(event.target.value)}>
          <option value="BASIC">BASIC · 8개</option>
          <option value="PRO">PRO · 20개</option>
          <option value="BUSINESS">BUSINESS · 30개</option>
        </select>
      </label>
      <label>합성 문단
        <textarea data-model-source value={text} onChange={event => setText(event.target.value)} />
      </label>
      <output data-p124-active-sku={sku}>{sku}</output>
      <output data-model-apply-count>{String(applyCount)}</output>
    </div>
    <LocalModelReview key={sku} text={text} sourceScope={`synthetic-p124-${sku.toLowerCase()}:section-1:block-1`}
      disabled={false} onApply={original} />
    <section data-p124-print-region aria-label="PDF에 출력될 원문">
      <h2>합성 STEP2 문서</h2><p data-p124-print-source>{text}</p>
    </section>
  </>;
}

createRoot(document.getElementById('root')).render(<AcceptanceUi />);
