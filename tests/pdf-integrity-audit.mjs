// M04 independent structural audit for synthetic source and redesigned output PDFs.
// Geometry is a conservative PDF.js text-box heuristic, NOT OCR/semantic fidelity.
import {getDocument,OPS} from 'pdfjs-dist/legacy/build/pdf.mjs';

export function checkMarkerSequence(pages,markers,label='PDF'){
  if(!Array.isArray(pages)||!Array.isArray(markers)||!markers.length)
    throw Error('Expected pages and a non-empty marker list');
  const flattened=pages.map(x=>x.replace(/\s+/g,'').normalize('NFC')).join('');
  let last=-1;
  for(const marker of markers){
    const token=marker.replace(/\s+/g,'').normalize('NFC');
    if(!token)throw Error('Blank expected token');
    const start=flattened.indexOf(token);
    if(start<0||flattened.indexOf(token,start+token.length)!==-1)
      throw Error(label+': missing or duplicated source marker '+token);
    if(start<last)throw Error(label+': text reading sequence inverted at '+token);
    last=start;
  }
  return{markersChecked:markers.length};
}

export function checkTextGeometry(items,pageWidth,pageHeight,label='PDF'){
  const issues=[];
  let checked=0,skippedRotation=0;
  for(const item of items){
    if(typeof item.str!=='string'||!item.str.trim()||!Array.isArray(item.transform))
      continue;
    const t=item.transform;
    if(t.length<6||!t.slice(0,6).every(Number.isFinite)){
      issues.push('non-finite text transformation');continue;
    }
    // Ignore rotated glyph geometry (unproven) rather than pretending it passes.
    if(Math.abs(t[1])>0.05||Math.abs(t[2])>0.05){
      skippedRotation++;continue;
    }
    const x=t[4],right=x+item.width;
    // PDF text baseline is from bottom; text height is an approximation.
    const baseline=pageHeight-t[5];
    const top=baseline-item.height;
    if(!Number.isFinite(right)||!Number.isFinite(top)||!Number.isFinite(baseline)||
       x< -3||right>pageWidth+3||top< -3||baseline>pageHeight+3){
      issues.push('text extent exceeds page media box');
    }
    checked++;
  }
  if(issues.length)throw Error(label+': '+issues.length+' out-of-A4 text extent(s): '+issues[0]);
  return{checked,skippedRotation};
}
export async function auditPdfBytes(bytes,{markers,label='PDF',requireRaster=false,maxPages=30}={}){
  if(!bytes||!markers?.length)throw Error('PDF bytes and markers are mandatory');
  const task=getDocument({data:new Uint8Array(bytes),useSystemFonts:true});
  try{
    const doc=await task.promise;
    if(doc.numPages<1||doc.numPages>maxPages)
      throw Error(label+': page count not supported: '+doc.numPages);
    const pages=[];let checked=0,skippedRotation=0,rasterDraws=0;
    for(let i=1;i<=doc.numPages;i++){
      const p=await doc.getPage(i),view=p.getViewport({scale:1});
      if(Math.abs(view.width-595.276)>2||Math.abs(view.height-841.89)>2)
        throw Error(label+': non-A4 output at page '+i);
      const text=(await p.getTextContent()).items.filter(x=>typeof x.str==='string');
      const geometry=checkTextGeometry(text,view.width,view.height,label+' page '+i);
      checked+=geometry.checked;skippedRotation+=geometry.skippedRotation;
      pages.push(text.map(x=>x.str).join(' '));
      const ops=(await p.getOperatorList()).fnArray;
      rasterDraws+=ops.filter(x=>[
        OPS.paintImageXObject,OPS.paintInlineImageXObject,
        OPS.paintImageXObjectRepeat,OPS.paintInlineImageXObjectGroup,
      ].includes(x)).length;
    }
    checkMarkerSequence(pages,markers,label);
    if(requireRaster&&rasterDraws<1)throw Error(label+': expected raster draw missing');
    return{pages:doc.numPages,markers:markers.length,textItemsChecked:checked,
      skippedRotation,rasterDraws};
  }finally{await task.destroy();}
}
