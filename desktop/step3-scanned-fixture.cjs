'use strict';
// Entirely synthetic scan-like raster PDFs. No real user scans or OCR engines.
const {deflateSync}=require('node:zlib');
const SCAN_MARKERS=Object.freeze({first:'ASTRA_SCAN_MIXED_TEXT_6202',end:'ASTRA_SCAN_MIXED_END_6203'});
function makeScannedPagesPdf({selectableSecondPage=false}={}){
  const dim=32;
  const rgb=Buffer.alloc(dim*dim*3);
  for(let y=0;y<dim;y++)for(let x=0;x<dim;x++){
    const offset=(y*dim+x)*3;
    const ink=((Math.floor(y/5)+Math.floor(x/7))%3)===0;
    rgb[offset]=ink?40:245;rgb[offset+1]=ink?65:245;rgb[offset+2]=ink?85:245;
  }
  const stream=(dict,raw)=>Buffer.concat([
    Buffer.from('<< '+dict+' /Length '+raw.length+' >>\nstream\n','ascii'),
    raw,Buffer.from('\nendstream','ascii'),
  ]);
  const first=Buffer.from('q 480 0 0 670 55 110 cm /Im1 Do Q\n','ascii');
  const second=Buffer.from([
    'q 480 0 0 670 55 110 cm /Im1 Do Q',
    ...(selectableSecondPage?[
      'BT /F1 14 Tf 60 795 Td ('+SCAN_MARKERS.first+') Tj ET',
      'BT /F1 12 Tf 60 775 Td ('+SCAN_MARKERS.end+') Tj ET',
    ]:[]),
    '',
  ].join('\n'),'ascii');
  const page=contents=>Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 6 0 R >> /XObject << /Im1 5 0 R >> >> /Contents '+contents+' 0 R >>','ascii');
  const objects=[
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>','ascii'),
    Buffer.from('<< /Type /Pages /Kids [3 0 R 7 0 R] /Count 2 >>','ascii'),
    page(4),
    stream('',first),
    stream('/Type /XObject /Subtype /Image /Width '+dim+' /Height '+dim+
      ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode',deflateSync(rgb)),
    Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','ascii'),
    page(8),
    stream('',second),
  ];
  const chunks=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')],offsets=[0];
  let cursor=chunks[0].length;
  for(let i=0;i<objects.length;i++){
    offsets.push(cursor);
    const entry=Buffer.concat([Buffer.from((i+1)+' 0 obj\n'),objects[i],Buffer.from('\nendobj\n')]);
    chunks.push(entry);cursor+=entry.length;
  }
  const rows=offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n');
  const footer=Buffer.from('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+rows+
    '\ntrailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+cursor+'\n%%EOF\n','ascii');
  return Buffer.concat([...chunks,footer]);
}
module.exports={SCAN_MARKERS,makeScannedPagesPdf};
