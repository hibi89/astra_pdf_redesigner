import { defaultDesign, defaultDocument, exampleDocument, localToday, PALETTE, SECTION_FIELDS, type DesignSettings, type PersistedState } from '../types.ts';

export const LIMITS = { imageBytes: 10 * 1024 * 1024, imagePixels: 20_000_000, importBytes: 100 * 1024 * 1024, sections: 200, blocks: 3000, documents: 1000, text: 500_000 } as const;
export type Alignment = 'left' | 'center' | 'right';
export type ImageSize = 'small' | 'medium' | 'large';
export interface PdfBlockOrigin { page:number; x:number; y:number; width:number; height:number }
export type ContentBlock =
  | { id: string; kind: 'heading' | 'paragraph' | 'caption'; text: string; origin?:PdfBlockOrigin }
  | { id: string; kind: 'image'; assetId: string; caption: string; alignment: Alignment; size: ImageSize; origin?:PdfBlockOrigin };
export interface DocumentSection { id: string; title: string; blocks: ContentBlock[] }
export interface ProjectDocument {
  schemaVersion: 2;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  content: { title: string; author: string; date: string; sections: DocumentSection[] };
  design: DesignSettings;
}
export interface ImageAsset { id: string; documentId: string; mimeType: string; originalName: string; byteSize: number; width: number; height: number; blob: Blob }
export interface DocumentCollection { schemaVersion: 2; activeDocumentId: string; documents: ProjectDocument[] }
export const newIdentifier = () => globalThis.crypto.randomUUID();
export const newSection = (title = '새 섹션'): DocumentSection => ({ id: newIdentifier(), title, blocks: [{ id: newIdentifier(), kind: 'paragraph', text: '' }] });
export const newBlock = (kind: 'heading' | 'paragraph' | 'caption'): ContentBlock => ({ id: newIdentifier(), kind, text: '' });
export function blankProject(now = new Date().toISOString()): ProjectDocument {
  return { schemaVersion: 2, id: newIdentifier(), name: '새 문서', createdAt: now, updatedAt: now,
    content: { title: '새 문서', author: '', date: localToday(), sections: [newSection()] }, design: defaultDesign() };
}
export function migrateStep1Document(legacy: PersistedState, createId: () => string = newIdentifier, now = new Date().toISOString()): ProjectDocument {
  return { schemaVersion: 2, id: createId(), name: legacy.document.title, createdAt: now, updatedAt: now,
    content: { title: legacy.document.title, author: legacy.document.author, date: legacy.document.date,
      sections: SECTION_FIELDS.map(([key, title]) => ({ id: createId(), title,
        blocks: [{ id: createId(), kind: 'paragraph' as const, text: legacy.document[key] }] })) },
    design: { ...legacy.design } };
}
export function retrospectiveProject(example = false): ProjectDocument {
  const source: PersistedState = { schemaVersion: 1, document: example ? exampleDocument() : defaultDocument(), design: defaultDesign() };
  return migrateStep1Document(source);
}
export function moveItem<T extends { id: string }>(items: readonly T[], id: string, direction: -1 | 1): T[] {
  const from = items.findIndex(item => item.id === id); const to = from + direction;
  const copy = [...items]; if (from < 0 || to < 0 || to >= items.length) return copy;
  [copy[from], copy[to]] = [copy[to], copy[from]]; return copy;
}
export const moveBlock = moveItem;
export function updateTextBlock(blocks: readonly ContentBlock[], id: string, text: string): ContentBlock[] {
  return blocks.map(block => block.id === id && block.kind !== 'image' ? { ...block, text } : block);
}
export function visibleSections(doc: ProjectDocument): DocumentSection[] {
  return doc.content.sections.filter(section => section.blocks.some(block =>
    block.kind === 'image' || !!block.text.trim()));
}
export function documentAssetIds(doc: ProjectDocument): string[] {
  return [...new Set(doc.content.sections.flatMap(section => section.blocks.flatMap(block => block.kind === 'image' ? [block.assetId] : [])))];
}
export function cloneProject(source: ProjectDocument, assets: readonly ImageAsset[], now = new Date().toISOString()): { document: ProjectDocument; assets: ImageAsset[] } {
  const id = newIdentifier(); const assetIds = new Map<string, string>();
  for (const asset of assets) assetIds.set(asset.id, newIdentifier());
  const document: ProjectDocument = { ...source, id, name: `${source.name} 복사본`, createdAt: now, updatedAt: now,
    content: { ...source.content, sections: source.content.sections.map(section => ({ ...section, id: newIdentifier(),
      blocks: section.blocks.map(block => block.kind === 'image'
        ? { ...block, id: newIdentifier(), assetId: assetIds.get(block.assetId) ?? block.assetId }
        : { ...block, id: newIdentifier() }) })) } };
  return { document, assets: assets.map(asset => ({ ...asset, id: assetIds.get(asset.id)!, documentId: id })) };
}
const record = (o: unknown): o is Record<string, unknown> => !!o && typeof o === 'object' && !Array.isArray(o);
const text = (v: unknown, max: number = LIMITS.text): v is string => typeof v === 'string' && v.length <= max;
const identifier = (v: unknown): v is string => text(v, 150) && v.length > 0;
const idUnique = (items: {id: string}[]) => new Set(items.map(item => item.id)).size === items.length;
export function isDesign(value: unknown): value is DesignSettings {
  return record(value) && ['report', 'minimal', 'diary', 'compact', 'editorial', 'ledger', 'brief', 'folio'].includes(String(value.theme)) &&
    PALETTE.some(color => color.value === value.accent) &&
    ['small', 'medium', 'large'].includes(String(value.textSize)) && ['sans', 'serif'].includes(String(value.font));
}
export function isProjectDocument(value: unknown): value is ProjectDocument {
  if (!record(value) || value.schemaVersion !== 2 || !identifier(value.id) || !text(value.name, 250) ||
      !text(value.createdAt, 60) || !text(value.updatedAt, 60) || !isDesign(value.design) || !record(value.content)) return false;
  const c = value.content;
  if (!text(c.title, 2000) || !text(c.author, 1000) || !text(c.date, 60) || !Array.isArray(c.sections) || c.sections.length > LIMITS.sections) return false;
  let blocks = 0; const allIds: string[] = [];
  for (const section of c.sections) {
    if (!record(section) || !identifier(section.id) || !text(section.title, 2000) || !Array.isArray(section.blocks)) return false;
    allIds.push(section.id);
    for (const block of section.blocks) {
      if (!record(block) || !identifier(block.id)) return false;
      allIds.push(block.id); blocks++;
      if (blocks > LIMITS.blocks) return false;
      if (block.kind === 'image') {
        if (!identifier(block.assetId) || !text(block.caption, LIMITS.text) ||
            !['left', 'center', 'right'].includes(String(block.alignment)) ||
            !['small', 'medium', 'large'].includes(String(block.size))) return false;
      } else {
        if (!['paragraph', 'heading', 'caption'].includes(String(block.kind)) || !text(block.text)) return false;
      }
      if ('origin' in block) {
        if (!record(block.origin) || !Number.isInteger(block.origin.page) || (block.origin.page as number)<1 || (block.origin.page as number)>1000 ||
            !['x','y','width','height'].every(key=>typeof (block.origin as Record<string,unknown>)[key]==='number' &&
            Number.isFinite((block.origin as Record<string,number>)[key]) && (block.origin as Record<string,number>)[key]>=0 &&
            (block.origin as Record<string,number>)[key]<=100000)) return false;
      }
    }
  }
  return new Set(allIds).size === allIds.length;
}
export function isDocumentCollection(value: unknown): value is DocumentCollection {
  if (!record(value) || value.schemaVersion !== 2 || !text(value.activeDocumentId, 150) ||
      !Array.isArray(value.documents) || value.documents.length > LIMITS.documents || !value.documents.every(isProjectDocument) || !idUnique(value.documents)) return false;
  return value.documents.length ? value.documents.some(doc => doc.id === value.activeDocumentId) : value.activeDocumentId === '';
}
