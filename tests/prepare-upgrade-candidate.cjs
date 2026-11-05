'use strict';
// Creates an ephemeral version-only NSIS candidate in a disposable Windows CI checkout.
// Never run from an end-user machine or change product release version in Git.
const fs=require('node:fs');
if(process.env.GITHUB_ACTIONS!=='true'||process.platform!=='win32'||!process.env.RUNNER_TEMP)
  throw Error('Version-only upgrade fixture is Windows CI-only');
const filename='package.json';
const pkg=JSON.parse(fs.readFileSync(filename,'utf8'));
if(pkg.version!=='0.1.0')throw Error('Expected baseline package version 0.1.0');
pkg.version='0.1.1';
fs.writeFileSync(filename,JSON.stringify(pkg,null,2)+'\n');
console.log('PASS ASTRA UPGRADE VERSION FIXTURE: 0.1.1 candidate prepared in ephemeral checkout (no source/schema change)');
