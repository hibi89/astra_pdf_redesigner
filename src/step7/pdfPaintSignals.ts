// STEP7 local PDF structural advisory. Vector stroke counts can change during
// legitimate redesign; they are NOT a table/fidelity/visual parity certificate.
export interface PdfStrokeOpcodes {
 stroke:number;closeStroke:number;fillStroke:number;eoFillStroke:number;
 closeFillStroke:number;closeEOFillStroke:number;
}
export function countPdfVectorStrokes(
 fnArray:readonly number[],ops:PdfStrokeOpcodes,
):number{
 const strokeOps=new Set([
  ops.stroke,ops.closeStroke,ops.fillStroke,ops.eoFillStroke,
  ops.closeFillStroke,ops.closeEOFillStroke,
 ]);
 let count=0;
 for(const op of fnArray)if(strokeOps.has(op))count++;
 return count;
}
