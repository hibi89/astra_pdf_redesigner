'use strict';

const assert=require('node:assert/strict');
const {mkdtempSync,mkdirSync,writeFileSync,rmSync}=require('node:fs');
const {tmpdir}=require('node:os');
const {join}=require('node:path');
const test=require('node:test');
const {scanPackageTree}=require('./c010-package-content-audit.cjs');

function tempRoot(t){
 const root=mkdtempSync(join(tmpdir(),'astra-c010-package-audit-'));
 t.after(()=>rmSync(root,{recursive:true,force:true,maxRetries:10,retryDelay:100}));
 return root;
}

test('C010 scanner reads every regular package file without retaining file contents in its report',t=>{
 const root=tempRoot(t),assets=join(root,'resources','app');
 mkdirSync(assets,{recursive:true});
 writeFileSync(join(assets,'index.html'),'<main>ASTRA synthetic app</main>');
 writeFileSync(join(assets,'asset.bin'),Buffer.from([0,1,2,3,255]));
 const result=scanPackageTree(root);
 assert.equal(result.fileCount,2);
 assert.equal(result.totalBytes,Buffer.byteLength('<main>ASTRA synthetic app</main>')+5);
 assert.equal(result.findings.length,0);
 assert.deepEqual(result.files,['resources/app/asset.bin','resources/app/index.html']);
});

test('C010 scanner reports secret, personal-data signatures, and blocked package paths without copying matched values',t=>{
 const root=tempRoot(t),assets=join(root,'app','dist');
 mkdirSync(assets,{recursive:true});
 const fakeGithubToken='ghp_'+('A'.repeat(32));
 const fakeEmail='buyer.synthetic@example.com';
 const fakePhone='010-1234-5678';
 const fakeResidentId='900101-1234567';
 const invalidDateId='991332-1234567';
 writeFileSync(join(assets,'leak.js'),[
  'const github='+JSON.stringify(fakeGithubToken)+';',
  '-----BEGIN PRIVATE KEY-----'
 ].join('\n'));
 writeFileSync(join(assets,'contact.json'),JSON.stringify({contact:fakeEmail,mobile:fakePhone,identity:fakeResidentId,invalidDate:invalidDateId}));
 const fixtures=join(root,'app','tests','fixtures');
 mkdirSync(fixtures,{recursive:true});
 writeFileSync(join(fixtures,'sample.json'),'synthetic only');
 writeFileSync(join(root,'app','.env.production'),'placeholder=not-a-secret');
 const result=scanPackageTree(root);
 const rules=new Set(result.findings.map(finding=>finding.rule));
 for(const rule of ['github-token','email-address','korean-mobile-number-pattern','korean-resident-id-pattern',
  'private-key-material','test-fixture-path','environment-file-path'])assert.ok(rules.has(rule),'missing rule '+rule);
 const serialized=JSON.stringify(result.findings);
 for(const value of [fakeGithubToken,fakeEmail,fakePhone,fakeResidentId])assert.ok(!serialized.includes(value),'scanner report must not print matched content');
 assert.equal(result.findings.filter(finding=>finding.rule==='korean-resident-id-pattern').length,1,'invalid calendar dates must not be flagged as resident IDs');
 assert.ok(result.findings.every(finding=>Object.keys(finding).every(key=>['rule','file','offset'].includes(key))));
});
