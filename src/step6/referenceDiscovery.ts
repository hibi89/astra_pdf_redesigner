// STEP6: user-entered search keywords only. Never derive a query from a PDF or document.
export const REFERENCE_SEARCH_MAX_LENGTH = 80;
export type ReferenceSearchEngine = 'google' | 'bing';

export function normalizeReferenceSearchQuery(input: unknown): string {
  if (typeof input !== 'string' || /[\u0000-\u001f\u007f-\u009f]/u.test(input.replace(/ /g, ''))) {
    throw new Error('키워드에 사용할 수 없는 문자가 있습니다.');
  }
  const query = input.trim().replace(/\s+/gu, ' ');
  if (!query || [...query].length > REFERENCE_SEARCH_MAX_LENGTH) {
    throw new Error('검색 키워드를 1~80자로 직접 입력하세요.');
  }
  return query;
}

/** Safe fixed-domain navigation URL; no network request is made here. */
export function referenceSearchUrl(engine: ReferenceSearchEngine, keywordInput: unknown): string {
  const query = encodeURIComponent(normalizeReferenceSearchQuery(keywordInput));
  if (engine === 'google') return `https://www.google.com/search?tbm=isch&q=${query}`;
  if (engine === 'bing') return `https://www.bing.com/images/search?q=${query}`;
  throw new Error('허용되지 않은 검색 서비스입니다.');
}
