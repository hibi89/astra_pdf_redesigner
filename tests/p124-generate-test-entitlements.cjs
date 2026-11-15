'use strict';
// Generates only ephemeral P124 receipts on a GitHub-hosted runner.
// The signing key stays in process memory; the output file contains public test material only.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs/promises');
const path=require('node:path');

async function main(){
  assert.equal(process.env.GITHUB_ACTIONS,'true','P124 signer runs only in GitHub Actions');
  assert.ok(process.env.RUNNER_TEMP,'RUNNER_TEMP is required');
  const root=path.resolve(process.env.RUNNER_TEMP);
  const target=path.resolve(process.argv[2]||'');
  assert.equal(path.dirname(target),root,'P124 signer output must remain directly under RUNNER_TEMP');
  assert.equal(path.basename(target),'astra-p124-test-entitlements.json','Unexpected P124 signer output name');
  const pair=await crypto.webcrypto.subtle.generateKey(
    {name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
  const issuerPublicJwk=await crypto.webcrypto.subtle.exportKey('jwk',pair.publicKey);
  if(Object.hasOwn(issuerPublicJwk,'d'))throw Error('Public P124 JWK unexpectedly contains private material.');
  const canonical=JSON.stringify({crv:'P-256',kty:'EC',x:issuerPublicJwk.x,y:issuerPublicJwk.y});
  const issuerThumbprintSha256=crypto.createHash('sha256').update(canonical,'utf8').digest('hex');
  const now=Math.floor(Date.now()/1000);
  async function sign(tier){
    const license={licenseId:'ASTRA-P124-TEST-'+tier.toUpperCase()+'-01',tier,productMajor:1,
      issuedAt:now-5,expiresAt:now+3600,seats:1};
    const payload=JSON.stringify({format:'astra-offline-license',version:1,license});
    const signature=Buffer.from(await crypto.webcrypto.subtle.sign(
      {name:'ECDSA',hash:'SHA-256'},pair.privateKey,new TextEncoder().encode(payload))).toString('base64url');
    return JSON.stringify({format:'astra-offline-license',version:1,license,signature});
  }
  const receipts={basic:await sign('basic'),pro:await sign('pro'),business:await sign('business')};
  const result={schema:'astra-p124-test-entitlements-v1',issuerPublicJwk,issuerThumbprintSha256,receipts};
  await fs.writeFile(target,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
  assert.ok(!JSON.stringify(result).includes('"d"'),'P124 config must not contain private JWK material.');
  console.log('PASS P124 generated three ephemeral signed test receipts; private signing key stayed in process memory.');
}
main().catch(error=>{console.error(error?.message||error);process.exitCode=1;});
