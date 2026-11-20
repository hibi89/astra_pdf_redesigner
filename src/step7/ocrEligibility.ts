// OCR only for pages without PDF-selectable text. Never replace existing text
// with probabilistic OCR output. Unknown input metadata fails closed.
export function pageNeedsOcr(items:readonly unknown[]):boolean{
 if(!Array.isArray(items))return false;
 return !items.some(item=>item!==null&&typeof item==='object'&&'str' in item&&
  typeof item.str==='string'&&item.str.trim().length>0);
}
