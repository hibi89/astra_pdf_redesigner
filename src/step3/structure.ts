// Pure and deterministic single-column PDF text reconstruction.
// This module does not touch storage, browser globals, or uploaded file bytes.
import type { ImageRecoveryResult, RecoveredPdfImage } from './imageRecovery.ts';
export type PdfRole='heading'|'paragraph'|'caption';
export interface PdfFragment {
  text:string; page:number; x:number; y:number; width:number; height:number; fontSize:number;
}
export interface PdfPageInput {
  number:number; width:number; height:number; pieces:PdfFragment[];
  imageDetected:boolean; operatorWarning?:string;imageRecovery?:ImageRecoveryResult;
  vectorPaintCount?:number;
}
export interface PdfOrigin {
  page:number; x:number; y:number; width:number; height:number;
}
export interface PdfDraftBlock {
  id:string; text:string; role:PdfRole; origin:PdfOrigin;
}
export interface PdfDraftPage {number:number; blocks:PdfDraftBlock[]; charCount:number; imageDetected:boolean; images:RecoveredPdfImage[];imageCount:number;omittedImages:number;vectorPaintCount:number;}
export interface PdfDraft {
  fileName:string; pageCount:number; pages:PdfDraftPage[]; warnings:string[]; totalChars:number;
}
export const PDF_IMPORT_LIMITS={bytes:30*1024*1024,pages:50,characters:500000,blocks:2500} as const;
const finite=(n:number)=>Number.isFinite(n)?n:0;
const round=(n:number)=>Math.round(finite(n)*100)/100;
const median=(a:number[])=>{
  const arr=a.filter(n=>Number.isFinite(n)&&n>0).sort((x,y)=>x-y);
  return arr.length?arr[Math.floor(arr.length/2)]:12;
};
interface PdfLine {text:string;x:number;y:number;width:number;height:number;fontSize:number}
function normalizePieces(page:PdfPageInput):PdfFragment[]{
  return page.pieces.filter(p=>p.text.length>0).map(p=>({
    ...p, x:finite(p.x),y:finite(p.y),width:Math.max(0,finite(p.width)),
    height:Math.max(1,finite(p.height)),fontSize:Math.max(1,finite(p.fontSize)),
  })).sort((a,b)=>Math.abs(a.y-b.y)>2? a.y-b.y : a.x-b.x);
}
export function reconstructLines(page:PdfPageInput):{lines:PdfLine[];multiColumn:boolean}{
  const pieces=normalizePieces(page);
  const groups:PdfFragment[][]=[];
  for(const piece of pieces){
    const tail=groups.at(-1);
    if(tail&&Math.abs(piece.y-median(tail.map(t=>t.y)))<=Math.min(6,Math.max(2,piece.fontSize*.37)))tail.push(piece);
    else groups.push([piece]);
  }
  let multiColumn=false;
  const lines=groups.map(group=>{
    const sorted=[...group].sort((a,b)=>a.x-b.x);
    const x=Math.min(...sorted.map(p=>p.x));
    const y=Math.min(...sorted.map(p=>p.y));
    let right=x,output='';
    for(let i=0;i<sorted.length;i++){
      const token=sorted[i];
      const gap=token.x-right;
      if(i&&gap>Math.max(2,token.fontSize*.28)&&!/\s$/.test(output)&&!/^\s/.test(token.text))output+=' ';
      if(i&&gap>page.width*.28&&token.text.trim().length>=2&&sorted[i-1].text.trim().length>=2)multiColumn=true;
      output+=token.text;
      right=Math.max(right,token.x+token.width);
    }
    return{text:output,x,y,width:Math.max(0,right-x),height:Math.max(...sorted.map(p=>p.height)),fontSize:median(sorted.map(p=>p.fontSize))};
  }).filter(line=>line.text.trim().length>0).sort((a,b)=>Math.abs(a.y-b.y)>2?a.y-b.y:a.x-b.x);
  // Distinct non-overlapping left/right text runs often indicate columns;
  // only warn, never silently rearrange multiple columns as one.
  const left=lines.filter(l=>l.x<page.width*.42&&l.width<page.width*.45);
  const right=lines.filter(l=>l.x>page.width*.52&&l.width<page.width*.45);
  if(left.length>=2&&right.length>=2){
    const overlap=Math.min(Math.max(...left.map(l=>l.y)),Math.max(...right.map(l=>l.y)))-
      Math.max(Math.min(...left.map(l=>l.y)),Math.min(...right.map(l=>l.y)));
    if(overlap>20)multiColumn=true;
  }
  // PDF.js can combine left and right runs into a single TextItem. That
  // erases their individual x coordinates even if its bbox still covers a
  // large gap. Warn conservatively on repeated short-but-sparse wide lines;
  // never reorder their text or claim that columns were reconstructed.
  const sparseWide=lines.filter(line=>{
    const characters=line.text.replace(/\s/g,'').length;
    return characters>=6&&characters<=75&&line.width>=page.width*.42&&
      line.width>characters*line.fontSize*.9;
  });
  if(sparseWide.length>=2)multiColumn=true;
  return{lines,multiColumn};
}
function lineRole(line:PdfLine,bodyFont:number):PdfRole{
  if(line.text.trim().length<150&&line.fontSize>=bodyFont*1.22)return'heading';
  if(line.text.trim().length<180&&line.fontSize<=bodyFont*.79)return'caption';
  return'paragraph';
}
export function makePdfDraft(fileName:string,pages:PdfPageInput[]):PdfDraft{
  if(!pages.length||pages.length>PDF_IMPORT_LIMITS.pages)throw Error('PDF 페이지 수가 지원 범위를 벗어났습니다.');
  const warnings:string[]=[];
  const sorted=[...pages].sort((a,b)=>a.number-b.number);
  if(sorted.some((p,i)=>p.number!==i+1))throw Error('PDF 페이지 번호가 연속되지 않거나 중복됐습니다.');
  const allFonts=sorted.flatMap(p=>p.pieces.filter(t=>t.text.trim()).map(t=>t.fontSize));
  const body=median(allFonts),outPages:PdfDraftPage[]=[];
  let totalChars=0,totalBlocks=0;
  for(const page of sorted){
    const {lines,multiColumn}=reconstructLines(page);
    const blocks:PdfDraftBlock[]=[];
    if(!lines.length)warnings.push(page.number+'페이지에서 선택 가능한 문자를 찾지 못했습니다. 스캔/이미지 또는 문자 매핑 실패 가능성이 있어 원본 검수가 필요합니다.');
    const images=page.imageRecovery?.images??[];
    const detected=page.imageRecovery?.detected??(page.imageDetected?1:0);
    const omitted=Math.max(0,detected-images.length);
    const vectorPaintCount=Number.isSafeInteger(page.vectorPaintCount)&&page.vectorPaintCount!>0?page.vectorPaintCount!:0;
    if(vectorPaintCount>0)warnings.push(page.number+'페이지 벡터 경로 페인팅 '+vectorPaintCount+'회 감지: 원본 표 선·셀 경계·도형은 새 문서로 자동 복원되지 않습니다. 원본과 대조해 수동 보완하세요. (이 값은 도형/셀 개수가 아닙니다.)');
    if(detected>0){
      warnings.push(page.number+'페이지에 PDF 이미지가 감지됐습니다. '+detected+'건 중 '+images.length+'건 PNG 재구성, '+omitted+'건 미복원. 원본 비트스트림이 아니라 PDF.js가 디코딩한 픽셀을 PNG로 재구성하므로 색상·마스크·배치를 반드시 대조하세요.');
      if(omitted)warnings.push(page.number+'페이지 미복원 이미지 '+omitted+'건은 새 PDF에서 누락될 수 있습니다. 별도로 확인하고 수동 보완하세요.');
    }
    for(const problem of page.imageRecovery?.problems??[])warnings.push(page.number+'페이지 PDF 이미지 제한/오류: '+problem.slice(0,140));
    if(page.operatorWarning)warnings.push(page.number+'페이지 그래픽 분석 일부 실패: '+page.operatorWarning.slice(0,100));
    if(multiColumn)warnings.push(page.number+'페이지에서 열 또는 넓은 텍스트 간격이 감지됐습니다. 자동 읽기 순서를 확인하세요.');
    for(const line of lines){
      const role=lineRole(line,body);
      const prev=blocks.at(-1);
      const lastLine=lines[lines.indexOf(line)-1];
      const isContinuation=prev&&lastLine&&role==='paragraph'&&prev.role==='paragraph'&&
        Math.abs(lastLine.x-line.x)<Math.max(12,body*1.8)&&
        line.y-(lastLine.y+lastLine.height)<=Math.max(12,body*1.5)&&
        line.y>=lastLine.y;
      if(isContinuation&&prev){
        // Visual line wraps are heuristic; retain explicit line breaks so no
        // content is silently merged or rewritten.
        prev.text+='\n'+line.text;
        prev.origin.width=round(Math.max(prev.origin.x+prev.origin.width,line.x+line.width)-prev.origin.x);
        prev.origin.height=round(Math.max(prev.origin.y+prev.origin.height,line.y+line.height)-prev.origin.y);
      }else{
        blocks.push({id:'p'+page.number+'-'+blocks.length,text:line.text,role,origin:{
          page:page.number,x:round(line.x),y:round(line.y),width:round(line.width),height:round(line.height),
        }});
        totalBlocks++;
      }
      totalChars+=line.text.length;
      if(totalChars>PDF_IMPORT_LIMITS.characters)throw Error('PDF 추출 텍스트가 50만 자 제한을 초과했습니다.');
      if(totalBlocks>PDF_IMPORT_LIMITS.blocks)throw Error('PDF 추출 블록이 2,500개 제한을 초과했습니다.');
    }
    outPages.push({number:page.number,blocks,charCount:lines.reduce((n,x)=>n+x.text.length,0),imageDetected:detected>0,images,imageCount:detected,omittedImages:omitted,vectorPaintCount});
  }
  if(!totalChars)throw Error('선택 가능한 텍스트가 없습니다. 스캔 PDF는 OCR 지원 전까지 가져올 수 없습니다.');
  warnings.unshift('PDF의 읽기 순서·줄바꿈·공백·제목/캡션 분류는 추정입니다. 원본과 대조해 검수한 뒤 문서함에 추가하세요.');
  return{fileName,pageCount:pages.length,pages:outPages,warnings,totalChars};
}
