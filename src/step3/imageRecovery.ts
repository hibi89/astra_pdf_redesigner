// Conservative, browser-only PDF.js image recovery.
// PDF native encoded bytes are NOT recovered. Supported decoded opaque pixel
// data is converted to PNG; masks, complex graphics and failed images are
// reported rather than silently omitted.
import type { PdfOrigin } from './structure.ts';

export interface RecoveredPdfImage {
  id:string;origin:PdfOrigin;width:number;height:number;mimeType:'image/png';
  blob:Blob;include:boolean;method:'decoded-xobject'|'decoded-inline';
}
export interface ImageRecoveryResult {
  detected:number;images:RecoveredPdfImage[];problems:string[];
}
export interface ImageOpCodes {
  save:number;restore:number;transform:number;paintImageXObject:number;
  paintInlineImageXObject:number;paintImageMaskXObject:number;
  paintImageXObjectRepeat?:number;paintInlineImageXObjectGroup?:number;
  paintImageMaskXObjectRepeat?:number;paintImageMaskXObjectGroup?:number;
  clip?:number;eoClip?:number;
}
export interface ImageOperatorList {
  fnArray:readonly number[];argsArray:readonly unknown[][];
}
const LIMIT={imageBytes:10*1024*1024,pixels:20_000_000,perPage:15,
  documentImages:50,documentPixels:40_000_000,documentPngBytes:40*1024*1024};
export interface ImageRecoveryBudget {
  maxImages:number;maxPixels:number;maxBytes:number;
  recoveredImages:number;recoveredPixels:number;recoveredBytes:number;
  limitWarningIssued:boolean;
}
export function createImageRecoveryBudget():ImageRecoveryBudget{
  return{maxImages:LIMIT.documentImages,maxPixels:LIMIT.documentPixels,
    maxBytes:LIMIT.documentPngBytes,recoveredImages:0,recoveredPixels:0,
    recoveredBytes:0,limitWarningIssued:false};
}
export function exceedsImageRecoveryBudget(
  budget:ImageRecoveryBudget,width:number,height:number,bytes=0,
):boolean{
  const pixels=width*height;
  return !Number.isSafeInteger(width)||!Number.isSafeInteger(height)||
    width<1||height<1||!Number.isSafeInteger(pixels)||
    !Number.isSafeInteger(bytes)||bytes<0||
    budget.recoveredImages+1>budget.maxImages||
    budget.recoveredPixels+pixels>budget.maxPixels||
    budget.recoveredBytes+bytes>budget.maxBytes;
}
type Matrix=[number,number,number,number,number,number];
const identity:Matrix=[1,0,0,1,0,0];
const multiply=(a:readonly number[],b:readonly number[]):Matrix=>[
 a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],
 a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],
 a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5],
];
const apply=(m:readonly number[],x:number,y:number):[number,number]=>[
 m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5],
];
const round=(value:number)=>Math.max(0,Math.round(value*100)/100);

export interface ImageOperator {
  opIndex:number;kind:'xobject'|'inline'|'unsupported';args:readonly unknown[];
  origin:PdfOrigin|null;reason?:string;clipWarning?:string;
}
export function scanImagePlacements(
  pageNumber:number,fn:ImageOperatorList,viewport:readonly number[],
  pageWidth:number,pageHeight:number,ops:ImageOpCodes
):ImageOperator[]{
  let matrix:Matrix=[...identity],clipActive=false;
  const stack:{matrix:Matrix;clipActive:boolean}[]=[];
  const found:ImageOperator[]=[];
  for(let i=0;i<fn.fnArray.length;i++){
    const op=fn.fnArray[i],args=fn.argsArray[i]??[];
    if(op===ops.save){stack.push({matrix:[...matrix],clipActive});continue;}
    if(op===ops.restore){
      const previous=stack.pop();
      matrix=previous?.matrix??[...identity];clipActive=previous?.clipActive??false;
      continue;
    }
    // Track active PDF clip scopes. Cropping the decoded pixels is not attempted.
    if((ops.clip!==undefined&&op===ops.clip)||(ops.eoClip!==undefined&&op===ops.eoClip)){
      clipActive=true;continue;
    }
    if(op===ops.transform){
      const delta=(args.length===6&&args.every(n=>typeof n==='number'&&Number.isFinite(n)))?args as number[]:null;
      if(delta)matrix=multiply(matrix,delta);
      continue;
    }
    const isXObject=op===ops.paintImageXObject;
    const isInline=op===ops.paintInlineImageXObject;
    const isImage=isXObject||isInline||op===ops.paintImageMaskXObject||
      op===ops.paintImageXObjectRepeat||op===ops.paintInlineImageXObjectGroup||
      op===ops.paintImageMaskXObjectRepeat||op===ops.paintImageMaskXObjectGroup;
    if(!isImage)continue;
    const isBasic=isXObject||isInline;
    // This simple path can only preserve axis-aligned rectangular placements.
    const combined=multiply(viewport,matrix);
    const corners=[[0,0],[0,1],[1,0],[1,1]].map(([x,y])=>apply(combined,x,y));
    const x=Math.min(...corners.map(p=>p[0])),y=Math.min(...corners.map(p=>p[1]));
    const right=Math.max(...corners.map(p=>p[0])),bottom=Math.max(...corners.map(p=>p[1]));
    const width=right-x,height=bottom-y;
    const skewOrRotation=Math.abs(combined[1])>.25||Math.abs(combined[2])>.25;
    const valid=[x,y,right,bottom,width,height].every(Number.isFinite)&&
      x>=-1&&y>=-1&&right<=pageWidth+1&&bottom<=pageHeight+1&&width>=2&&height>=2;
    const origin=valid&&!skewOrRotation?{page:pageNumber,x:round(x),y:round(y),width:round(width),height:round(height)}:null;
    found.push({opIndex:i,kind:isXObject?'xobject':isInline?'inline':'unsupported',args,
      origin,reason:!isBasic?'이미지 마스크·반복·그룹 그래픽은 자동 복원하지 않습니다.':
        skewOrRotation?'이미지가 회전되거나 기울어져 있어 자동 배치를 보류합니다.':
        !valid?'이미지 영역이 페이지 밖이거나 위치가 불확실합니다.':undefined,
      clipWarning:clipActive&&isBasic?
        '이미지에 클리핑 경로가 적용됐습니다. 복원 PNG에는 잘린 영역이 재현되지 않을 수 있으므로 원본과 반드시 대조하세요.':undefined});
  }
  return found;
}
function readPixels(image:unknown):{width:number;height:number;bytes:Uint8Array|Uint8ClampedArray;kind:number}|null{
  if(!image||typeof image!=='object')return null;
  const value=image as Record<string,unknown>;
  if(!Number.isInteger(value.width)||!Number.isInteger(value.height))return null;
  const width=value.width as number,height=value.height as number;
  if(width<1||height<1||width*height>LIMIT.pixels)return null;
  if(!(value.data instanceof Uint8Array||value.data instanceof Uint8ClampedArray))return null;
  return{width,height,kind:Number(value.kind),bytes:value.data};
}
async function decodedToPng(input:unknown):Promise<{blob:Blob;width:number;height:number}>{
  const value=(input&&typeof input==='object')?input as Record<string,unknown>:{};
  const bitmap=value.bitmap instanceof ImageBitmap?value.bitmap:input instanceof ImageBitmap?input:null;
  const pixels=readPixels(input);
  const width=bitmap?.width??pixels?.width??0,height=bitmap?.height??pixels?.height??0;
  if(!width||!height||width*height>LIMIT.pixels)throw Error('이미지 크기/픽셀 제한을 초과하거나 해독할 수 없습니다.');
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  if(!ctx)throw Error('브라우저 이미지 변환 도구를 사용할 수 없습니다.');
  if(bitmap){ctx.drawImage(bitmap,0,0); /* PDF.js object owns the bitmap; do not close */ }
  else if(pixels){
    const data=ctx.createImageData(width,height),source=pixels.bytes;
    if(pixels.kind===2){
      if(source.length<width*height*3)throw Error('RGB 이미지 픽셀이 불완전합니다.');
      for(let i=0,j=0;i<width*height;i++,j+=3){
        const k=i*4;data.data[k]=source[j];data.data[k+1]=source[j+1];data.data[k+2]=source[j+2];data.data[k+3]=255;
      }
    }else if(pixels.kind===3){
      if(source.length<width*height*4)throw Error('RGBA 이미지 픽셀이 불완전합니다.');
      data.data.set(source.subarray(0,width*height*4));
    }else if(pixels.kind===1){
      const rowBytes=Math.ceil(width/8);
      if(source.length<rowBytes*height)throw Error('흑백 이미지 픽셀이 불완전합니다.');
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        const bit=(source[y*rowBytes+(x>>3)]>>(7-(x%8)))&1,k=(y*width+x)*4;
        const level=bit?255:0;
        data.data[k]=data.data[k+1]=data.data[k+2]=level;data.data[k+3]=255;
      }
    }else throw Error('PDF.js 이미지 픽셀 유형을 지원하지 않습니다.');
    ctx.putImageData(data,0,0);
  }else throw Error('PDF.js에서 지원되는 이미지 픽셀을 얻지 못했습니다.');
  const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG 변환 실패')),'image/png'));
  canvas.width=0;canvas.height=0;
  if(blob.size<1||blob.size>LIMIT.imageBytes)throw Error('복원 이미지 PNG가 10MiB 제한을 초과합니다.');
  return{blob,width,height};
}
interface ObjectsApi {has?:(id:string)=>boolean;get:(id:string,callback?:(image:unknown)=>void)=>unknown}
async function obtainImage(obj:ObjectsApi,name:string):Promise<unknown>{
  if(obj.has?.(name))return obj.get(name);
  return new Promise((resolve,reject)=>{
    let settled=false;
    const timer=setTimeout(()=>{if(!settled){settled=true;reject(Error('이미지 객체 준비 시간 초과'));}},1500);
    try{obj.get(name,(value)=>{if(!settled){settled=true;clearTimeout(timer);resolve(value);}});}
    catch(e){if(!settled){settled=true;clearTimeout(timer);reject(e);}}
  });
}
export async function recoverPageImages(
  pageNumber:number,fn:ImageOperatorList,viewport:readonly number[],
  pageWidth:number,pageHeight:number,ops:ImageOpCodes,
  objects:{objs:ObjectsApi;commonObjs?:ObjectsApi},
  budget:ImageRecoveryBudget=createImageRecoveryBudget(),
):Promise<ImageRecoveryResult>{
  const entries=scanImagePlacements(pageNumber,fn,viewport,pageWidth,pageHeight,ops);
  const images:RecoveredPdfImage[]=[],problems:string[]=[];
  const reportBudgetLimit=()=>{
    if(budget.limitWarningIssued)return;
    budget.limitWarningIssued=true;
    problems.push('PDF 전체 이미지 복원 안전 한도에 도달했습니다. 이후 이미지는 복원하지 않으므로 원본과 대조하세요.');
  };
  let pageLimitReported=false;
  for(const entry of entries){
    // Keep valid decoded images, but surface clip-parity risks for review.
    if(entry.clipWarning)problems.push(entry.clipWarning);
    if(images.length>=LIMIT.perPage){
      if(!pageLimitReported){problems.push('페이지당 복원 이미지 15개 제한 초과');pageLimitReported=true;}
      continue;
    }
    if(!entry.origin||entry.reason||entry.kind==='unsupported'){
      problems.push(entry.reason??'이미지 위치 또는 픽셀 복원 불가');continue;
    }
    if(budget.recoveredImages>=budget.maxImages){reportBudgetLimit();continue;}
    try{
      let source:unknown;
      if(entry.kind==='inline'){source=entry.args[0];}
      else{
        const key=entry.args[0];
        if(typeof key!=='string'||!key.length)throw Error('XObject 식별자를 찾지 못했습니다.');
        try{source=await obtainImage(objects.objs,key);}
        catch(error){
          if(!objects.commonObjs)throw error;
          source=await obtainImage(objects.commonObjs,key);
        }
      }
      const value=(source&&typeof source==='object')?source as Record<string,unknown>:{};
      const bitmap=typeof ImageBitmap!=='undefined'&&value.bitmap instanceof ImageBitmap
        ?value.bitmap:typeof ImageBitmap!=='undefined'&&source instanceof ImageBitmap?source:null;
      const width=bitmap?.width??(Number.isInteger(value.width)?value.width as number:0);
      const height=bitmap?.height??(Number.isInteger(value.height)?value.height as number:0);
      const pixels=width*height;
      if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1||
         !Number.isSafeInteger(pixels)||pixels>LIMIT.pixels)
        throw Error('이미지 크기/픽셀 제한을 초과하거나 해독할 수 없습니다.');
      if(exceedsImageRecoveryBudget(budget,width,height)){
        reportBudgetLimit();continue;
      }
      const png=await decodedToPng(source);
      if(exceedsImageRecoveryBudget(budget,width,height,png.blob.size)){
        reportBudgetLimit();continue;
      }
      images.push({id:crypto.randomUUID(),origin:entry.origin,width:png.width,height:png.height,
        mimeType:'image/png',blob:png.blob,include:true,
        method:entry.kind==='inline'?'decoded-inline':'decoded-xobject'});
      budget.recoveredImages++;
      budget.recoveredPixels+=pixels;
      budget.recoveredBytes+=png.blob.size;
    }catch(error){problems.push(error instanceof Error?error.message:'이미지 추출 실패');}
  }
  return{detected:entries.length,images,problems};
}

