// Synthetic selectable-text PDF with an ordinary image and the same image
// painted inside a PDF path clip. No user data, network or binary assets.
import {deflateSync} from 'node:zlib';

export function makeClippedImagePdf({paintInsideClip=false,paintOutsideClip=false,
  fillOutsideClip=false,strokeClipPath=false}={}){
  const dim=24,rgb=Buffer.alloc(dim*dim*3);
  for(let y=0;y<dim;y++)for(let x=0;x<dim;x++){
    const i=(y*dim+x)*3;
    rgb[i]=x*10;rgb[i+1]=y*10;rgb[i+2]=(x+y)*5;
  }
  const compressed=deflateSync(rgb);
  const commands=[
    'BT /F1 18 Tf 50 765 Td (STEP3_CLIP_SOURCE_842) Tj ET',
    'q',
    '96 0 0 64 60 610 cm /Im1 Do',
    'Q',
    'q',
    '85 455 70 44 re W n',
    ...(paintInsideClip?['1 w 86 470 m 154 470 l S']:[]),
    '140 0 0 90 55 435 cm /Im1 Do',
    'Q',
    ...(paintOutsideClip?['1 w 80 365 m 182 365 l S']:[]),
    ...(fillOutsideClip?['0.3 0.5 0.8 rg 220 330 45 20 re f']:[]),
    // A single path used for clipping and painting is an important boundary.
    ...(strokeClipPath?['q 310 95 70 40 re W S Q']:[]),
    'BT /F1 12 Tf 50 380 Td (STEP3_CLIP_END_842) Tj ET','',
  ].join('\n');
  const stream=(dict,raw)=>Buffer.concat([
    Buffer.from('<< '+dict+' /Length '+raw.length+' >>\nstream\n','ascii'),
    raw,Buffer.from('\nendstream','ascii'),
  ]);
  const objects=[
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),
    Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 6 0 R >> /XObject << /Im1 5 0 R >> >> /Contents 4 0 R >>'),
    stream('',Buffer.from(commands,'ascii')),
    stream('/Type /XObject /Subtype /Image /Width '+dim+' /Height '+dim+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode',compressed),
    Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'),
  ];
  const chunks=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')],offsets=[0];
  let position=chunks[0].length;
  for(let i=0;i<objects.length;i++){
    offsets.push(position);
    const item=Buffer.concat([Buffer.from(String(i+1)+' 0 obj\n'),objects[i],Buffer.from('\nendobj\n')]);
    chunks.push(item);position+=item.length;
  }
  const xref=position;
  const rows=offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n');
  const footer=Buffer.from('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+rows+
    '\ntrailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n','ascii');
  return Buffer.concat([...chunks,footer]);
}
