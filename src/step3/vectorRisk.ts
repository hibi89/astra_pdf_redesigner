// Conservative PDF.js operator-list diagnostic. A paint command is NOT a
// recoverable table, cell, line, or path. This module never reconstructs it.
// It counts conservative operator batches to make vector-only loss visible in review.
export interface VectorPaintOpCodes {
  constructPath?:number;
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
  // Modern PDF.js may pack PDF path painting into constructPath batches
  // without surfacing a separate stroke/fill op in fnArray. The metric is
  // a conservative *operator-batch risk indicator*, not a stroke, path,
  // table-cell or recoverable-geometry count. Avoid double-counting the same
  // path when both construction and paint operators are emitted.
  let constructed=0,painted=0;
  for(const code of fn.fnArray){
    if(ops.constructPath!==undefined&&code===ops.constructPath)constructed++;
    if(paintCodes.has(code))painted++;
  }
  return constructed>0?constructed:painted;
}
