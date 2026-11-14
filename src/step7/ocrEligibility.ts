// OCR only for pages without PDF-selectable text. It must never replace
// existing real text with a probabilistic scan transcript.
export interface OcrPageTextItem {str?:unknown}
export function pageNeedsOcr(items:readonly OcrPageTextItem[]):boolean{
 if(!Array.isArray(items))return false; // invalid metadata never enables OCR
 return !items.some(item=>item&&typeof item.str==='string'&&item.str.trim().length>0);
}
