// Conservative PDF.js operator-list diagnostic. A paint command is NOT a
// recoverable table, cell, line, or path. This module never reconstructs it.
// It counts conservative operator batches to make vector-only loss visible in review.
export interface VectorPaintOpCodes {
  constructPath?:number;clip?:number;eoClip?:number;endPath?:number;
  stroke?:number;closeStroke?:number;
  fill?:number;eoFill?:number;
  fillStroke?:number;eoFillStroke?:number;
  closeFillStroke?:number;closeEOFillStroke?:number;
}
export function countVectorPaintOps(
  fn:{fnArray:readonly number[]},ops:VectorPaintOpCodes
):number{
  const candidates=[
    ops.stroke,ops.closeStroke,ops.fill,ops.eoFill,
    ops.fillStroke,ops.eoFillStroke,ops.closeFillStroke,ops.closeEOFillStroke,
  ];
  const paintCodes=new Set(candidates.filter((v):v is number=>Number.isInteger(v)));
  // Modern PDF.js may fold paints into constructPath batches. A constructPath
  // that leads exclusively to clip/eoClip is a clipping mask, NOT evidence of
  // preserved/unpreserved vector table lines. Exclude that common false alarm.
  // Explicit paint ops still count when constructPath is not provided.
  let constructed=0,painted=0;
  const commands=fn.fnArray;
  for(let i=0;i<commands.length;i++){
    const code=commands[i];
    if(paintCodes.has(code))painted++;
    if(ops.constructPath===undefined||code!==ops.constructPath)continue;
    let clipOnly=false;
    for(let j=i+1;j<commands.length;j++){
      const next=commands[j];
      if(next===ops.constructPath||paintCodes.has(next))break;
      if((ops.clip!==undefined&&next===ops.clip)||
         (ops.eoClip!==undefined&&next===ops.eoClip)){
        clipOnly=true;break;
      }
      // A path ended without an explicit paint is still a conservative
      // risk signal unless positively classified as a clip-only path.
      if(ops.endPath!==undefined&&next===ops.endPath)break;
    }
    if(!clipOnly)constructed++;
  }
  // Keep this a risk indicator, not a claimed count of vector objects.
  // max prevents counting a constructed path and its paint operation twice.
  return Math.max(constructed,painted);
}
