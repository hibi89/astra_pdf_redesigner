// Synthetic 1p PDF with a true Form XObject that holds a raster + vector path.
// The page paints the form through a configurable ExtGState. No user data.
import {deflateSync} from 'node:zlib';
export function makeTransparencyFormPdf({alpha=0.4,group=true}={}){
  const dim=16,rgb=Buffer.alloc(dim*dim*3);
  for(let y=0;y<dim;y++)for(let x=0;x<dim;x++){
    const i=(y*dim+x)*3;rgb[i]=x*14;rgb[i+1]=y*14;rgb[i+2]=90;
  }
  const stream=(dict,raw)=>Buffer.concat([
    Buffer.from('<< '+dict+' /Length '+raw.length+' >>\nstream\n','ascii'),
    raw,Buffer.from('\nendstream','ascii'),
  ]);
  const form=Buffer.from([
    'q 104 0 0 62 8 12 cm /Im1 Do Q',
    '1 w 2 2 115 79 re S',
    '',
  ].join('\n'),'ascii');
  const page=Buffer.from([
    'BT /F1 16 Tf 45 765 Td (FORM_ALPHA_SOURCE_201) Tj ET',
    'q /GFade gs 1 0 0 1 110 475 cm /Fm1 Do Q',
    'BT /F1 12 Tf 45 295 Td (FORM_ALPHA_END_202) Tj ET',
    '',
  ].join('\n'),'ascii');
  const g=group?' /Group << /S /Transparency /I true /K false >>':'';
  const objects=[
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>','ascii'),
    Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>','ascii'),
    Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 7 0 R >> /XObject << /Fm1 5 0 R >> /ExtGState << /GFade 8 0 R >> >> /Contents 4 0 R >>','ascii'),
    stream('',page),
    stream('/Type /XObject /Subtype /Form /BBox [0 0 120 85] /Resources << /XObject << /Im1 6 0 R >> >>'+g,form),
    stream('/Type /XObject /Subtype /Image /Width '+dim+' /Height '+dim+
      ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode',deflateSync(rgb)),
    Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','ascii'),
    Buffer.from('<< /Type /ExtGState /ca '+alpha+' /CA '+alpha+' >>','ascii'),
  ];
  const parts=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')], offsets=[0];
  let pos=parts[0].length;
  for(let i=0;i<objects.length;i++){
    offsets.push(pos);
    const section=Buffer.concat([Buffer.from((i+1)+' 0 obj\n'),objects[i],Buffer.from('\nendobj\n')]);
    parts.push(section);pos+=section.length;
  }
  const refs=offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n');
  const footer=Buffer.from('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+refs+
    '\ntrailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+pos+'\n%%EOF\n');
  return Buffer.concat([...parts,footer]);
}
