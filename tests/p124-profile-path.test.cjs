'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {resolveP124ProfilePath}=require('../desktop/p124-electron-qwen3-acceptance.cjs');

const runnerTemp=path.resolve('astra-p124-runner-temp');

test('P124 permits each isolated Electron profile, including C005 quality',()=>{
  for(const scenario of ['healthy','missing','tampered','quality']){
    const profile=path.join(runnerTemp,'astra-p124-profile-'+scenario);
    assert.equal(resolveP124ProfilePath({
      enabled:true,
      githubActions:'true',
      runnerTemp,
      profile,
    }),profile,scenario+' profile should be accepted');
  }
});

test('P124 profile guard is inactive outside the hosted acceptance gate',()=>{
  assert.equal(resolveP124ProfilePath({enabled:false,githubActions:'true',runnerTemp,profile:path.join(runnerTemp,'astra-p124-profile-quality')}),null);
  assert.equal(resolveP124ProfilePath({enabled:true,githubActions:'false',runnerTemp,profile:path.join(runnerTemp,'astra-p124-profile-quality')}),null);
  assert.equal(resolveP124ProfilePath({enabled:true,githubActions:'true',runnerTemp,profile:null}),null);
});

test('P124 rejects unsupported names and paths outside RUNNER_TEMP',()=>{
  assert.throws(()=>resolveP124ProfilePath({
    enabled:true,githubActions:'true',runnerTemp,
    profile:path.join(runnerTemp,'astra-p124-profile-other'),
  }),/isolated under RUNNER_TEMP/);
  assert.throws(()=>resolveP124ProfilePath({
    enabled:true,githubActions:'true',runnerTemp,
    profile:path.resolve(runnerTemp,'..','astra-p124-profile-quality'),
  }),/isolated under RUNNER_TEMP/);
});
