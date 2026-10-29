'use strict';

let pdfjsPromise;
async function auditOutputPdf(bytes){
  const issues=[];
  try{
    pdfjsPromise??=import('pdfjs-dist/legacy/build/pdf.mjs');
    const {getDocument,OPS}=await pdfjsPromise;
    const task=getDocument({data:new Uint8Array(bytes),useSystemFonts:true});
    try{
      const pdf=await task.promise;
      if(pdf.numPages<1)issues.push('PDF 페이지가 없습니다.');
      let overflowItems=0,rotatedItems=0,nonA4Pages=0,blankPages=0,textItems=0,rasterDraws=0;
      const checkedPages=Math.min(pdf.numPages,200);
      for(let number=1;number<=checkedPages;number++){
        const page=await pdf.getPage(number),view=page.getViewport({scale:1});
        if(Math.abs(view.width-595.276)>2||Math.abs(view.height-841.89)>2)nonA4Pages++;
        const items=(await page.getTextContent()).items.filter(item=>typeof item.str==='string'&&item.str.trim());
        textItems+=items.length;
        let pageRaster=0;
        for(const item of items){
          const t=item.transform;
          if(!Array.isArray(t)||t.length<6||!t.slice(0,6).every(Number.isFinite))continue;
          if(Math.abs(t[1])>0.05||Math.abs(t[2])>0.05){rotatedItems++;continue;}
          const x=t[4],right=x+(Number(item.width)||0),baseline=view.height-t[5],top=baseline-(Number(item.height)||0);
          if(![right,top,baseline].every(Number.isFinite)||x< -3||right>view.width+3||top< -3||baseline>view.height+3)overflowItems++;
        }
        const ops=(await page.getOperatorList()).fnArray;
        pageRaster=ops.filter(op=>[OPS.paintImageXObject,OPS.paintInlineImageXObject,
          OPS.paintImageXObjectRepeat,OPS.paintInlineImageXObjectGroup,
          OPS.paintImageMaskXObject,OPS.paintImageMaskXObjectGroup,
          OPS.paintImageMaskXObjectRepeat,OPS.paintSolidColorImageMask].includes(op)).length;
        rasterDraws+=pageRaster;
        if(!items.length&&!pageRaster)blankPages++;
        page.cleanup();
      }
      if(pdf.numPages>checkedPages)issues.push(`총 ${pdf.numPages}페이지 중 앞 ${checkedPages}페이지만 자동 검사했습니다.`);
      if(nonA4Pages)issues.push(`${nonA4Pages}페이지의 출력 크기가 A4와 다릅니다.`);
      if(overflowItems)issues.push(`페이지 밖으로 벗어난 텍스트 영역 ${overflowItems}개를 찾았습니다.`);
      if(rotatedItems)issues.push(`회전된 텍스트 영역 ${rotatedItems}개는 자동 위치 검사를 완료하지 못했습니다.`);
      if(blankPages)issues.push(`텍스트와 래스터 이미지가 없는 페이지 ${blankPages}개를 찾았습니다. 빈 페이지 또는 벡터 전용 페이지인지 직접 확인하세요.`);
      return{pages:pdf.numPages,checkedPages,textItems,rasterDraws,issues};
    }finally{await task.destroy();}
  }catch(error){
    const reason=error instanceof Error?error.message:'알 수 없는 PDF 분석 오류';
    return{pages:0,checkedPages:0,textItems:0,rasterDraws:0,issues:['출력 구조를 자동 검사하지 못했습니다: '+reason.slice(0,160)]};
  }
}

module.exports={auditOutputPdf};
