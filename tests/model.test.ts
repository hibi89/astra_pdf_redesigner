import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument, exampleDocument, isBlankDocument, localToday, PALETTE, SECTION_FIELDS, THEMES } from '../src/types.ts';
import { parseStored, STORAGE_KEY } from '../src/storage.ts';

test('기본 문서 구조와 섹션 네 개', () => {
  const doc = defaultDocument();
  assert.equal(SECTION_FIELDS.length, 4);
  for (const [field] of SECTION_FIELDS) assert.equal(doc[field], '');
  assert.ok(isBlankDocument(doc));
});
test('로컬 날짜는 타임존 표준값 대신 로컬 객체 메서드를 사용', () => {
  assert.equal(localToday(new Date(2026, 9, 18, 23, 59)), '2026-10-18');
});
test('예시, 테마, 팔레트', () => {
  assert.equal(THEMES.length, 3);
  assert.equal(PALETTE.length, 6);
  assert.ok(!isBlankDocument(exampleDocument()));
});
test('유효한 저장 데이터의 정확한 원문 복원', () => {
  const state = { schemaVersion: 1, document: { ...exampleDocument(), learned: '원문 123\n\nhttps://example.com/' }, design: { theme: 'minimal', accent: PALETTE[1].value, font: 'serif', textSize: 'large' } };
  const parsed = parseStored(JSON.stringify(state));
  assert.deepEqual(parsed, state);
});
test('손상/잘못된 저장 데이터는 무시', () => {
  assert.equal(parseStored(null), null);
  assert.equal(parseStored('{'), null);
  assert.equal(parseStored('{"schemaVersion":999}'), null);
  assert.equal(parseStored(JSON.stringify({ schemaVersion: 1, document: {}, design: {} })), null);
  const state = { schemaVersion: 1, document: exampleDocument(), design: { theme: '<script>', accent: '#000000', font: 'sans', textSize: 'large' } };
  assert.equal(parseStored(JSON.stringify(state)), null);
  assert.ok(STORAGE_KEY.includes(':v1'));
});
