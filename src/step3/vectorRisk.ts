// Conservative PDF.js operator-list diagnostic. A paint command is NOT a
// recoverable table, cell, line, or path. This module never reconstructs it.
// It counts risk events to make vector-only content loss visible in review.
export interface VectorPaintOpCodes {
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
  // Empty/unsupported operator-list shapes do not imply preserved vectors.
  let count=0;
  for(const code of fn.fnArray)if(paintCodes.has(code))count++;
  return count;
}
