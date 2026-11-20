import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeReferenceSearchQuery, referenceSearchUrl } from '../src/step6/referenceDiscovery.ts';

test('STEP6 accepts only explicit keywords and normalizes spaces without reading documents', () => {
  assert.equal(normalizeReferenceSearchQuery('  A4   보고서   디자인  '), 'A4 보고서 디자인');
  assert.equal(normalizeReferenceSearchQuery('가'.repeat(80)), '가'.repeat(80));
  for (const value of ['', ' ', '가'.repeat(81), 'hello\nworld', 24, null]) {
    assert.throws(() => normalizeReferenceSearchQuery(value));
  }
});

test('STEP6 navigation uses fixed HTTPS allowlist and encodes Korean input', () => {
  const google = new URL(referenceSearchUrl('google', '보고서 레이아웃'));
  assert.equal(google.protocol, 'https:');
  assert.equal(google.host, 'www.google.com');
  assert.equal(google.searchParams.get('tbm'), 'isch');
  assert.equal(google.searchParams.get('q'), '보고서 레이아웃');
  const bing = new URL(referenceSearchUrl('bing', 'a&b#c'));
  assert.equal(bing.host, 'www.bing.com');
  assert.equal(bing.searchParams.get('q'), 'a&b#c');
  assert.throws(() => referenceSearchUrl('https://evil.example' as 'google', 'test'));
});

