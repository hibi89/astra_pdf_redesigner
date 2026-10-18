/** Reject overlapping workspace mutations. Never queue a stale document operation. */
export function createMutationGate() {
  let busy = false;
  return {
    get busy() { return busy; },
    async run<T>(action: () => Promise<T>): Promise<T> {
      if (busy) throw new Error('다른 문서 작업이 진행 중입니다. 완료 후 다시 시도하세요.');
      busy = true;
      try { return await action(); }
      finally { busy = false; }
    },
  };
}
