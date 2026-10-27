import { blankProject, isProjectDocument, LIMITS, newIdentifier,
  type ContentBlock, type ImageAsset, type ProjectDocument } from '../step2/model.ts';
import type { PdfDraft } from './structure.ts';

const imagesSelected=(source:PdfDraft)=>source.pages.flatMap(p=>p.images.filter(x=>x.include));
export function pdfDraftToProject(draft:PdfDraft):ProjectDocument {
  if(!draft.pages.length||!draft.pages.some(page=>page.blocks.some(block=>!block.excluded&&block.text.trim())))
    throw Error('가져올 본문이 없습니다. PDF 추출 결과를 확인하세요.');
  const plain=draft.fileName.replace(/\.pdf$/i,'').replace(/[\u0000-\u001f]/g,'').slice(0,150)||'PDF 문서';
  const doc=blankProject();
  const sections=draft.pages.map(page=>{
    const blocks:ContentBlock[]=page.blocks.filter(block=>!block.excluded).map(block=>({
      id:newIdentifier(),kind:block.role,text:block.text,origin:{...block.origin},
    }));
    // Place decoded images near their source y position without rewriting
    // text blocks or undoing the user's explicit text block reordering.
    for(const image of [...page.images].filter(x=>x.include).sort((a,b)=>a.origin.y-b.origin.y)){
      const block:ContentBlock={id:newIdentifier(),kind:'image',assetId:image.id,
        caption:'',alignment:'center',size:'medium',origin:{...image.origin}};
      const next=blocks.findIndex(b=>b.origin&&b.origin.y>image.origin.y);
      blocks.splice(next<0?blocks.length:next,0,block);
    }
    return{id:newIdentifier(),title:'원본 '+page.number+'페이지',blocks};
  });
  if(sections.length>LIMITS.sections)throw Error('PDF 섹션 수가 저장 한도를 초과했습니다.');
  const out:ProjectDocument={...doc,name:'PDF · '+plain,content:{
    ...doc.content,title:plain,sections,
  }};
  if(!isProjectDocument(out))throw Error('변환된 PDF 문서 구조가 저장 한도를 초과했거나 유효하지 않습니다.');
  return out;
}
export function pdfDraftAssets(draft:PdfDraft,documentId:string):ImageAsset[]{
  const images=imagesSelected(draft);
  if(images.length>60)throw Error('PDF 복원 이미지가 60개 제한을 초과했습니다.');
  const seen=new Set<string>();let total=0;
  return images.map((img,index)=>{
    if(seen.has(img.id))throw Error('중복된 PDF 이미지 식별자가 있습니다.');
    seen.add(img.id);
    if(!(img.blob instanceof Blob)||img.blob.size<1||img.blob.size>LIMITS.imageBytes||
        img.mimeType!=='image/png'||img.width<1||img.height<1||
        img.width*img.height>LIMITS.imagePixels)
      throw Error('PDF 이미지가 지원 용량·형식·픽셀 범위를 벗어납니다.');
    total+=img.blob.size;
    if(total>70*1024*1024)throw Error('PDF 이미지 총합 70MiB 제한을 초과했습니다.');
    return{
      id:img.id,documentId,mimeType:'image/png',originalName:'pdf-image-'+img.origin.page+'-'+(index+1)+'.png',
      byteSize:img.blob.size,width:img.width,height:img.height,blob:img.blob,
    };
  });
}
