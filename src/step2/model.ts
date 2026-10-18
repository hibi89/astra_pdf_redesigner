import { PALETTE, SECTION_FIELDS, type DesignSettings, type PersistedState } from '../types.ts';

/** STEP 2's ordered, local-first document structure. Binary images are stored separately. */
export type ContentBlock =
  | { id: string; kind: 'heading'; text: string }
  | { id: string; kind: 'paragraph'; text: string }
  | { id: string; kind: 'image'; assetId: string; caption: string; altText: string };

export interface ProjectDocument {
  id: string;
  name: string;
  title: string;
  author: string;
  date: string;
  blocks: ContentBlock[];
  design: DesignSettings;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentCollection {
  schemaVersion: 2;
  activeDocumentId: string;
  documents: ProjectDocument[];
}

export function newIdentifier(): string {
  return globalThis.crypto.randomUUID();
}

export function migrateStep1Document(
  legacy: PersistedState,
  createId: () => string = newIdentifier,
  now: string = new Date().toISOString(),
): ProjectDocument {
  const blocks: ContentBlock[] = [];
  for (const [key, label] of SECTION_FIELDS) {
    const text = legacy.document[key];
    // An empty section does not carry any prose to preserve.
    if (!text.trim()) continue;
    blocks.push({ id: createId(), kind: 'heading', text: label });
    blocks.push({ id: createId(), kind: 'paragraph', text });
  }
  return {
    id: createId(),
    name: legacy.document.title,
    title: legacy.document.title,
    author: legacy.document.author,
    date: legacy.document.date,
    blocks,
    design: { ...legacy.design },
    createdAt: now,
    updatedAt: now,
  };
}

/** Reorder a block without changing either its data or any other block. */
export function moveBlock(blocks: readonly ContentBlock[], id: string, offset: -1 | 1): ContentBlock[] {
  const from = blocks.findIndex((block) => block.id === id);
  const to = from + offset;
  if (from < 0 || to < 0 || to >= blocks.length) return [...blocks];
  const result = [...blocks];
  [result[from], result[to]] = [result[to], result[from]];
  return result;
}

export function updateTextBlock(blocks: readonly ContentBlock[], id: string, text: string): ContentBlock[] {
  return blocks.map((block) => block.id === id && block.kind !== 'image' ? { ...block, text } : block);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isDesign(value: unknown): value is DesignSettings {
  return isRecord(value) &&
    ['report', 'minimal', 'diary'].includes(String(value.theme)) &&
    PALETTE.some((color) => color.value === value.accent) &&
    ['small', 'medium', 'large'].includes(String(value.textSize)) &&
    ['sans', 'serif'].includes(String(value.font));
}

function isBlock(value: unknown): value is ContentBlock {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id) return false;
  if (value.kind === 'heading' || value.kind === 'paragraph') return typeof value.text === 'string';
  if (value.kind === 'image') return typeof value.assetId === 'string' && !!value.assetId &&
    typeof value.caption === 'string' && typeof value.altText === 'string';
  return false;
}

export function isProjectDocument(value: unknown): value is ProjectDocument {
  if (!isRecord(value)) return false;
  if (!['id', 'name', 'title', 'author', 'date', 'createdAt', 'updatedAt'].every(
    (key) => typeof value[key] === 'string',
  )) return false;
  if (!value.id || !Array.isArray(value.blocks) || value.blocks.length > 1000 || !isDesign(value.design)) return false;
  if (!value.blocks.every(isBlock)) return false;
  return new Set(value.blocks.map((block: ContentBlock) => block.id)).size === value.blocks.length;
}

export function isDocumentCollection(value: unknown): value is DocumentCollection {
  if (!isRecord(value) || value.schemaVersion !== 2 || typeof value.activeDocumentId !== 'string' ||
      !Array.isArray(value.documents) || value.documents.length > 1000 || !value.documents.every(isProjectDocument)) return false;
  const ids = new Set(value.documents.map((doc: ProjectDocument) => doc.id));
  return ids.size === value.documents.length &&
    (value.documents.length === 0 ? value.activeDocumentId === '' : ids.has(value.activeDocumentId));
}
