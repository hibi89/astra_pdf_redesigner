export type ThemeId = 'report' | 'minimal' | 'diary' | 'compact' | 'editorial' | 'ledger';
export type FontKind = 'sans' | 'serif';
export type TextSize = 'small' | 'medium' | 'large';

export interface Retrospective {
  title: string;
  author: string;
  date: string;
  learned: string;
  difficult: string;
  solved: string;
  reflection: string;
}

export interface DesignSettings {
  theme: ThemeId;
  accent: string;
  textSize: TextSize;
  font: FontKind;
}

export interface PersistedState {
  schemaVersion: 1;
  document: Retrospective;
  design: DesignSettings;
}

export const SECTION_FIELDS = [
  ['learned', '오늘 배운 내용'],
  ['difficult', '어려웠던 점'],
  ['solved', '해결 과정'],
  ['reflection', '느낀 점 및 다음 계획'],
] as const satisfies ReadonlyArray<readonly [keyof Retrospective, string]>;

export const PALETTE = [
  { value: '#285a73', label: '딥 블루' },
  { value: '#3f644d', label: '포레스트' },
  { value: '#7d5b8a', label: '모브' },
  { value: '#aa593c', label: '테라코타' },
  { value: '#6b6477', label: '슬레이트' },
  { value: '#a37732', label: '앰버' },
] as const;

export const THEMES: readonly { id: ThemeId; label: string; description: string }[] = [
  { id: 'report', label: '깔끔한 보고서', description: '정돈된 제목과 또렷한 구분' },
  { id: 'minimal', label: '미니멀 노트', description: '여백과 타이포그래피 중심' },
  { id: 'diary', label: '학습 다이어리', description: '작은 번호와 부드러운 구획' },
];

export function localToday(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function defaultDocument(): Retrospective {
  return { title: '오늘의 학습 회고록', author: '', date: localToday(), learned: '', difficult: '', solved: '', reflection: '' };
}

export function defaultDesign(): DesignSettings {
  return { theme: 'report', accent: PALETTE[0].value, textSize: 'medium', font: 'sans' };
}

export function exampleDocument(): Retrospective {
  return {
    title: 'AI Core Engineer 학습 회고록',
    author: '학습자',
    date: localToday(),
    learned: '오늘은 React의 컴포넌트와 상태 관리를 실습했다.\n입력 값이 미리보기에 즉시 반영되는 구조를 이해했다.',
    difficult: '상태와 화면이 연결되는 흐름을 처음에는 구분하기 어려웠다.',
    solved: '입력 → 상태 갱신 → 화면 재렌더링 순서로 나누어 확인했다.\n\n작은 예제로 동작을 반복 검증했다.',
    reflection: '결과물을 직접 사용해 보니 이해가 명확해졌다.\n다음에는 긴 문서의 인쇄 페이지 나눔을 점검할 계획이다.',
  };
}

export function isBlankDocument(doc: Retrospective): boolean {
  return !doc.author.trim() && SECTION_FIELDS.every(([key]) => !doc[key].trim()) &&
    (!doc.title.trim() || doc.title === defaultDocument().title);
}
