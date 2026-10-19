'use strict';
// Prepare a disposable Windows CI-only upgrade from installed IDB v1 to IDB v2.
// Version 0.1.0 and its compiled dist are packaged BEFORE this file runs.
// Only the ephemeral checkout is edited; no product release version is bumped.
const fs=require('node:fs');
const path=require('node:path');
if(process.env.GITHUB_ACTIONS!=='true'||process.platform!=='win32'||!process.env.RUNNER_TEMP)
  throw Error('Schema upgrade fixture is Windows GitHub Actions CI-only');

const pkgFile='package.json',sourceFile=path.join('src','step2','idb.ts');
const pkg=JSON.parse(fs.readFileSync(pkgFile,'utf8'));
if(pkg.version!=='0.1.0')throw Error('Expected baseline package version 0.1.0');
const original=fs.readFileSync(sourceFile,'utf8');
const guards=[
  ['const VERSION=1;','const VERSION=2;'],
  ["const DOCS='documents', ASSETS='assets', META='meta';",
   "const DOCS='documents', ASSETS='assets', META='meta', MIGRATION_AUDIT='migrationAudit';"],
  ["if(!db.objectStoreNames.contains(META))db.createObjectStore(META);",
   "if(!db.objectStoreNames.contains(META))db.createObjectStore(META);\n      if(!db.objectStoreNames.contains(MIGRATION_AUDIT))db.createObjectStore(MIGRATION_AUDIT,{keyPath:'id'});"],
];
let updated=original;
for(const [before,after] of guards){
  if(updated.split(before).length!==2)throw Error('Unexpected IDB source: upgrade anchor must occur exactly once: '+before);
  updated=updated.replace(before,after);
}
if(updated===original||!updated.includes('const VERSION=2;')||
   !updated.includes("db.createObjectStore(MIGRATION_AUDIT,{keyPath:'id'})"))
  throw Error('IDB schema v2 candidate was not prepared');
pkg.version='0.1.1';
fs.writeFileSync(sourceFile,updated);
fs.writeFileSync(pkgFile,JSON.stringify(pkg,null,2)+'\n');
console.log('PASS ASTRA EPHEMERAL UPGRADE CANDIDATE: 0.1.1 compiled with real IDB version 2 + additive migrationAudit store (baseline compiled at v1)');
