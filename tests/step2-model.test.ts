import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultDesign, defaultDocument, type PersistedState } from '../src/types.ts';
import { isDocumentCollection, isProjectDocument, migrateStep1Document, moveBlock, updateTextBlock } from '../src/step2/model.ts';

const legacy = (): PersistedState => ({
  schemaVersion: 1,
  document: { ...defaultDocument(), title: '원본 보고서 123', author: '작성자', learned: '첫 문장\n\n두 번째 문장\nhttps://example.com/a?b=123', difficult: '', solved: '해결 4.5%', reflection: '마지막 문장' },
  design: { ...defaultDesign(), theme: 'diary' },
});

test('STEP 1 migration preserves words, whitespace, author, date and design', () => {
  const source = legacy();
  let next = 0;
  const output = migrateStep1Document(source, () => 'id-'+(++next), '2026-10-18T00:00:00.000Z');
  assert.equal(output.title, source.document.title);
  assert.equal(output.author, source.document.author);
  assert.equal(output.date, source.document.date);
  assert.deepEqual(output.design, source.design);
  assert.deepEqual(output.blocks.map((block) => block.kind), ['heading', 'paragraph', 'heading', 'paragraph', 'heading', 'paragraph']);
  assert.equal(output.blocks[1].kind === 'paragraph' ? output.blocks[1].text : '', source.document.learned);
  assert.equal(output.blocks[3].kind === 'paragraph' ? output.blocks[3].text : '', source.document.solved);
  assert.equal(output.blocks[5].kind === 'paragraph' ? output.blocks[5].text : '', source.document.reflection);
  assert.equal(source.document.learned, '첫 문장\n\n두 번째 문장\nhttps://example.com/a?b=123');
  assert.ok(isProjectDocument(output));
});

test('migration of blank legacy sections creates no phantom heading or paragraph', () => {
  const source = legacy();
  source.document.learned = '';
  source.document.solved = ' \n ';
  source.document.reflection = '';
  assert.deepEqual(migrateStep1Document(source, () => 'test').blocks, []);
});

test('reorder preserves every block including image metadata', () => {
  const original = [
    { id: 'h', kind: 'heading' as const, text: '제목' },
    { id: 'p', kind: 'paragraph' as const, text: '원문 \n123' },
    { id: 'i', kind: 'image' as const, assetId: 'blob-1', caption: '그림', altText: '선' },
  ];
  assert.deepEqual(moveBlock(original, 'i', -1).map((b) => b.id), ['h', 'i', 'p']);
  assert.deepEqual(moveBlock(original, 'h', -1), original);
  assert.deepEqual(original.map((b) => b.id), ['h', 'p', 'i']);
  assert.deepEqual(updateTextBlock(original, 'p', '\n바뀜\n')[1], { id: 'p', kind: 'paragraph', text: '\n바뀜\n' });
  assert.deepEqual(updateTextBlock(original, 'i', '무시'), original);
});

test('collection validator rejects invalid, duplicate and orphaned records', () => {
  const doc = migrateStep1Document(legacy(), (() => { let n = 0; return () => 'u-'+(++n); })());
  const collection = { schemaVersion: 2, activeDocumentId: doc.id, documents: [doc] };
  assert.ok(isDocumentCollection(collection));
  assert.equal(isDocumentCollection({ ...collection, activeDocumentId: 'orphan' }), false);
  assert.equal(isDocumentCollection({ ...collection, documents: [doc, doc] }), false);
  assert.equal(isDocumentCollection({ ...collection, documents: [{ ...doc, blocks: [doc.blocks[0], doc.blocks[0]] }] }), false);
  assert.equal(isDocumentCollection({ ...collection, schemaVersion: 1 }), false);
  assert.equal(isDocumentCollection(JSON.parse('{"schemaVersion":2}')), false);
});
