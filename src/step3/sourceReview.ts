// M06-A ephemeral, conservative per-block user acknowledgement contract.
// Stored source coordinates are PDF.js viewport top-left points at scale 1.
import type {ProjectDocument,ContentBlock,PdfBlockOrigin} from '../step2/model.ts';
export function reviewableOrigin(origin:PdfBlockOrigin|undefined):origin is PdfBlockOrigin{
  return !!origin&&Number.isInteger(origin.page)&&origin.page>=1&&origin.page<=50&&
    [origin.x,origin.y,origin.width,origin.height].every(x=>Number.isFinite(x)&&x>=0&&x<=100000);
}
export function reviewableBlocks(doc:ProjectDocument):ContentBlock[]{
  return doc.content.sections.flatMap(s=>s.blocks.filter(b=>reviewableOrigin(b.origin)));
}
export function reviewSignature(block:ContentBlock):string{
  // Full string snapshot means any edit, caption change, or location change
  // invalidates an acknowledged review. No original document text is logged.
  return JSON.stringify([block.id,block.kind,block.origin,
    block.kind==='image'?[block.assetId,block.caption,block.alignment,block.size]:block.text]);
}
export function isReviewed(block:ContentBlock,marks:Readonly<Record<string,string>>):boolean{
  return reviewableOrigin(block.origin)&&marks[block.id]===reviewSignature(block);
}
export function anchorRectangle(origin:PdfBlockOrigin,width:number,height:number){
  if(!reviewableOrigin(origin)||!Number.isFinite(width)||!Number.isFinite(height)||
    width<=0||height<=0)return null;
  const x=Math.min(width,Math.max(0,origin.x));
  const y=Math.min(height,Math.max(0,origin.y));
  const right=Math.min(width,Math.max(x,origin.x+Math.max(origin.width,6)));
  const bottom=Math.min(height,Math.max(y,origin.y+Math.max(origin.height,10)));
  // Prevent a zero-width rectangle from disappearing at page boundaries.
  return{x,y,width:Math.max(1,right-x),height:Math.max(1,bottom-y)};
}
