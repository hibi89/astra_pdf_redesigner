import test from 'node:test';
import assert from 'node:assert/strict';
import { scanImagePlacements, type ImageOpCodes } from '../src/step3/imageRecovery.ts';
import { makePdfDraft, type PdfPageInput } from '../src/step3/structure.ts';
import { pdfDraftToProject,pdfDraftAssets } from '../src/step3/convert.ts';
import { isProjectDocument } from '../src/step2/model.ts';
const op:ImageOpCodes={save:1,restore:2,transform:3,paintImageXObject:4,
  paintInlineImageXObject:5,paintImageMaskXObject:6};
const pixel=(text:string,page:number,x:number,y:number)=>({
  text,page,x,y,width:85,height:12,fontSize:12,
});
test('STEP3 images: PDF CTM stack maps two XObjects into independent top-left source regions',()=>{
  const ops={fnArray:[op.save,op.transform,op.paintImageXObject,op.restore,
    op.save,op.transform,op.paintImageXObject,op.restore],
    argsArray:[[],[120,0,0,60,45,600],['first'],[],[],[80,0,0,40,110,430],['second'],[]]};
  const found=scanImagePlacements(2,ops,[1,0,0,-1,0,842],595,842,op);
  assert.equal(found.length,2);
  assert.deepEqual(found.map(i=>i.origin),[
    {page:2,x:45,y:182,width:120,height:60},
    {page:2,x:110,y:372,width:80,height:40},
  ]);
  assert.deepEqual(found.map(i=>i.kind),['xobject','xobject']);
});
test('STEP3 images: reject unsupported masks and images with ambiguous rotation/clip geometry',()=>{
  const ops={fnArray:[op.save,op.transform,op.paintImageMaskXObject,op.restore,op.save,
    op.transform,op.paintImageXObject,op.restore],
    argsArray:[[],[80,0,0,60,30,600],['mask'],[],[],[0,120,-90,0,400,500],['rotate'],[]]};
  const found=scanImagePlacements(1,ops,[1,0,0,-1,0,842],595,842,op);
  assert.equal(found[0].kind,'unsupported');
  assert.ok(found[0].reason?.includes('마스크'));
  assert.equal(found[1].origin,null);
  assert.ok(found[1].reason?.includes('회전'));
});
test('STEP3 images: recovered PNG inserts into approximate page order, omitting disabled candidate',()=>{
  const base={number:1,width:595,height:842,pieces:[
    pixel('상단 문단',1,30,55),
    pixel('하단 문단',1,30,480),
  ],imageDetected:true};
  const first={id:'import-img-1',origin:{page:1,x:40,y:200,width:160,height:100},
    width:16,height:16,mimeType:'image/png' as const,
    blob:new Blob(['synthetic-image-bytes'],{type:'image/png'}),
    include:true as boolean,method:'decoded-xobject' as const};
  const second={...first,id:'import-img-2',origin:{page:1,x:40,y:310,width:160,height:100},include:false};
  const draft=makePdfDraft('mixed.pdf',[{...base,imageRecovery:{detected:3,images:[first,second],
    problems:['이미지 마스크 복원 지원 안 함']}}]);
  assert.equal(draft.pages[0].imageCount,3);
  assert.equal(draft.pages[0].images.length,2);
  assert.equal(draft.pages[0].omittedImages,1);
  assert.ok(draft.warnings.some(x=>x.includes('미복원 이미지 1건')));
  const project=pdfDraftToProject(draft);
  const blockKinds=project.content.sections[0].blocks.map(b=>b.kind);
  assert.deepEqual(blockKinds,['paragraph','image','paragraph']);
  assert.equal(isProjectDocument(project),true);
  const assets=pdfDraftAssets(draft,project.id);
  assert.equal(assets.length,1);
  assert.equal(assets[0].id,'import-img-1');
  assert.equal(assets[0].documentId,project.id);
});
test('STEP3 images: multiple pages retain numeric page order despite unordered inputs',()=>{
  const list:PdfPageInput[]=[
    {number:3,width:600,height:800,pieces:[pixel('THIRD_PAGE',3,40,70)],imageDetected:false},
    {number:1,width:600,height:800,pieces:[pixel('FIRST_PAGE',1,40,70)],imageDetected:false},
    {number:2,width:600,height:800,pieces:[pixel('SECOND_PAGE',2,40,70)],imageDetected:true,
      imageRecovery:{detected:1,images:[],problems:['복원 불가']}},
  ];
  const draft=makePdfDraft('pages.pdf',list);
  assert.deepEqual(draft.pages.map(x=>x.number),[1,2,3]);
  assert.deepEqual(draft.pages.map(x=>x.blocks[0].text),['FIRST_PAGE','SECOND_PAGE','THIRD_PAGE']);
  assert.ok(draft.warnings.some(w=>w.includes('2페이지 미복원 이미지')));
  assert.throws(()=>makePdfDraft('skipped.pdf',[list[0],list[2]]),/페이지 번호/);
});
test('STEP3 images: offset twin columns warn rather than claiming reliable reading order',()=>{
  const pieces=[
    pixel('LEFT_ONE',1,30,90),pixel('RIGHT_ONE',1,342,110),
    pixel('LEFT_TWO',1,30,190),pixel('RIGHT_TWO',1,342,210),
    pixel('LEFT_THREE',1,30,280),pixel('RIGHT_THREE',1,342,315),
  ];
  const draft=makePdfDraft('columns.pdf',[{number:1,width:600,height:800,pieces,imageDetected:false}]);
  assert.ok(draft.warnings.some(w=>w.includes('열 또는 넓은 텍스트 간격')));
  assert.equal(draft.pages[0].charCount,pieces.reduce((n,p)=>n+p.text.length,0));
});
