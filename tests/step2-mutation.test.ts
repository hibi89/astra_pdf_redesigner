import assert from 'node:assert/strict';
import test from 'node:test';
import { createMutationGate } from '../src/step2/mutationGate.ts';

test('overlapping document actions are rejected rather than reordered', async () => {
  const gate = createMutationGate();
  const events: string[] = [];
  let release!: () => void;
  const hold = new Promise<void>(resolve => { release = resolve; });
  const first = gate.run(async () => { events.push('first-start'); await hold; events.push('first-end'); return 'saved'; });
  assert.equal(gate.busy, true);
  await assert.rejects(gate.run(async () => { events.push('second-start'); return 'stale'; }), /진행 중/);
  assert.deepEqual(events, ['first-start']);
  release();
  assert.equal(await first, 'saved');
  assert.equal(gate.busy, false);
  assert.equal(await gate.run(async () => { events.push('third-start'); return 'new'; }), 'new');
  assert.deepEqual(events, ['first-start','first-end','third-start']);
});

test('failed document mutation releases gate for recovery', async () => {
  const gate = createMutationGate();
  await assert.rejects(gate.run(async () => { throw new Error('quota exceeded'); }), /quota exceeded/);
  assert.equal(gate.busy, false);
  assert.equal(await gate.run(async () => 'retry succeeded'), 'retry succeeded');
});
