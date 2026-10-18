import { blankProject, isProjectDocument, LIMITS, newIdentifier, type ContentBlock, type ProjectDocument } from '../step2/model.ts';
import type { PdfDraft } from './structure.ts';

export function pdfDraftToProject(draft:PdfDraft):ProjectDocument {
  if(!draft.pages.length||!draft.pages.some(page=>page.blocks.some(block=>block.text.trim())))
    throw Error('가져올 본문이 없습니다. PDF 추출 결과를 확인하세요.');
  const plain=draft.fileName.replace(/\.pdf$/i,'').replace(/[\u0000-\u001f]/g,'').slice(0,150)||'PDF 문서';
  const doc=blankProject();
  const sections=draft.pages.map(page=>({
    id:newIdentifier(),title:'원본 '+page.number+'페이지',
    blocks:page.blocks.map(block=>({
      id:newIdentifier(),kind:block.role,text:block.text,origin:{...block.origin},
    } as ContentBlock)),
  }));
  if(sections.length>LIMITS.sections)throw Error('PDF 섹션 수가 저장 한도를 초과했습니다.');
  const out:ProjectDocument={...doc,name:'PDF · '+plain,content:{
    ...doc.content,title:plain,sections,
  }};
  if(!isProjectDocument(out))throw Error('변환된 PDF 문서 구조가 저장 한도를 초과했거나 유효하지 않습니다.');
  return out;
}
