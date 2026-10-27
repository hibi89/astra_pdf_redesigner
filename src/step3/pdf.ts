import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDF_IMPORT_LIMITS, makePdfDraft, nextPdfTextCount, type PdfDraft, type PdfFragment, type PdfPageInput } from './structure.ts';
import { createImageRecoveryBudget, recoverPageImages, type ImageOpCodes } from './imageRecovery.ts';
import { countVectorPaintOps, type VectorPaintOpCodes } from './vectorRisk.ts';
import { scanGraphicsComposition, type GraphicsCompositionCodes } from './graphicsRisk.ts';

// Browser-only PDF.js adapter. Never send PDF bytes to a server.
export async function extractLocalPdf(file:File):Promise<PdfDraft>{
  if(file.size<10||file.size>PDF_IMPORT_LIMITS.bytes)throw Error('PDF는 30MiB 이하의 유효한 파일이어야 합니다.');
  if(!/\.pdf$/i.test(file.name))throw Error('확장자가 .pdf인 파일만 가져올 수 있습니다.');
  const header=new Uint8Array(await file.slice(0,5).arrayBuffer());
  if(String.fromCharCode(...header)!=='%PDF-')throw Error('PDF 파일 시그니처가 올바르지 않습니다.');
  const {getDocument,GlobalWorkerOptions,OPS,Util}=await import('pdfjs-dist');
  GlobalWorkerOptions.workerSrc=workerUrl;
  const bytes=new Uint8Array(await file.arrayBuffer());
  // A separate local copy avoids transferring the user's File's original ArrayBuffer.
  const loading=getDocument({data:bytes,stopAtErrors:true});
  try{
    const pdf=await loading.promise;
    if(pdf.numPages<1||pdf.numPages>PDF_IMPORT_LIMITS.pages)throw Error('지원하는 PDF는 1~50페이지입니다.');

    const pages:PdfPageInput[]=[];
    const imageBudget=createImageRecoveryBudget();
    let totalExtractedChars=0;
    for(let pageNum=1;pageNum<=pdf.numPages;pageNum++){
      const page=await pdf.getPage(pageNum);
      const view=page.getViewport({scale:1});
      const text=await page.getTextContent();
      const pieces:PdfFragment[]=[];
      for(const raw of text.items){
        if(!('str' in raw))continue;
        const item=raw as {str:string;transform:number[];width:number;height:number};
        if(!item.str)continue;
        const transform=Util.transform(view.transform,item.transform);
        const size=Math.max(1,Math.hypot(transform[2],transform[3]));
        // PDF.js' viewport coordinates are top-left for the rendered page.
        const x=transform[4],y=transform[5]-size;
        if(![x,y,item.width,item.height,size].every(Number.isFinite))continue;
        totalExtractedChars=nextPdfTextCount(totalExtractedChars,item.str);
        pieces.push({text:item.str,page:pageNum,x,y,width:Math.max(0,item.width),
          height:size,fontSize:size});
      }
      let imageDetected=false,operatorWarning='';
      let vectorPaintCount:number|undefined;
      let compositionRisk:PdfPageInput['compositionRisk'];
      let imageRecovery:PdfPageInput['imageRecovery'];
      try{
        const opList=await page.getOperatorList();
        vectorPaintCount=countVectorPaintOps(opList,OPS as unknown as VectorPaintOpCodes);
        compositionRisk=scanGraphicsComposition(opList,OPS as unknown as GraphicsCompositionCodes);
        const obj=page as unknown as {
          objs:{has?:(key:string)=>boolean;get:(key:string,cb?:(image:unknown)=>void)=>unknown};
          commonObjs?:{has?:(key:string)=>boolean;get:(key:string,cb?:(image:unknown)=>void)=>unknown};
        };
        imageRecovery=await recoverPageImages(
          pageNum,opList,view.transform,view.width,view.height,
          OPS as unknown as ImageOpCodes,{objs:obj.objs,commonObjs:obj.commonObjs},imageBudget,
        );
        imageDetected=imageRecovery.detected>0;
      }catch(error){operatorWarning=error instanceof Error?error.name:'그래픽 명령 분석 실패';}
      pages.push({number:pageNum,width:view.width,height:view.height,pieces,imageDetected,operatorWarning,imageRecovery,vectorPaintCount,compositionRisk});
      page.cleanup();
    }
    return makePdfDraft(file.name,pages);
  }catch(error){
    if(error instanceof Error&&/password/i.test(error.name+' '+error.message))
      throw Error('암호화된 PDF는 이번 버전에서 지원하지 않습니다. 원본에서 암호를 해제하고 다시 선택하세요.');
    throw error;
  }finally{
    await loading.destroy();
  }
}

