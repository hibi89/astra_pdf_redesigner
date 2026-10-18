import test from 'node:test';
import assert from 'node:assert/strict';
import {makePdfDraft,reconstructLines,type PdfPageInput} from '../src/step3/structure.ts';
import {pdfDraftToProject} from '../src/step3/convert.ts';
import {blankProject,isProjectDocument} from '../src/step2/model.ts';
const piece=(text:string,page:number,x:number,y:number,fontSize=12,width=120)=>({text,page,x,y,width,height:fontSize,fontSize});
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
  assert.equal(draft.pages[0].blocks[0].role,'heading');
  assert.ok(draft.pages[0].blocks.some(b=>b.role==='caption'));
  const project=pdfDraftToProject(draft);
  assert.ok(project.content.sections[0].blocks.some(b=>b.kind==='caption'));
  assert.ok(isProjectDocument(project));
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
