// Advisory-only detection for PDF.js transparency and Form XObject content.
// A marker is not an object count, a rendered alpha value, or proof of
// geometric/pixel fidelity. This never changes extracted content.
export interface GraphicsCompositionRisk {
  transparencySignals:number;
  formScopes:number;
}
export interface GraphicsCompositionCodes {
  setGState?:number;
  beginGroup?:number;
  paintFormXObjectBegin?:number;
  setFillTransparent?:number;
  setStrokeTransparent?:number;
}
export function scanGraphicsComposition(
  list:{fnArray:readonly number[];argsArray?:readonly unknown[]},
  ops:GraphicsCompositionCodes,
):GraphicsCompositionRisk{
  let transparencySignals=0,formScopes=0;
  const candidates=list.fnArray;
  for(let i=0;i<candidates.length;i++){
    const op=candidates[i];
    if(ops.paintFormXObjectBegin!==undefined&&op===ops.paintFormXObjectBegin)formScopes++;
    if((ops.beginGroup!==undefined&&op===ops.beginGroup)||
      (ops.setFillTransparent!==undefined&&op===ops.setFillTransparent)||
      (ops.setStrokeTransparent!==undefined&&op===ops.setStrokeTransparent)){
      transparencySignals++;
    }
    if(ops.setGState===undefined||op!==ops.setGState)continue;
    const arg=list.argsArray?.[i];
    // PDF.js's setGState args: [[["ca", .4], ["CA", .4], ...]]
    if(!Array.isArray(arg)||!Array.isArray(arg[0]))continue;
    for(const item of arg[0]){
      if(!Array.isArray(item)||item.length<2)continue;
      const [key,val]=item as [unknown,unknown];
      if((key==='ca'||key==='CA')&&typeof val==='number'&&Number.isFinite(val)&&val<1){
        transparencySignals++;continue;
      }
      if(key==='SMask'&&val!==false&&val!==null&&val!==undefined&&val!=='None'){
        transparencySignals++;continue;
      }
      if(key==='BM'&&val!==undefined&&val!==null){
        // PDF.js may normalize blend modes to a single string or a name array.
        const blend=Array.isArray(val)?val[0]:val;
        if(typeof blend==='string'&&blend!=='Normal'&&blend!=='normal'&&blend!=='source-over'){
          transparencySignals++;
        }
      }
    }
  }
  return{transparencySignals,formScopes};
}
