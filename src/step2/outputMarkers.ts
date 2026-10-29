import {visibleSections,type ProjectDocument} from './model.ts';

// Short per-block samples let the main process check the actual PDF without
// copying the full document through IPC. Long blocks contribute both ends.
export function pdfOutputTextMarkers(doc:ProjectDocument):string[]{
  const text=[doc.content.title,doc.content.author,doc.content.date];
  for(const section of visibleSections(doc)){
    text.push(section.title);
    for(const block of section.blocks)text.push(block.kind==='image'?block.caption:block.text);
  }
  return text.flatMap(value=>{
    const compact=value.normalize('NFC').replace(/\s+/gu,'');
    if(compact.length<6)return[];
    return compact.length<=96?[compact]:[compact.slice(0,48),compact.slice(-48)];
  });
}

export function pdfOutputImageCount(doc:ProjectDocument):number{
  return visibleSections(doc).reduce((count,section)=>count+section.blocks.filter(block=>block.kind==='image').length,0);
}
