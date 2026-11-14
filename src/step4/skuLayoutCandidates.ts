// Optional ephemeral print-layout candidates; V2 persisted DesignSettings intentionally unchanged.
import type {ThemeId} from '../types.ts';
export type SkuLayoutFamily='frame'|'spine'|'masthead'|'folio'|'card'|'rail'|'rules'|'numbered'|'compact'|'editorial'|'split';
export interface SkuLayoutCandidate {readonly id:string;readonly label:string;readonly tier:'pro'|'business';readonly baseTheme:ThemeId;readonly family:SkuLayoutFamily;readonly topMarginMm:number;readonly sideMarginMm:number;readonly titleEm:number;readonly sectionGapMm:number;readonly alignment:'left'|'center'|'right'}
export const SKU_LAYOUT_CANDIDATES:readonly SkuLayoutCandidate[]=Object.freeze([
  {"id":"pro-01","label":"PRO 시안 01","tier":"pro","baseTheme":"diary","family":"frame","topMarginMm":12,"sideMarginMm":12,"titleEm":1.7,"sectionGapMm":7,"alignment":"left"},
  {"id":"pro-02","label":"PRO 시안 02","tier":"pro","baseTheme":"ledger","family":"spine","topMarginMm":14,"sideMarginMm":17,"titleEm":1.9,"sectionGapMm":9,"alignment":"center"},
  {"id":"pro-03","label":"PRO 시안 03","tier":"pro","baseTheme":"report","family":"masthead","topMarginMm":16,"sideMarginMm":22,"titleEm":2.1,"sectionGapMm":11,"alignment":"right"},
  {"id":"pro-04","label":"PRO 시안 04","tier":"pro","baseTheme":"compact","family":"folio","topMarginMm":18,"sideMarginMm":14,"titleEm":2.3,"sectionGapMm":13,"alignment":"left"},
  {"id":"pro-05","label":"PRO 시안 05","tier":"pro","baseTheme":"brief","family":"card","topMarginMm":20,"sideMarginMm":19,"titleEm":2.5,"sectionGapMm":15,"alignment":"right"},
  {"id":"pro-06","label":"PRO 시안 06","tier":"pro","baseTheme":"minimal","family":"rail","topMarginMm":22,"sideMarginMm":24,"titleEm":1.7,"sectionGapMm":17,"alignment":"left"},
  {"id":"pro-07","label":"PRO 시안 07","tier":"pro","baseTheme":"editorial","family":"rules","topMarginMm":24,"sideMarginMm":16,"titleEm":1.9,"sectionGapMm":7,"alignment":"center"},
  {"id":"pro-08","label":"PRO 시안 08","tier":"pro","baseTheme":"folio","family":"numbered","topMarginMm":12,"sideMarginMm":21,"titleEm":2.1,"sectionGapMm":9,"alignment":"right"},
  {"id":"pro-09","label":"PRO 시안 09","tier":"pro","baseTheme":"diary","family":"compact","topMarginMm":14,"sideMarginMm":13,"titleEm":2.3,"sectionGapMm":11,"alignment":"center"},
  {"id":"pro-10","label":"PRO 시안 10","tier":"pro","baseTheme":"ledger","family":"editorial","topMarginMm":16,"sideMarginMm":18,"titleEm":2.5,"sectionGapMm":13,"alignment":"right"},
  {"id":"pro-11","label":"PRO 시안 11","tier":"pro","baseTheme":"report","family":"split","topMarginMm":18,"sideMarginMm":23,"titleEm":1.7,"sectionGapMm":15,"alignment":"left"},
  {"id":"pro-12","label":"PRO 시안 12","tier":"pro","baseTheme":"compact","family":"frame","topMarginMm":20,"sideMarginMm":15,"titleEm":1.9,"sectionGapMm":17,"alignment":"center"},
  {"id":"business-01","label":"BUSINESS 시안 01","tier":"business","baseTheme":"brief","family":"spine","topMarginMm":22,"sideMarginMm":20,"titleEm":2.1,"sectionGapMm":7,"alignment":"left"},
  {"id":"business-02","label":"BUSINESS 시안 02","tier":"business","baseTheme":"minimal","family":"masthead","topMarginMm":24,"sideMarginMm":12,"titleEm":2.3,"sectionGapMm":9,"alignment":"center"},
  {"id":"business-03","label":"BUSINESS 시안 03","tier":"business","baseTheme":"editorial","family":"folio","topMarginMm":12,"sideMarginMm":17,"titleEm":2.5,"sectionGapMm":11,"alignment":"right"},
  {"id":"business-04","label":"BUSINESS 시안 04","tier":"business","baseTheme":"folio","family":"card","topMarginMm":14,"sideMarginMm":22,"titleEm":1.7,"sectionGapMm":13,"alignment":"left"},
  {"id":"business-05","label":"BUSINESS 시안 05","tier":"business","baseTheme":"diary","family":"rail","topMarginMm":16,"sideMarginMm":14,"titleEm":1.9,"sectionGapMm":15,"alignment":"right"},
  {"id":"business-06","label":"BUSINESS 시안 06","tier":"business","baseTheme":"ledger","family":"rules","topMarginMm":18,"sideMarginMm":19,"titleEm":2.1,"sectionGapMm":17,"alignment":"left"},
  {"id":"business-07","label":"BUSINESS 시안 07","tier":"business","baseTheme":"report","family":"numbered","topMarginMm":20,"sideMarginMm":24,"titleEm":2.3,"sectionGapMm":7,"alignment":"center"},
  {"id":"business-08","label":"BUSINESS 시안 08","tier":"business","baseTheme":"compact","family":"compact","topMarginMm":22,"sideMarginMm":16,"titleEm":2.5,"sectionGapMm":9,"alignment":"right"},
  {"id":"business-09","label":"BUSINESS 시안 09","tier":"business","baseTheme":"brief","family":"editorial","topMarginMm":24,"sideMarginMm":21,"titleEm":1.7,"sectionGapMm":11,"alignment":"center"},
  {"id":"business-10","label":"BUSINESS 시안 10","tier":"business","baseTheme":"minimal","family":"split","topMarginMm":12,"sideMarginMm":13,"titleEm":1.9,"sectionGapMm":13,"alignment":"right"},
]);
export function skuLayoutCandidate(id:string|undefined|null):SkuLayoutCandidate|undefined{
  if(typeof id!=='string'||!/^(?:pro-(?:0[1-9]|1[0-2])|business-(?:0[1-9]|10))$/.test(id))return undefined;
  return SKU_LAYOUT_CANDIDATES.find(layout=>layout.id===id);
}
