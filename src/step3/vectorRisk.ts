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
    // PDF.js 6.x can emit "clip > constructPath" (not just
    // "constructPath > clip"). Both forms occur in real operator lists.
    const precedingClip=i>0&&(
      (ops.clip!==undefined&&commands[i-1]===ops.clip)||
      (ops.eoClip!==undefined&&commands[i-1]===ops.eoClip)
    );
    let followingClip=false,explicitPaintAfter=false;
    for(let j=i+1;j<commands.length;j++){
      const next=commands[j];
      if(next===ops.constructPath)break;
      if(paintCodes.has(next)){explicitPaintAfter=true;break;}
      if((ops.clip!==undefined&&next===ops.clip)||
         (ops.eoClip!==undefined&&next===ops.eoClip)){
        followingClip=true;break;
      }
      if(ops.endPath!==undefined&&next===ops.endPath)break;
    }
    // Only skip paths positively connected to a clip with no visible
    // paint. Ambiguous paths remain counted so damage isn't hidden.
    const clipOnly=(precedingClip||followingClip)&&!explicitPaintAfter;
    if(!clipOnly)constructed++;
  }
  // Keep this a risk indicator, not a claimed count of vector objects.
  // max prevents counting a constructed path and its paint operation twice.
  return Math.max(constructed,painted);
}
