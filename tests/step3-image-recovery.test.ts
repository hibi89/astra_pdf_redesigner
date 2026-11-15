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

test('STEP3 images: repeat/group/mask operators remain visible in detected and missing counts',async()=>{
  const extended:ImageOpCodes={...op,paintImageXObjectRepeat:7,
    paintInlineImageXObjectGroup:8,paintImageMaskXObjectRepeat:9};
  const fn={fnArray:[extended.save,extended.transform,extended.paintImageMaskXObject,
    extended.paintImageXObjectRepeat!,extended.paintInlineImageXObjectGroup!,
    extended.paintImageMaskXObjectRepeat!,extended.restore],
    argsArray:[[],[120,0,0,90,45,600],['mask'],['repeat'],['group'],['mask-repeat'],[]]};
  const placements=scanImagePlacements(3,fn,[1,0,0,-1,0,842],595,842,extended);
  assert.equal(placements.length,4);
  assert.ok(placements.every(item=>item.kind==='unsupported'&&item.reason?.includes('복원하지')));
  const {recoverPageImages}=await import('../src/step3/imageRecovery.ts');
  const recovered=await recoverPageImages(3,fn,[1,0,0,-1,0,842],595,842,extended,{
    objs:{get:()=>{throw Error('Unsupported op must not request pixel data');}},
  });
  assert.equal(recovered.detected,4);
  assert.equal(recovered.images.length,0);
  assert.equal(recovered.problems.length,4);
  const draft=makePdfDraft('unsupported.pdf',[{number:1,width:595,height:842,
    pieces:[pixel('보존되는 문단',1,40,80)],imageDetected:true,imageRecovery:recovered}]);
  assert.equal(draft.pages[0].omittedImages,4);
  assert.ok(draft.warnings.some(w=>w.includes('미복원 이미지 4건')));
});
test('STEP3 images: off-page and zero-area placements are reported instead of imported',async()=>{
  const fn={fnArray:[op.save,op.transform,op.paintImageXObject,op.restore,
    op.save,op.transform,op.paintInlineImageXObject,op.restore],
    argsArray:[[],[100,0,0,80,590,600],['off-page'],[],[],[0,0,0,80,30,600],[{}],[]]};
  const placements=scanImagePlacements(1,fn,[1,0,0,-1,0,842],595,842,op);
  assert.equal(placements.length,2);
  assert.ok(placements.every(p=>p.origin===null&&p.reason?.includes('위치가 불확실')));
  const {recoverPageImages}=await import('../src/step3/imageRecovery.ts');
  const result=await recoverPageImages(1,fn,[1,0,0,-1,0,842],595,842,op,{
    objs:{get:()=>{throw Error('Invalid placement must not retrieve image');}},
  });
  assert.equal(result.detected,2);
  assert.equal(result.images.length,0);
  assert.equal(result.problems.length,2);
});
test('STEP3 images: rejected placement does not corrupt following graphics-state placement',()=>{
  const fn={fnArray:[op.save,op.transform,op.paintImageXObject,op.restore,
    op.save,op.transform,op.paintImageXObject,op.restore],
    argsArray:[[],[100,0,0,50,700,500],['rejected'],[],[],[100,0,0,60,45,600],['good'],[]]};
  const result=scanImagePlacements(2,fn,[1,0,0,-1,0,842],595,842,op);
  assert.equal(result.length,2);
  assert.equal(result[0].origin,null);
  assert.deepEqual(result[1].origin,{page:2,x:45,y:182,width:100,height:60});
  assert.equal(result[1].reason,undefined);
});

test('STEP3 images: PDF clipping flags active scopes and restores after Q',()=>{
  const clipOp:ImageOpCodes={...op,clip:10,eoClip:11};
  const fn={
    fnArray:[op.save,op.transform,op.paintImageXObject,op.restore,
      op.save,clipOp.clip!,op.transform,op.paintImageXObject,
      op.save,clipOp.eoClip!,op.paintInlineImageXObject,op.restore,
      op.paintImageMaskXObject,op.restore,
      op.save,op.transform,op.paintImageXObject,op.restore],
    argsArray:[[],[96,0,0,64,60,610],['regular'],[],
      [],[],[140,0,0,90,55,435],['clipped'],
      [],[],[{}],[],['masked'],[],
      [],[75,0,0,40,50,300],['after-restore'],[]],
  };
  const entries=scanImagePlacements(1,fn,[1,0,0,-1,0,842],595,842,clipOp);
  assert.equal(entries.length,5);
  assert.equal(entries[0].clipWarning,undefined,'unclipped image should not be flagged');
  assert.ok(entries[1].clipWarning?.includes('클리핑 경로'));
  assert.ok(entries[2].clipWarning?.includes('클리핑 경로'),'nested even-odd clip must warn');
  assert.equal(entries[3].kind,'unsupported');
  assert.equal(entries[4].clipWarning,undefined,'Q must restore clipping and not warn later image');
  assert.deepEqual(entries[4].origin,{page:1,x:50,y:502,width:75,height:40});
});

test('STEP3 images: clipped and unsupported placements retain loss counts separately from clip advisories',()=>{
  const page:PdfPageInput={number:1,width:595,height:842,
    pieces:[pixel('원본 문장은 변하지 않습니다',1,50,80)],imageDetected:true,
    imageRecovery:{detected:4,images:[{
      id:'valid-clipped-image',origin:{page:1,x:55,y:250,width:140,height:90},
      width:24,height:24,mimeType:'image/png',
      blob:new Blob(['synthetic'],{type:'image/png'}),include:true,method:'decoded-xobject',
    }],problems:['이미지에 클리핑 경로가 적용됐습니다. 원본 대조 필요',
      '이미지 마스크 복원 불가','반복 이미지 복원 불가','그룹 이미지 복원 불가']}};
  const draft=makePdfDraft('clipped-with-unsupported.pdf',[page]);
  assert.equal(draft.pages[0].imageCount,4);
  assert.equal(draft.pages[0].images.length,1);
  assert.equal(draft.pages[0].omittedImages,3);
  assert.ok(draft.warnings.some(t=>t.includes('미복원 이미지 3건')));
  assert.ok(draft.warnings.some(t=>t.includes('클리핑 경로')));
  assert.equal(draft.pages[0].blocks[0].text,'원본 문장은 변하지 않습니다');
});
