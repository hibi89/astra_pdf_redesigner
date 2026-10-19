'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const test=require('node:test');
const source=fs.readFileSync(path.join(__dirname,'../desktop/main.cjs'),'utf8');

test('personal test is explicit opt-in and cannot overlap CI smoke',()=>{
  assert.match(source,/const PERSONAL_TEST=process\.argv\.includes\('--astra-personal-test'\)/);
  assert.match(source,/if\(SMOKE&&PERSONAL_TEST\)throw Error/);
});
test('personal test userData is a dedicated temp profile, never appData',()=>{
  assert.match(source,/:PERSONAL_TEST\s*\?path\.join\(os\.tmpdir\(\),'astra-p5-personal-test-profile'\)/);
  assert.match(source,/:path\.join\(app\.getPath\('appData'\),'AstraPDFRedesigner'\)/);
  assert.match(source,/app\.setPath\('userData'/);
  assert.match(source,/ASTRA PERSONAL TEST userData:/);
});
test('personal test keeps normal PDF save dialog instead of smoke output',()=>{
  assert.match(source,/if\(SMOKE\)\{/);
  assert.match(source,/const selection=await dialog\.showSaveDialog/);
});
