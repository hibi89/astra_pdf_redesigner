// This single action powers browser PDF printing and the installed Electron
// "Save PDF..." native dialog. Web users retain their existing print flow.
export interface DesktopPdfResponse {
  status:'saved'|'cancelled'|'error';
  message?:string;
}
declare global {
  interface Window {
    astraDesktop?:Readonly<{
      savePdf:(expectedTextMarkers?:string[],expectedRasterImages?:number)=>Promise<DesktopPdfResponse>;
      localModelStatus?:()=>Promise<{status:'available'|'unavailable';modelId?:string;reason?:string}>;
      localModelPropose?:(text:string)=>Promise<{status:string;suggested?:string;reason?:string}>;
      localModelCancel?:()=>Promise<{status:string}>;
    }>;
  }
}
export function hasDesktopPdfExport():boolean{
  return typeof window!=='undefined'&&typeof window.astraDesktop?.savePdf==='function';
}
export async function savePdfFromEditor(expectedTextMarkers:string[]=[],expectedRasterImages=0):Promise<'browser'|'saved'|'cancelled'>{
  if(!hasDesktopPdfExport()){
    window.print();
    return 'browser';
  }
  const reply=await window.astraDesktop!.savePdf(expectedTextMarkers,expectedRasterImages);
  if(reply?.status==='saved'||reply?.status==='cancelled')return reply.status;
  if(reply?.status==='error')throw Error(reply.message||'PDF 저장 중 오류가 발생했습니다.');
  throw Error('PDF 저장 응답을 확인할 수 없습니다.');
}
