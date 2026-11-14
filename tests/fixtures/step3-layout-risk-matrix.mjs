// Twelve entirely synthetic PDFs for STEP3 layout-risk review in real browsers.
import { deflateSync } from 'node:zlib';

function escapePdfText(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}
function textItem(text, x, y, angle=0, charSpacing=0) {
  const placement=angle
    ? '0 1 -1 0 '+x+' '+y+' Tm '
    : x+' '+y+' Td ';
  const spacing=charSpacing?' '+charSpacing+' Tc':'';
  return 'BT /F1 12 Tf'+spacing+' '+placement+'('+escapePdfText(text)+') Tj ET';
}
function wideTextItem(text,x,y,horizontalScale=240) {
  return 'BT /F1 12 Tf '+horizontalScale+' Tz '+x+' '+y+' Td ('+escapePdfText(text)+') Tj ET';
}
function line(x1,y1,x2,y2) {
  return x1+' '+y1+' m '+x2+' '+y2+' l S';
}
const gridLines=[
  line(40,600,550,600),line(40,545,550,545),line(40,490,550,490),
  line(40,490,40,600),line(295,490,295,600),line(550,490,550,600),
];
export const STEP3_LAYOUT_RISK_CASES=Object.freeze([
  {id:'single-column',expectedReview:false,markers:['SINGLE_A_1701','SINGLE_B_1702','SINGLE_C_1703'],
    commands:[textItem('SINGLE_A_1701',40,780),textItem('SINGLE_B_1702',40,740),textItem('SINGLE_C_1703',40,700)]},
  {id:'two-column',expectedReview:true,markers:['COL2_LEFT_A_1801','COL2_RIGHT_A_1802','COL2_LEFT_B_1803','COL2_RIGHT_B_1804'],
    commands:[textItem('COL2_LEFT_A_1801',40,720),textItem('COL2_RIGHT_A_1802',330,720),textItem('COL2_LEFT_B_1803',40,680),textItem('COL2_RIGHT_B_1804',330,680)]},
  {id:'grid-table',expectedReview:true,markers:['CELL_A_1901','CELL_B_1902','CELL_C_1903','CELL_D_1904'],
    commands:[...gridLines,textItem('CELL_A_1901',55,565),textItem('CELL_B_1902',310,565),textItem('CELL_C_1903',55,510),textItem('CELL_D_1904',310,510)]},
  {id:'rotated-text',expectedReview:true,markers:['NORMAL_2002','ROTATED_2001'],
    commands:[textItem('NORMAL_2002',40,740),textItem('ROTATED_2001',220,520,90)]},
  {id:'mixed-image-columns',expectedReview:true,markers:['MIX_LEFT_A_2101','MIX_RIGHT_A_2102','MIX_LEFT_B_2103','MIX_RIGHT_B_2104'],
    hasImage:true,commands:[textItem('MIX_LEFT_A_2101',40,720),textItem('MIX_RIGHT_A_2102',330,720),textItem('MIX_LEFT_B_2103',40,680),textItem('MIX_RIGHT_B_2104',330,680),'q 90 0 0 70 70 350 cm /Im1 Do Q']},
  {id:'numeric-negation',expectedReview:false,markers:['AMOUNT_1250','NOT_APPROVED_1806','DO_NOT_PAY_775'],
    commands:[textItem('AMOUNT_1250',40,760),textItem('NOT_APPROVED_1806',40,710),textItem('DO_NOT_PAY_775',40,660)]},
  {id:'interleaved-columns',expectedReview:true,markers:['INT_RIGHT_A_2201','INT_LEFT_A_2202','INT_RIGHT_B_2203','INT_LEFT_B_2204'],
    commands:[textItem('INT_RIGHT_A_2201',330,720),textItem('INT_LEFT_A_2202',40,720),textItem('INT_RIGHT_B_2203',330,680),textItem('INT_LEFT_B_2204',40,680)]},
  {id:'three-columns',expectedReview:true,markers:['THREE_LEFT_A_2301','THREE_MID_A_2302','THREE_RIGHT_A_2303','THREE_LEFT_B_2304','THREE_MID_B_2305','THREE_RIGHT_B_2306'],
    commands:[textItem('THREE_LEFT_A_2301',40,720),textItem('THREE_MID_A_2302',340,720),textItem('THREE_RIGHT_A_2303',460,720),textItem('THREE_LEFT_B_2304',40,680),textItem('THREE_MID_B_2305',340,680),textItem('THREE_RIGHT_B_2306',460,680)]},
  {id:'rotated-grid',expectedReview:true,markers:['GRID_NORMAL_2401','GRID_ROTATED_2402'],
    commands:[...gridLines,textItem('GRID_NORMAL_2401',55,565),textItem('GRID_ROTATED_2402',310,510,90)]},
  {id:'sparse-wide-text',expectedReview:true,markers:['WIDE_SPARSE_A_2501','WIDE_SPARSE_B_2502'],
    commands:[wideTextItem('WIDE_SPARSE_A_2501',40,720),wideTextItem('WIDE_SPARSE_B_2502',40,680)]},
  {id:'out-of-page-text',expectedReview:true,markers:['OUTSIDE_PAGE_2601','INSIDE_PAGE_2602'],
    commands:[textItem('OUTSIDE_PAGE_2601',-30,700),textItem('INSIDE_PAGE_2602',40,660)]},
  {id:'numeric-negation-grid',expectedReview:true,markers:['TOTAL_2750','NOT_APPROVED_2701','CELL_NUMBER_2702'],
    commands:[...gridLines,textItem('TOTAL_2750',55,565),textItem('NOT_APPROVED_2701',310,565),textItem('CELL_NUMBER_2702',55,510)]},
].map(item=>Object.freeze({...item,markers:Object.freeze(item.markers),commands:Object.freeze(item.commands)})));

function makeStream(dictionary, raw) {
  return Buffer.concat([
    Buffer.from('<< '+dictionary+' /Length '+raw.length+' >>\nstream\n','ascii'),
    raw,Buffer.from('\nendstream','ascii'),
  ]);
}
function makePdf(scenario) {
  const content=Buffer.from(scenario.commands.join('\n')+'\n','ascii');
  const resources=scenario.hasImage
    ? '/Font << /F1 5 0 R >> /XObject << /Im1 6 0 R >>'
    : '/Font << /F1 5 0 R >>';
  const objects=[
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>','ascii'),
    Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>','ascii'),
    Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << '+resources+' >> /Contents 4 0 R >>','ascii'),
    makeStream('',content),
    Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','ascii'),
  ];
  if(scenario.hasImage){
    const pixels=Buffer.from([255,40,40,40,255,40,40,40,255,255,255,40]);
    objects.push(makeStream('/Type /XObject /Subtype /Image /Width 2 /Height 2 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode',
      deflateSync(pixels)));
  }
  const chunks=[Buffer.from('%PDF-1.4\n% synthetic layout fixture\n','ascii')],offsets=[0];
  let cursor=chunks[0].length;
  for(let i=0;i<objects.length;i++){
    offsets.push(cursor);
    const chunk=Buffer.concat([Buffer.from((i+1)+' 0 obj\n','ascii'),objects[i],Buffer.from('\nendobj\n','ascii')]);
    chunks.push(chunk);cursor+=chunk.length;
  }
  const rows=offsets.slice(1).map(value=>String(value).padStart(10,'0')+' 00000 n ').join('\n');
  const trailer=Buffer.from('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+rows+
    '\ntrailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+cursor+'\n%%EOF\n','ascii');
  return Buffer.concat([...chunks,trailer]);
}
export function makeStep3LayoutRiskPdf(id) {
  const scenario=STEP3_LAYOUT_RISK_CASES.find(item=>item.id===id);
  if(!scenario)throw Error('Unknown STEP3 synthetic layout scenario: '+id);
  return makePdf(scenario);
}