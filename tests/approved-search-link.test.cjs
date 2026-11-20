'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {approvedSearchTarget}=require('../desktop/approved-search-link.cjs');
test('P99 STEP6 exactly two canonical keyword URLs can leave only after native confirmation',()=>{
 const korean=encodeURIComponent('보고서 A4 레이아웃');
 assert.equal(approvedSearchTarget('https://www.google.com/search?tbm=isch&q='+korean),'https://www.google.com/search?tbm=isch&q='+korean);
 assert.equal(approvedSearchTarget('https://www.bing.com/images/search?q='+korean),'https://www.bing.com/images/search?q='+korean);
});
test('P99 extra params, malicious schemes, hosts, encoding and controls fail-closed',()=>{
 for(const value of ['http://www.google.com/search?tbm=isch&q=test','https://www.google.com.evil.org/search?tbm=isch&q=test',
  'https://www.google.com/search?tbm=isch&q=x&secret=pdf','https://www.bing.com/images/search?q=x#foo',
  'https://www.bing.com/images/search?q=%00','file:///C:/secret.pdf',
  'https://www.google.com/search?q=test&tbm=isch','https://www.bing.com/images/search?q=test%ZZ',
  'javascript:alert(1)','https://www.google.com/search?tbm=isch&q=',
  'https://www.google.com/search?tbm=isch&q='+encodeURIComponent('가'.repeat(81))]){
  assert.equal(approvedSearchTarget(value),null,'unsafe '+value);
 }
});
test('P99 native Electron retains network block and confirmation; no arbitrary open from renderer',()=>{
 const main=require('node:fs').readFileSync(require('node:path').resolve(__dirname,'../desktop/main.cjs'),'utf8');
 assert.match(main,/approvedSearchTarget\(details\.url\)/);
 assert.match(main,/dialog\.showMessageBox\(mainWindow/);
 assert.match(main,/shell\.openExternal\(safeUrl\)/);
 assert.match(main,/action:'deny'/);
 assert.match(main,/onBeforeRequest/);
});
