import {
  defaultDesign, defaultDocument, PALETTE, type DesignSettings, type PersistedState, type Retrospective,
} from './types.ts';

export const STORAGE_KEY = 'astra-pdf-redesigner:current:v1';
const docKeys: (keyof Retrospective)[] = ['title', 'author', 'date', 'learned', 'difficult', 'solved', 'reflection'];

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function parseStored(raw: string | null): PersistedState | null {
  if (!raw) return null;
  try {
    const source: unknown = JSON.parse(raw);
    if (!record(source) || source.schemaVersion !== 1 || !record(source.document) || !record(source.design)) return null;
    if (!docKeys.every((key) => typeof source.document[key] === 'string')) return null;
    const design = source.design;
    if (!['report', 'minimal', 'diary'].includes(String(design.theme)) ||
        !PALETTE.some((c) => c.value === design.accent) ||
        !['small', 'medium', 'large'].includes(String(design.textSize)) ||
        !['sans', 'serif'].includes(String(design.font))) return null;
    return {
      schemaVersion: 1,
      document: source.document as unknown as Retrospective,
      design: design as unknown as DesignSettings,
    };
  } catch {
    return null;
  }
}

export function initialState(): PersistedState {
  try {
    return parseStored(window.localStorage.getItem(STORAGE_KEY)) ?? {
      schemaVersion: 1, document: defaultDocument(), design: defaultDesign(),
    };
  } catch {
    return { schemaVersion: 1, document: defaultDocument(), design: defaultDesign() };
  }
}

export function saveState(state: PersistedState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
