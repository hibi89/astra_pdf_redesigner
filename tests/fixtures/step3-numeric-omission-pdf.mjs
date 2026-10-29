// Synthetic selectable-text PDF for omission matching around overlapping numeric strings.
export function makeNumericOmissionPdf(){
  const contents=Buffer.from([
    'BT /F1 14 Tf 40 780 Td (SOURCE_NUMERIC_LABEL_222) Tj ET',
    'BT /F1 12 Tf 40 720 Td (7) Tj ET',
    'BT /F1 12 Tf 150 720 Td (7.5%) Tj ET',
    '',
  ].join('\n'),'ascii');
  const stream=Buffer.concat([
    Buffer.from('<< /Length '+contents.length+' >>\nstream\n','ascii'),contents,
    Buffer.from('\nendstream','ascii'),
  ]);
  const objects=[
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>','ascii'),
    Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>','ascii'),
    Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>','ascii'),
    stream,
    Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','ascii'),
  ];
  const chunks=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')],offsets=[0];let position=chunks[0].length;
  for(let index=0;index<objects.length;index++){
    offsets.push(position);
    const chunk=Buffer.concat([Buffer.from((index+1)+' 0 obj\n','ascii'),objects[index],Buffer.from('\nendobj\n','ascii')]);
    chunks.push(chunk);position+=chunk.length;
  }
  const xrefOffset=position;
  const xref=['xref','0 '+offsets.length,'0000000000 65535 f ',...offsets.slice(1).map(offset=>String(offset).padStart(10,'0')+' 00000 n ')].join('\n');
  chunks.push(Buffer.from(xref+'\ntrailer\n<< /Size '+offsets.length+' /Root 1 0 R >>\nstartxref\n'+xrefOffset+'\n%%EOF\n','ascii'));
  return Buffer.concat(chunks);
}
