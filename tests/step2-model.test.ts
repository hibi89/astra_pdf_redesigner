import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultDesign, defaultDocument, type PersistedState } from '../src/types.ts';
import { cloneProject, documentAssetIds, isDocumentCollection, isProjectDocument, migrateStep1Document, moveItem, visibleSections } from '../src/step2/model.ts';
const legacy = (): PersistedState => ({ schemaVersion: 1, document: { ...defaultDocument(), title: '원본 보고서 123', learned: '첫 문장\n\n둘째 문장\nhttps://example.com/123', difficult:'', solved:'해결 4.5%', reflection:'끝' }, design: { ...defaultDesign(), theme: 'diary' } });
test('STEP1 migration preserves each section, blanks, exact prose, date and design', () => {
  const v1=legacy(); let n=0; const v2=migrateStep1Document(v1,()=>`id-${++n}`);
  assert.equal(v2.content.title,v1.document.title); assert.equal(v2.content.date,v1.document.date); assert.deepEqual(v2.design,v1.design);
  assert.equal(v2.content.sections.length,4); assert.equal(v2.content.sections[0].blocks[0].kind,'paragraph');
  assert.equal(v2.content.sections[0].blocks[0].text,v1.document.learned);
  assert.equal(v2.content.sections[1].blocks[0].text,''); assert.equal(visibleSections(v2).length,3);
  assert.ok(isProjectDocument(v2));
});
test('moving sections preserves whole nested blocks and bounds',()=>{
  const doc=migrateStep1Document(legacy());
  const moved=moveItem(doc.content.sections,doc.content.sections[0].id,1);
  assert.equal(moved[1].blocks[0].text,doc.content.sections[0].blocks[0].text);
  assert.deepEqual(moveItem(doc.content.sections,doc.content.sections[0].id,-1),doc.content.sections);
});
test('clone recreates document, section, block, asset identifiers and independent image',()=>{
  const doc=migrateStep1Document(legacy()); const asset={id:'a',documentId:doc.id,mimeType:'image/png',originalName:'a.png',byteSize:3,width:1,height:1,blob:new Blob(['abc'])};
  doc.content.sections[0].blocks.push({id:'image-block',kind:'image',assetId:'a',caption:'그림',alignment:'center',size:'medium'});
  const result=cloneProject(doc,[asset]);
  assert.notEqual(result.document.id,doc.id); assert.notEqual(result.assets[0].id,asset.id);
  assert.notEqual(result.document.content.sections[0].id,doc.content.sections[0].id);
  assert.notEqual(result.document.content.sections[0].blocks[0].id,doc.content.sections[0].blocks[0].id);
  assert.equal(documentAssetIds(result.document)[0],result.assets[0].id);
  assert.equal(result.assets[0].blob,asset.blob);
});
test('schema validation rejects invalid, unknown or duplicate IDs',()=>{
  const doc=migrateStep1Document(legacy());
  assert.ok(isDocumentCollection({schemaVersion:2,activeDocumentId:doc.id,documents:[doc]}));
  assert.equal(isDocumentCollection({schemaVersion:2,activeDocumentId:'wrong',documents:[doc]}),false);
  assert.equal(isDocumentCollection({schemaVersion:2,activeDocumentId:doc.id,documents:[doc,doc]}),false);
  assert.equal(isProjectDocument({...doc,content:{...doc.content,sections:[doc.content.sections[0],doc.content.sections[0]]}}),false);
  assert.equal(isProjectDocument({...doc,schemaVersion:4}),false);
});

test('M07-A added layout identifiers pass V2 schema validation and keep old IDB themes',()=>{
  const base=migrateStep1Document(legacy());
  for(const theme of ['report','minimal','diary','compact','editorial','ledger'] as const){
    const candidate={...base,design:{...base.design,theme}};
    assert.equal(isProjectDocument(candidate),true,'Valid theme: '+theme);
    assert.equal(isDocumentCollection({schemaVersion:2,activeDocumentId:candidate.id,documents:[candidate]}),true);
  }
  assert.equal(isProjectDocument({...base,design:{...base.design,theme:'untrusted'}}),false);
});
