// Portable STEP4 advanced-layout selection. No PDF content, asset IDs, or V2 schema changes.
import { skuLayoutCandidate } from './skuLayoutCandidates.ts';
export const ADVANCED_LAYOUT_PRESET_FORMAT = 'astra-advanced-layout';
export const ADVANCED_LAYOUT_PRESET_VERSION = 1;
const MAX_PRESET_BYTES = 1024;
const error = (): never => { throw new Error('지원하지 않는 고급 레이아웃 파일이거나 손상되었습니다.'); };
export interface AdvancedLayoutPreset {
  format: typeof ADVANCED_LAYOUT_PRESET_FORMAT;
  version: typeof ADVANCED_LAYOUT_PRESET_VERSION;
  layoutId: string;
}
export function exportAdvancedLayoutPreset(id: string): string {
  if (!skuLayoutCandidate(id)) return error();
  return JSON.stringify({ format: ADVANCED_LAYOUT_PRESET_FORMAT, version: ADVANCED_LAYOUT_PRESET_VERSION, layoutId: id });
}
export function parseAdvancedLayoutPreset(source: unknown): AdvancedLayoutPreset {
  if (typeof source !== 'string' || new TextEncoder().encode(source).length > MAX_PRESET_BYTES) return error();
  let raw: unknown;
  try { raw = JSON.parse(source); } catch { return error(); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return error();
  const shape = raw as Record<string, unknown>;
  if (Object.keys(shape).length !== 3 || !Object.hasOwn(shape, 'format') || !Object.hasOwn(shape, 'version') || !Object.hasOwn(shape, 'layoutId') ||
      shape.format !== ADVANCED_LAYOUT_PRESET_FORMAT || shape.version !== ADVANCED_LAYOUT_PRESET_VERSION ||
      typeof shape.layoutId !== 'string' || !skuLayoutCandidate(shape.layoutId)) return error();
  return { format: ADVANCED_LAYOUT_PRESET_FORMAT, version: ADVANCED_LAYOUT_PRESET_VERSION, layoutId: shape.layoutId };
}
export async function importAdvancedLayoutPreset(file: File): Promise<AdvancedLayoutPreset> {
  if (!file || file.size < 1 || file.size > MAX_PRESET_BYTES || !file.name.toLowerCase().endsWith('.json')) return error();
  return parseAdvancedLayoutPreset(await file.text());
}
export function downloadAdvancedLayoutPreset(id: string): void {
  const json = exportAdvancedLayoutPreset(id);
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url; link.download = `astra-${id}-layout.json`;
  document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
