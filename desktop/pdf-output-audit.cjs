'use strict';

let pdfjsPromise;
async function auditOutputPdf(bytes,expectedTextMarkers=[],expectedRasterImages=0){
  const issues=[];
  try{
    pdfjsPromise??=import('pdfjs-dist/legacy/build/pdf.mjs');
    const {getDocument,OPS}=await pdfjsPromise;
    const task=getDocument({data:new Uint8Array(bytes),useSystemFonts:true});
    try{
      const pdf=await task.promise;
      if(pdf.numPages<1)issues.push('PDF 페이지가 없습니다.');
      let overflowItems=0,rotatedItems=0,nonA4Pages=0,blankPages=0,textItems=0,rasterDraws=0;
      const outputText=[];
      const checkedPages=Math.min(pdf.numPages,200);
      for(let number=1;number<=checkedPages;number++){
        const page=await pdf.getPage(number),view=page.getViewport({scale:1});
        if(Math.abs(view.width-595.276)>2||Math.abs(view.height-841.89)>2)nonA4Pages++;
        const items=(await page.getTextContent()).items.filter(item=>typeof item.str==='string'&&item.str.trim());
        textItems+=items.length;
        outputText.push(items.map(item=>item.str).join(''));
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
      if(expectedRasterImages>rasterDraws)issues.push(`문서 이미지 ${expectedRasterImages}개 중 출력 PDF에서 래스터 이미지 ${rasterDraws}개만 확인했습니다. 이미지 누락 여부를 직접 확인하세요.`);
      const markerComparison=compareExpectedTextMarkers(outputText.join(''),expectedTextMarkers);
      if(markerComparison.missing.length)issues.push(`원문에서 선택한 텍스트 표식 ${markerComparison.missing.length}/${markerComparison.expected}개가 PDF에 없습니다. 편집 내용이 출력에서 빠졌는지 확인하세요.`);
      return{pages:pdf.numPages,checkedPages,textItems,rasterDraws,...markerComparison,issues};
    }finally{await task.destroy();}
  }catch(error){
    const reason=error instanceof Error?error.message:'알 수 없는 PDF 분석 오류';
    return{pages:0,checkedPages:0,textItems:0,rasterDraws:0,expected:0,found:0,missing:[],issues:['출력 구조를 자동 검사하지 못했습니다: '+reason.slice(0,160)]};
  }
}

function compareExpectedTextMarkers(outputText,expectedMarkers){
  const patterns=new Map();
  for(const source of expectedMarkers){
    const marker=String(source).normalize('NFC').replace(/\s+/gu,'');
    if(marker.length<6)continue;
    patterns.set(marker,(patterns.get(marker)||0)+1);
  }
  const entries=[...patterns],nodes=[{next:new Map(),fail:0,terminal:[],outputLink:0}];
  for(let id=0;id<entries.length;id++){
    let state=0;
    for(const char of entries[id][0]){
      let next=nodes[state].next.get(char);
      if(next===undefined){next=nodes.length;nodes[state].next.set(char,next);nodes.push({next:new Map(),fail:0,terminal:[],outputLink:0});}
      state=next;
    }
    nodes[state].terminal.push(id);
  }
  const queue=[];
  for(const child of nodes[0].next.values())queue.push(child);
  for(let cursor=0;cursor<queue.length;cursor++){
    const state=queue[cursor];
    for(const [char,child] of nodes[state].next){
      let fallback=nodes[state].fail;
      while(fallback&&!nodes[fallback].next.has(char))fallback=nodes[fallback].fail;
      nodes[child].fail=nodes[fallback].next.get(char)??0;
      const fail=nodes[child].fail;
      nodes[child].outputLink=nodes[fail].terminal.length?fail:nodes[fail].outputLink;
      queue.push(child);
    }
  }
  const found=entries.map(()=>0),text=outputText.normalize('NFC').replace(/\s+/gu,'');
  let state=0;
  for(const char of text){
    while(state&&!nodes[state].next.has(char))state=nodes[state].fail;
    state=nodes[state].next.get(char)??0;
    for(let output=nodes[state].terminal.length?state:nodes[state].outputLink;output;output=nodes[output].outputLink){
      for(const id of nodes[output].terminal)if(found[id]<entries[id][1])found[id]++;
    }
  }
  const missing=entries.flatMap(([marker,count],id)=>Array.from({length:Math.max(0,count-found[id])},()=>marker));
  return{expected:entries.reduce((sum,[,count])=>sum+count,0),found:found.reduce((sum,count)=>sum+count,0),missing};
}

module.exports={auditOutputPdf,compareExpectedTextMarkers};
