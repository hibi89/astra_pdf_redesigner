import test from 'node:test';
import assert from 'node:assert/strict';
import {countVectorPaintOps} from '../src/step3/vectorRisk.ts';
import {makePdfDraft,type PdfPageInput} from '../src/step3/structure.ts';

const op={stroke:1,closeStroke:2,fill:3,eoFill:4,
  fillStroke:5,eoFillStroke:6,closeFillStroke:7,closeEOFillStroke:8};
const base:PdfPageInput={number:1,width:595,height:842,pieces:[{
  text:'TABLE_A_906',page:1,x:40,y:60,width:100,height:12,fontSize:12,
}],imageDetected:false};

test('STEP3 vector paint risk: count distinct fill and stroke events, not path construction or images',()=>{
  const ops=[91,op.stroke,91,op.stroke,88,op.closeStroke,11,12,op.eoFillStroke];
  const count=countVectorPaintOps({fnArray:ops},op);
  assert.equal(count,4);
  assert.equal(countVectorPaintOps({fnArray:[91,88,11,12]},op),0);
  assert.equal(countVectorPaintOps({fnArray:[91,88]},{}),0);
  assert.equal(countVectorPaintOps({fnArray:[91,91,91]}, {...op,constructPath:91}),3);
  assert.equal(countVectorPaintOps({fnArray:[91,op.stroke,91,op.stroke]}, {...op,constructPath:91}),2);
});

test('STEP3 vector paint risk: per-page warnings expose structural loss but preserve text',()=>{
  const draft=makePdfDraft('table.pdf',[
    {...base,vectorPaintCount:3},
    {...base,number:2,pieces:[{...base.pieces[0],page:2,text:'END_907'}],vectorPaintCount:0},
  ]);
  assert.equal(draft.pages[0].vectorPaintCount,3);
  assert.equal(draft.pages[1].vectorPaintCount,0);
  assert.ok(draft.warnings.some(w=>w.includes('1페이지 벡터 경로 관련 명령 3회')));
  assert.ok(!draft.warnings.some(w=>w.includes('2페이지 벡터 경로 관련 명령')));
  assert.ok(draft.warnings.some(w=>w.includes('도형/셀 개수가 아닙니다')));
  assert.equal(draft.pages[0].blocks[0].text,'TABLE_A_906');
  assert.equal(draft.pages[1].blocks[0].text,'END_907');
});

test('STEP3 vector paint risk: image-only and unknown operator-analysis cases do not claim vector loss',()=>{
  const draft=makePdfDraft('image.pdf',[
    {...base,imageDetected:true,vectorPaintCount:0,imageRecovery:{detected:1,images:[],problems:['synthetic image unavailable']}},
  ]);
  assert.equal(draft.pages[0].vectorPaintCount,0);
  assert.ok(draft.warnings.some(w=>w.includes('미복원 이미지 1건')));
  assert.ok(!draft.warnings.some(w=>w.includes('벡터 경로 관련 명령')));
});

test('STEP3 vector risk: clipping-only paths followed by image painting are excluded',()=>{
  const ops={...op,constructPath:91,clip:92,eoClip:93,endPath:94};
  // Common PDF.js W n pattern: construct, clip, endPath, image.
  assert.equal(countVectorPaintOps({fnArray:[91,92,94,99]},ops),0);
  assert.equal(countVectorPaintOps({fnArray:[91,93,94,99]},ops),0);
  assert.equal(countVectorPaintOps({fnArray:[92,91,99]},ops),0,
    'Actual PDF.js ordering can be clip before constructPath');
  assert.equal(countVectorPaintOps({fnArray:[93,91,99]},ops),0);
  // Path paint in the same page should still be detected.
  assert.equal(countVectorPaintOps({fnArray:[91,92,94,99,91,op.stroke]},ops),1);
  assert.equal(countVectorPaintOps({fnArray:[91,op.stroke,91,92,94]},ops),1);
});

test('STEP3 vector risk: mixed table paths and clip mask do not inflate count',()=>{
  const ops={...op,constructPath:91,clip:92,eoClip:93,endPath:94};
  assert.equal(countVectorPaintOps({
    fnArray:[91,op.stroke,91,op.stroke,91,92,94,99,91,op.stroke],
  },ops),3);
  assert.equal(countVectorPaintOps({fnArray:[91,op.stroke,91,op.stroke,91,op.stroke]},ops),3);
  assert.equal(countVectorPaintOps({fnArray:[91,91,91]},ops),3,
    'unknown bundled paths remain conservatively flagged');
});

test('STEP3 vector risk: real PDF.js clip-only fixture operator trace',async()=>{
  const {getDocument,OPS}=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const {makeClippedImagePdf}=await import('./fixtures/step3-clipped-pdf.mjs');
  const bytes=new Uint8Array(makeClippedImagePdf());
  const task=getDocument({data:bytes,useSystemFonts:true});
  try{
    const pdf=await task.promise;
    const page=await pdf.getPage(1);
    const list=await page.getOperatorList();
    const lookup=new Map(Object.entries(OPS).filter(([,n])=>Number.isInteger(n)).map(([name,n])=>[n,name]));
    const names=list.fnArray.map(code=>lookup.get(code)??String(code));
    const count=countVectorPaintOps(list,OPS);
    assert.equal(count,0,'Clip-only PDF path should not claim vector table loss. Operators: '+names.join(' > '));
  }finally{await task.destroy();}
});

test('STEP3 vector risk: real PDF.js clipped/painted path mixtures retain actual painting',async()=>{
  const {getDocument,OPS}=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const {makeClippedImagePdf}=await import('./fixtures/step3-clipped-pdf.mjs');
  const lookup=new Map(Object.entries(OPS).filter(([,n])=>Number.isInteger(n)).map(([name,n])=>[n,name]));
  const scenarios=[
    {name:'clipping image only',args:{},painted:false},
    {name:'stroke inside active clip',args:{paintInsideClip:true},painted:true},
    {name:'stroke outside clip',args:{paintOutsideClip:true},painted:true},
    {name:'colored fill outside clip',args:{fillOutsideClip:true},painted:true},
    {name:'same PDF path clip plus stroke',args:{strokeClipPath:true},painted:true},
    {name:'clip with multiple real paints',args:{paintInsideClip:true,paintOutsideClip:true,fillOutsideClip:true},painted:true},
  ];
  for(const scenario of scenarios){
    const task=getDocument({data:new Uint8Array(makeClippedImagePdf(scenario.args)),useSystemFonts:true});
    try{
      const pdf=await task.promise;
      const page=await pdf.getPage(1);
      const list=await page.getOperatorList();
      const count=countVectorPaintOps(list,OPS);
      const names=list.fnArray.map(code=>lookup.get(code)??String(code));
      const trace=names.map((name,i)=>({name,args:list.argsArray[i]}))
        .filter(item=>/constructPath|stroke|fill|clip|endPath/i.test(item.name))
        .map(item=>item.name+'('+JSON.stringify(item.args)?.slice(0,300)+')').join(' > ');
      assert.equal(count>0,scenario.painted,
        scenario.name+' misclassified as '+count+' vector events; PDF.js actual path ops: '+trace);
    }finally{await task.destroy();}
  }
});

test('STEP3 vector risk: packed constructPath terminal separates W n from W S and W f',()=>{
  const codes={...op,constructPath:91,clip:92,eoClip:93,endPath:94};
  const packed=(ops:number[],terminals:unknown[])=>({
    fnArray:ops,
    argsArray:terminals.map(value=>typeof value==='number'?[value,[],[]]:null),
  });
  assert.equal(countVectorPaintOps(packed([92,91],[null,94]),codes),0,
    'W n clipping path does not paint');
  assert.equal(countVectorPaintOps(packed([92,91],[null,op.stroke]),codes),1,
    'W S paints the same clipping path');
  assert.equal(countVectorPaintOps(packed([93,91],[null,op.fill]),codes),1,
    'W f fills the clipping path');
  assert.equal(countVectorPaintOps(packed([92,91,91],[null,94,op.stroke]),codes),1,
    'clip-only and stroke path must be distinguished in a mixed document');
});
