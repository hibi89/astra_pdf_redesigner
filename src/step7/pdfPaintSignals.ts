// STEP7 local PDF structural advisory. Vector stroke counts can change during
// legitimate redesign; they are NOT a table/fidelity/visual parity certificate.
export interface PdfStrokeOpcodes {
 stroke:number;closeStroke:number;fillStroke:number;eoFillStroke:number;
 closeFillStroke:number;closeEOFillStroke:number;constructPath:number;
}
export function countPdfVectorStrokes(
 fnArray:readonly number[],
 argsArray:readonly (readonly unknown[]|null|undefined)[],
 ops:PdfStrokeOpcodes,
):number{
 if(fnArray.length!==argsArray.length)throw Error('유효하지 않은 PDF 그리기 명령입니다.');
 const strokeOps=new Set([
  ops.stroke,ops.closeStroke,ops.fillStroke,ops.eoFillStroke,
  ops.closeFillStroke,ops.closeEOFillStroke,
 ]);
 let count=0;
 for(let i=0;i<fnArray.length;i++){
  // PDF.js 6.x folds painting actions into constructPath's first argument.
  // Counting only top-level OPS.stroke silently reports zero real strokes.
  const paint=fnArray[i]===ops.constructPath?argsArray[i]?.[0]:fnArray[i];
  if(typeof paint==='number'&&strokeOps.has(paint))count++;
 }
 return count;
}

export function countPdfPageStrokeDrift(
 source:readonly number[],output:readonly number[],
):number|null{
 if(source.length>50||output.length>50)throw Error('PDF 페이지 검수 제한을 초과했습니다.');
 if(source.length!==output.length)return null;
 let count=0;
 for(let i=0;i<source.length;i++){
  if(!Number.isSafeInteger(source[i])||source[i]<0||
     !Number.isSafeInteger(output[i])||output[i]<0)
   throw Error('유효하지 않은 PDF 선 그리기 정보입니다.');
  if(source[i]!==output[i])count++;
 }
 return count;
}
