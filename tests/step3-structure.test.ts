import test from 'node:test';
import assert from 'node:assert/strict';
import {findUnrepresentedSourcePieces,insertManualPdfBlockAtSourcePosition,makePdfDraft,nextPdfTextCount,nextSourceReviewCount,PDF_IMPORT_LIMITS,reconstructLines,sortSourceReviewItems,visibleSourceReviewItems,type PdfPageInput} from '../src/step3/structure.ts';
import {pdfDraftToProject} from '../src/step3/convert.ts';
import {blankProject,isProjectDocument} from '../src/step2/model.ts';
const piece=(text:string,page:number,x:number,y:number,fontSize=12,width=120)=>({text,page,x,y,width,height:fontSize,fontSize});
test('STEP3 source text parity identifies missing and duplicate PDF.js text items while ignoring short layout fragments',()=>{
  const items=['ACCOUNT_123','ACCOUNT_123','1','x'];
  assert.deepEqual(findUnrepresentedSourcePieces(items,'ACCOUNT_123 1'),['ACCOUNT_123']);
  assert.deepEqual(findUnrepresentedSourcePieces(items,'ACCOUNT_123 ACCOUNT_123 1'),[]);
  assert.deepEqual(findUnrepresentedSourcePieces(['1'],'2'),['1'],'Single-digit source values must remain reviewable');
  assert.deepEqual(findUnrepresentedSourcePieces(['7'],'7.5%'),['7'],
    'A decimal that contains the same digit must not satisfy a missing integer source item');
  assert.deepEqual(findUnrepresentedSourcePieces(['12'],'112'),['12'],
    'A larger number must not satisfy a missing shorter numeric item');
  assert.deepEqual(findUnrepresentedSourcePieces(['7','7'],'7'),['7'],
    'Repeated numeric source cells require the same number of output occurrences');
  assert.deepEqual(findUnrepresentedSourcePieces(['7.5%'],'7.5%'),[]);
  assert.equal(findUnrepresentedSourcePieces(['A'.repeat(150)],'')[0].length,97,
    'Long missing source excerpts are truncated before display');
});
test('STEP3 omission review retains isolated numeric text fragments and their source positions',()=>{
  const draft=makePdfDraft('numeric-table.pdf',[{number:1,width:595,height:842,imageDetected:false,pieces:[
    piece('본문 내용',1,55,50),piece('7',1,310,90),piece('12',1,350,90),piece('7.5%',1,390,90),
  ]}]);
  const page=draft.pages[0];
  for(const value of ['7','12','7.5%'])assert.ok(page.sourceTextItems.includes(value),
    'A short numeric cell value must stay reviewable: '+value);
  const numberIndex=page.sourceTextItems.indexOf('7');
  assert.deepEqual(page.sourceTextOrigins[numberIndex],{page:1,x:310,y:90,width:120,height:12});
  for(const value of ['7','12','7.5%']){
    const included=page.sourceTextItems[0];
    assert.ok(findUnrepresentedSourcePieces([value],included).includes(value),
      'Removing a short number or decimal from included text must raise a mismatch: '+value);
  }
});
test('STEP3 omission review retains short Korean source fragments and their positions',()=>{
  const draft=makePdfDraft('short-korean.pdf',[{number:1,width:595,height:842,imageDetected:false,pieces:[
    piece('계약',1,120,210),piece('승인',1,165,210),piece('x',1,190,210),
  ]}]);
  const page=draft.pages[0];
  assert.deepEqual(page.sourceTextItems,['계약','승인']);
  assert.deepEqual(page.sourceTextOrigins,[
    {page:1,x:120,y:210,width:120,height:12},
    {page:1,x:165,y:210,width:120,height:12},
  ]);
  assert.deepEqual(findUnrepresentedSourcePieces(page.sourceTextItems,'승인'),['계약'],
    'Missing two-character Korean source text should remain visible for manual review');
});
test('STEP3 manual omission recovery preserves source order in review and strips coordinates on import',()=>{
  const draft=makePdfDraft('manual-order.pdf',[{number:1,width:595,height:842,imageDetected:false,pieces:[
    piece('FIRST_SOURCE_BLOCK',1,40,100),piece('LAST_SOURCE_BLOCK',1,40,220),
  ]}]);
  const recovered={id:'manual-1',role:'paragraph' as const,text:'RECOVERED_SOURCE_TEXT',manual:true,excluded:false};
  const origin={page:1,x:40,y:160,width:90,height:12};
  const result=insertManualPdfBlockAtSourcePosition(draft.pages[0].blocks,recovered,origin);
  assert.deepEqual(result.map(block=>block.text),[
    'FIRST_SOURCE_BLOCK','RECOVERED_SOURCE_TEXT','LAST_SOURCE_BLOCK',
  ]);
  assert.deepEqual(result[1].origin,origin,'Review-only source coordinates keep recovered blocks ordered');
  assert.deepEqual(insertManualPdfBlockAtSourcePosition(draft.pages[0].blocks,recovered).map(block=>block.text),[
    'FIRST_SOURCE_BLOCK','LAST_SOURCE_BLOCK','RECOVERED_SOURCE_TEXT',
  ],'Manual entry without an original source position remains appended for user placement');
  const later={...recovered,id:'manual-later',text:'RECOVERED_LATER'};
  const earlier={...recovered,id:'manual-earlier',text:'RECOVERED_EARLIER'};
  const twoRecoveries=insertManualPdfBlockAtSourcePosition(
    insertManualPdfBlockAtSourcePosition(draft.pages[0].blocks,later,{...origin,y:200}),
    earlier,{...origin,y:160},
  );
  assert.deepEqual(twoRecoveries.map(block=>block.text),[
    'FIRST_SOURCE_BLOCK','RECOVERED_EARLIER','RECOVERED_LATER','LAST_SOURCE_BLOCK',
  ],'Sequential recovery must retain the prior recovered fragment source position');
  const project=pdfDraftToProject({...draft,pages:[{...draft.pages[0],blocks:twoRecoveries}]});
  const saved=project.content.sections[0].blocks.find(block=>block.kind!=='image'&&block.text==='RECOVERED_EARLIER');
  assert.equal(saved?.kind==='image'?undefined:saved?.origin,undefined,
    'Review-only coordinates for manual blocks must not enter the persisted project');
});

test('STEP3 source omission entries sort by original vertical then horizontal coordinates',()=>{
  const items=[
    {id:'lower-left',origin:{page:1,x:20,y:80,width:10,height:10}},
    {id:'top-right',origin:{page:1,x:110,y:20,width:10,height:10}},
    {id:'middle',origin:{page:1,x:5,y:50,width:10,height:10}},
    {id:'top-left',origin:{page:1,x:25,y:20,width:10,height:10}},
  ];
  assert.deepEqual(sortSourceReviewItems(items).map(item=>item.id),[
    'top-left','top-right','middle','lower-left',
  ]);
  assert.deepEqual(items.map(item=>item.id),['lower-left','top-right','middle','top-left'],
    'Sorting review entries must not mutate the source extraction order');
});
test('STEP3 missing source review reveals long omission lists in bounded, complete pages',()=>{
  const items=Array.from({length:29},(_,index)=>'MISSING_'+index);
  assert.equal(visibleSourceReviewItems(items,12).length,12);
  assert.equal(nextSourceReviewCount(12,items.length),24);
  assert.equal(visibleSourceReviewItems(items,nextSourceReviewCount(12,items.length)).length,24);
  assert.equal(nextSourceReviewCount(24,items.length),29);
  assert.equal(nextSourceReviewCount(29,items.length),29);
  assert.deepEqual(visibleSourceReviewItems(items,-1),[]);
});
test('STEP3: cumulative extracted-text limit stops before later fragments are retained',()=>{
  const limit=PDF_IMPORT_LIMITS.characters;
  assert.equal(nextPdfTextCount(limit-2,'ab'),limit);
  assert.throws(()=>nextPdfTextCount(limit,'x'),/50만 자 제한/);
  assert.throws(()=>nextPdfTextCount(-1,'x'),/개수 상태/);
});
test('STEP3: excluded running text remains reviewable but is omitted from the imported document',()=>{
  const draft=makePdfDraft('header-footer.pdf',[{number:1,width:595,height:842,imageDetected:false,pieces:[
    piece('RUNNING_HEADER_101',1,40,820,8),
    piece('BODY_MARKER_102',1,40,420,12),
    piece('RUNNING_FOOTER_103',1,40,20,8),
  ]}]);
  const header=draft.pages[0].blocks.find(b=>b.text.includes('RUNNING_HEADER_101'))!;
  const footer=draft.pages[0].blocks.find(b=>b.text.includes('RUNNING_FOOTER_103'))!;
  header.excluded=true;footer.excluded=true;
  const project=pdfDraftToProject(draft);
  const output=project.content.sections.flatMap(section=>section.blocks)
    .filter(block=>block.kind!=='image').map(block=>block.text).join('\n');
  assert.ok(output.includes('BODY_MARKER_102'));
  assert.equal(header.sourceText,header.text,'Extracted baseline should be retained for reversible review edits');
  assert.equal(project.content.sections[0].blocks.some(block=>'sourceText' in block),false,
    'Transient extraction baseline must not enter the persisted document model');
  assert.ok(!output.includes('RUNNING_HEADER_101'));
  assert.ok(!output.includes('RUNNING_FOOTER_103'));
  assert.equal(header.text,'RUNNING_HEADER_101');
  assert.equal(footer.text,'RUNNING_FOOTER_103');
  assert.equal(header.excluded,true);assert.equal(footer.excluded,true);
  assert.ok(isProjectDocument(project));
});
test('STEP3: import rejects a draft when all text blocks are explicitly excluded',()=>{
  const draft=makePdfDraft('excluded.pdf',[{number:1,width:595,height:842,imageDetected:false,pieces:[piece('ONLY_HEADER_104',1,40,820,8)]}]);
  draft.pages[0].blocks[0].excluded=true;
  assert.throws(()=>pdfDraftToProject(draft),/가져올 본문이 없습니다/);
  assert.equal(draft.pages[0].blocks[0].text,'ONLY_HEADER_104');
});
test('STEP3: manually supplied missing text is imported without inventing source coordinates',()=>{
  const draft=makePdfDraft('manual-repair.pdf',[{number:1,width:595,height:842,imageDetected:false,pieces:[piece('추출된 본문',1,40,80)]}]);
  draft.pages[0].blocks.push({id:'manual-1',text:'원본 대조로 복구한 문장',role:'paragraph',manual:true});
  const project=pdfDraftToProject(draft),blocks=project.content.sections[0].blocks;
  assert.equal(blocks.length,2);
  assert.equal(blocks[1].kind,'paragraph');
  assert.equal(blocks[1].text,'원본 대조로 복구한 문장');
  assert.equal(blocks[1].origin,undefined);
  assert.ok(isProjectDocument(project));
  draft.pages[0].blocks.push({id:'manual-2',text:'',role:'paragraph',manual:true});
  assert.throws(()=>pdfDraftToProject(draft),/비어 있는 텍스트 블록/);
});
test('STEP3: Korean, numbers, punctuation and source coordinates survive single-column import',()=>{
  const source:PdfPageInput={number:1,width:595,height:842,imageDetected:false,pieces:[
    piece('두 번째 줄 2/3 100%',1,45,102),
    piece('첫 줄 가나다라마바사 ABC-123',1,45,80),
    piece('마지막 문단 & <tag>',1,45,165),
  ]};
  const draft=makePdfDraft('한글_보고서.pdf',[source]);
  assert.equal(draft.pageCount,1);
  assert.equal(draft.pages[0].blocks.map(b=>b.text).join('\n').includes('ABC-123'),true);
  assert.equal(draft.pages[0].blocks.map(b=>b.text).join('\n').includes('100%'),true);
  assert.equal(draft.pages[0].blocks.some(b=>b.text.includes('& <tag>')),true);
  const project=pdfDraftToProject(draft);
  assert.equal(project.schemaVersion,2);
  assert.equal(project.content.sections[0].blocks[0].kind,'paragraph');
  assert.equal((project.content.sections[0].blocks[0] as {origin:{page:number}}).origin.page,1);
  assert.ok(isProjectDocument(project));
});
test('STEP3: heading/caption heuristic is reversible and stores optional geometry',()=>{
  const draft=makePdfDraft('example.pdf',[{number:1,width:595,height:842,imageDetected:false,pieces:[
    piece('큰 제목',1,55,50,24),
    piece('본문 첫 줄',1,55,90,12),
    piece('본문 둘째 줄',1,55,110,12),
    piece('원문 자료 캡션',1,55,160,8),
    piece('다른 본문',1,55,210,12),
  ]}]);
  assert.equal(draft.pages[0].sourceTextItems.length,draft.pages[0].sourceTextOrigins.length,
    'Transient source snippets must retain a parallel source location for direct omission review');
  const bodyMarkerIndex=draft.pages[0].sourceTextItems.indexOf('본문 첫 줄');
  assert.ok(bodyMarkerIndex>=0);
  assert.deepEqual(draft.pages[0].sourceTextOrigins[bodyMarkerIndex],{page:1,x:55,y:90,width:120,height:12});
  assert.equal(draft.pages[0].blocks[0].role,'heading');
  assert.ok(draft.pages[0].blocks.some(b=>b.role==='caption'));
  const project=pdfDraftToProject(draft);
  assert.ok(project.content.sections[0].blocks.some(b=>b.kind==='caption'));
  assert.ok(isProjectDocument(project));
  assert.equal('sourceTextOrigins' in (project as unknown as Record<string,unknown>),false,
    'Transient source text locations must not enter the persisted project schema');
});
test('STEP3: text-absent document rejected, mixed empty pages and omitted images warned',()=>{
  const empty:PdfPageInput={number:1,width:595,height:842,imageDetected:true,pieces:[]};
  assert.throws(()=>makePdfDraft('scan.pdf',[empty]),/선택 가능한 텍스트/);
  const mixed=makePdfDraft('mixed.pdf',[empty,{number:2,width:595,height:842,imageDetected:false,pieces:[piece('확인 본문',2,33,70)]}]);
  assert.ok(mixed.warnings.some(w=>w.includes('1페이지에서 선택 가능한 문자를')));
  assert.ok(mixed.warnings.some(w=>w.includes('이미지가 감지')));
  const project=pdfDraftToProject(mixed);
  assert.equal(project.content.sections[0].blocks.length,0);
  assert.ok(isProjectDocument(project));
});
test('STEP3: invalid PDF origin rejected while original STEP2 model stays compatible',()=>{
  const legacy=blankProject();
  assert.ok(isProjectDocument(legacy));
  const draft=makePdfDraft('sample.pdf',[{number:1,width:500,height:700,imageDetected:false,pieces:[piece('본문',1,20,30)]}]);
  const project=pdfDraftToProject(draft);
  const block=project.content.sections[0].blocks[0];
  assert.ok(block.kind!=='image'&&block.origin?.page===1);
  if(block.kind!=='image')block.origin={page:0,x:0,y:0,width:10,height:10};
  assert.equal(isProjectDocument(project),false);
});
test('STEP3: suspect large side-by-side text gap triggers reading-order warning',()=>{
  const p:PdfPageInput={number:1,width:600,height:840,imageDetected:false,pieces:[
    piece('왼쪽 문장',1,20,70,12,100),piece('오른쪽 문장',1,420,70,12,100),
  ]};
  assert.equal(reconstructLines(p).multiColumn,true);
  assert.ok(makePdfDraft('col.pdf',[p]).warnings.some(w=>w.includes('열 또는')));
});

test('STEP3: merged sparse wide text items warn about possible columns without rewriting text',()=>{
  const merged={number:1,width:595,height:842,imageDetected:false,pieces:[
    piece('LEFT_ALPHA_902 RIGHT_ALPHA_903',1,40,110,12,407),
    piece('LEFT_BETA_904 RIGHT_BETA_905',1,40,150,12,399),
    piece('TABLE_A_906 TABLE_B_907',1,50,260,11,328),
    piece('TABLE_C_908 TABLE_D_909',1,50,320,11,328),
  ]};
  const result=reconstructLines(merged);
  assert.equal(result.multiColumn,true);
  const draft=makePdfDraft('merged-columns.pdf',[merged]);
  assert.ok(draft.warnings.some(w=>w.includes('열 또는 넓은 텍스트 간격')));
  assert.ok(draft.pages[0].blocks.some(b=>b.text.includes('LEFT_ALPHA_902 RIGHT_ALPHA_903')));
  assert.ok(draft.pages[0].blocks.some(b=>b.text.includes('TABLE_C_908 TABLE_D_909')));
});

test('STEP3: extraction quality flags identify damaged glyph mappings and text outside the source page',()=>{
  const draft=makePdfDraft('damaged-text.pdf',[{number:1,width:595,height:842,imageDetected:false,pieces:[
    piece('본문 � 숫자 ',1,40,80,12,120),piece('경계 밖 텍스트',1,580,840,12,80),
  ]}]);
  assert.equal(draft.pages[0].reviewFlags.length,2);
  assert.ok(draft.warnings.some(w=>w.includes('대체 문자 또는 개인 영역')));
  assert.ok(draft.warnings.some(w=>w.includes('페이지 경계 밖')));
  assert.ok(draft.pages[0].blocks.some(b=>b.text.includes('�')),'Suspicious source text must remain available for manual correction');
});

