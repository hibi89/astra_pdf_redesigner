// Deterministic, entirely synthetic two-page selectable PDF. The content is
// deliberately NOT a fidelity golden image: the layout includes two text
// columns, a vector-drawn table, and a raster image to test content preservation
// and explicit review warnings without implying table/geometry equivalence.
import { deflateSync } from 'node:zlib';

export const MIXED_LAYOUT_MARKERS = Object.freeze([
  'RUNNING_HEADER_P1_914',
  'STEP3_SOURCE_P1_BEGIN_901',
  'LEFT_ALPHA_902', 'RIGHT_ALPHA_903',
  'LEFT_BETA_904', 'RIGHT_BETA_905',
  'TABLE_A_906', 'TABLE_B_907',
  'TABLE_C_908', 'TABLE_D_909',
  'STEP3_SOURCE_P1_END_910',
  'RUNNING_FOOTER_P1_915',
  'RUNNING_HEADER_P2_916',
  'STEP3_SOURCE_P2_BEGIN_911',
  'PAGE_TWO_TOKEN_912',
  'STEP3_SOURCE_P2_END_913',
  'RUNNING_FOOTER_P2_917',
]);

export function makeMixedLayoutPdf() {
  const dim = 32;
  const rgb = Buffer.alloc(dim * dim * 3);
  for (let y = 0; y < dim; y++) for (let x = 0; x < dim; x++) {
    const i = (y * dim + x) * 3;
    rgb[i] = x * 7; rgb[i + 1] = y * 7; rgb[i + 2] = (x + y) * 3;
  }
  const firstPage = [
    'BT /F1 8 Tf 40 820 Td (RUNNING_HEADER_P1_914) Tj ET',
    'BT /F1 16 Tf 40 788 Td (STEP3_SOURCE_P1_BEGIN_901) Tj ET',
    'BT /F1 12 Tf 40 720 Td (LEFT_ALPHA_902) Tj ET',
    'BT /F1 12 Tf 333 713 Td (RIGHT_ALPHA_903) Tj ET',
    'BT /F1 12 Tf 40 681 Td (LEFT_BETA_904) Tj ET',
    'BT /F1 12 Tf 333 677 Td (RIGHT_BETA_905) Tj ET',
    // Vector table outlines are not images and must not be declared preserved.
    '1 w 40 490 510 108 re S',
    '40 544 m 550 544 l S',
    '295 490 m 295 598 l S',
    'BT /F1 11 Tf 50 563 Td (TABLE_A_906) Tj ET',
    'BT /F1 11 Tf 305 563 Td (TABLE_B_907) Tj ET',
    'BT /F1 11 Tf 50 509 Td (TABLE_C_908) Tj ET',
    'BT /F1 11 Tf 305 509 Td (TABLE_D_909) Tj ET',
    'q 170 0 0 110 70 319 cm /Im1 Do Q',
    'BT /F1 12 Tf 40 241 Td (STEP3_SOURCE_P1_END_910) Tj ET',
    'BT /F1 8 Tf 40 20 Td (RUNNING_FOOTER_P1_915) Tj ET',
    '',
  ].join('\n');
  const secondPage = [
    'BT /F1 8 Tf 45 820 Td (RUNNING_HEADER_P2_916) Tj ET',
    'BT /F1 18 Tf 45 760 Td (STEP3_SOURCE_P2_BEGIN_911) Tj ET',
    'BT /F1 12 Tf 45 675 Td (PAGE_TWO_TOKEN_912) Tj ET',
    'BT /F1 12 Tf 45 605 Td (STEP3_SOURCE_P2_END_913) Tj ET',
    'BT /F1 8 Tf 45 20 Td (RUNNING_FOOTER_P2_917) Tj ET',
    '',
  ].join('\n');
  const stream = (dictionary, raw) => Buffer.concat([
    Buffer.from('<< ' + dictionary + ' /Length ' + raw.length + ' >>\nstream\n', 'ascii'),
    raw,
    Buffer.from('\nendstream', 'ascii'),
  ]);
  const objects = [
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),
    Buffer.from('<< /Type /Pages /Kids [3 0 R 7 0 R] /Count 2 >>'),
    Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 6 0 R >> /XObject << /Im1 5 0 R >> >> /Contents 4 0 R >>'),
    stream('', Buffer.from(firstPage, 'ascii')),
    stream('/Type /XObject /Subtype /Image /Width ' + dim + ' /Height ' + dim +
      ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode', deflateSync(rgb)),
    Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'),
    Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 6 0 R >> >> /Contents 8 0 R >>'),
    stream('', Buffer.from(secondPage, 'ascii')),
  ];
  const chunks = [Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'binary')], offsets = [0];
  let cursor = chunks[0].length;
  for (let i = 0; i < objects.length; i++) {
    offsets.push(cursor);
    const chunk = Buffer.concat([Buffer.from(String(i + 1) + ' 0 obj\n'), objects[i], Buffer.from('\nendobj\n')]);
    chunks.push(chunk);
    cursor += chunk.length;
  }
  const rows = offsets.slice(1).map(n => String(n).padStart(10, '0') + ' 00000 n ').join('\n');
  const footer = Buffer.from('xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n' + rows +
    '\ntrailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + cursor + '\n%%EOF\n', 'ascii');
  return Buffer.concat([...chunks, footer]);
}
