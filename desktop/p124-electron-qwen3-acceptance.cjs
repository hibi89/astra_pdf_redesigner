'use strict';
// P124 hosted-runner-only acceptance. It drives the production review
// component through Electron's real preload + main-process IPC bridge.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs/promises');
const path=require('node:path');
const {auditOutputPdf}=require('./pdf-output-audit.cjs');

const SKU_PLANS=[
  {sku:'BASIC',tier:'basic',capability:'base-layout',layoutId:null,deniedLayout:'pro-01'},
  {sku:'PRO',tier:'pro',capability:'pro-layout',layoutId:'pro-01',deniedLayout:'business-01'},
  {sku:'BUSINESS',tier:'business',capability:'business-layout',layoutId:'business-01',deniedLayout:null},
];
const SKU_NAMES=SKU_PLANS.map(item=>item.sku);
const CASES=[
 ['neutral-01','이 보고서는 여러 자료를 살펴보고 내용을 정리한 다음 그 내용을 다시 검토하는 과정을 통해 작성되었습니다.'],
 ['neutral-02','회의에서 나온 의견을 모으고 중요한 부분을 다시 확인한 뒤 결과를 전달하는 방식으로 진행했습니다.'],
 ['neutral-03','자료를 확인하는 일을 먼저 진행하고 필요한 내용을 정리하는 작업을 추가로 수행했습니다.'],
 ['neutral-04','담당자는 문서를 살펴본 이후 관련 내용을 정리하고 마지막으로 빠진 부분이 있는지 확인했습니다.'],
 ['neutral-05','이 안내는 이용 방법에 대한 설명을 포함하고 있으며 각 항목을 순서대로 확인할 수 있도록 구성되어 있습니다.'],
 ['neutral-06','새로운 내용을 추가할 때에는 기존 문서의 흐름을 고려하고 문장 사이의 연결을 함께 살펴보는 것이 좋습니다.'],
 ['neutral-07','팀은 수집한 정보를 검토한 후 필요한 항목을 나누어 정리하고 공유할 자료를 준비했습니다.'],
 ['neutral-08','요청을 받은 뒤 먼저 현재 상태를 확인했고 이후 필요한 사항을 정리하는 절차를 진행했습니다.'],
 ['neutral-09','이 문서는 여러 단계에서 확인된 내용을 모아 하나의 흐름으로 읽을 수 있도록 작성한 자료입니다.'],
 ['neutral-10','설명에 포함된 내용을 다시 읽어 보면서 이해하기 쉬운 표현으로 정리하는 작업을 진행했습니다.'],
 ['neutral-11','검토 과정에서 확인한 항목을 기록하고 나중에 같은 내용을 다시 찾기 쉽도록 문서를 정리했습니다.'],
 ['neutral-12','초안을 작성한 다음에는 문장의 순서를 살펴보고 서로 비슷한 설명이 반복되는 부분을 확인했습니다.'],
 ['neutral-13','필요한 자료를 먼저 모은 후 주요 내용을 구분하고 읽는 사람이 확인하기 편한 형태로 구성했습니다.'],
 ['neutral-14','이번 안내에서는 작업의 목적을 설명하고 이어서 진행 방법을 차례대로 소개하고 있습니다.'],
 ['neutral-15','문서에 있는 여러 설명을 확인하고 서로 관련된 내용을 가까운 위치에 배치하도록 정리했습니다.'],
 ['neutral-16','사용자가 확인할 내용을 먼저 제시하고 그 다음에 필요한 추가 설명을 이어서 작성했습니다.'],
 ['neutral-17','회의 내용을 정리하면서 중요한 의견을 기록하고 나중에 확인할 수 있도록 자료를 보관했습니다.'],
 ['neutral-18','요청한 사항을 확인한 다음 필요한 답변을 준비하고 관련된 설명을 함께 전달했습니다.'],
 ['neutral-19','각 항목에 대한 내용을 읽어 보고 서로 겹치지 않게 나누어 정리하는 방식으로 문서를 구성했습니다.'],
 ['neutral-20','처음에는 전체 내용을 확인하고 이후에 자세한 설명을 살펴보며 빠진 정보가 없는지 검토했습니다.'],
 ['number-01','신청 수량은 12개이며 배송 일정은 별도 안내합니다.'],
 ['amount-01','최종 결제 금액은 230,000원으로 기록되어 있습니다.'],
 ['date-01','계약 시작일은 2026년 11월 15일이며 종료일은 2027년 11월 14일입니다.'],
 ['quote-01','담당자는 “원본 파일은 그대로 보관합니다”라고 안내했습니다.'],
 ['negation-01','승인 전에는 문서를 외부에 전달하지 않습니다.'],
 ['negation-02','해당 변경은 아직 완료되지 않았으며 추가 검토가 필요합니다.'],
 ['url-01','참고 주소는 https://example.invalid/guide 이며 열람 전에 출처를 확인합니다.'],
 ['table-01','| 항목 | 수량 | 금액 |\n| 연필 | 12 | 3,600원 |'],
 ['name-01','담당자 이름: 김하늘. 연락 전에 수신인 정보를 확인합니다.'],
 ['mixed-01','보증 기간은 24개월이고 환불은 승인되지 않습니다. “최종 금액은 80,000원”이라는 기록을 유지합니다.'],
 ['negative-03','고객 정보는 동의 없이 수집하거나 저장하지 않으며, 문의는 https://example.invalid/privacy 에서 확인합니다.'],
];
const BASELINE='ASTRA_P124_PDF_SOURCE_7401 · 최종 결제 금액은 230,000원이며, 승인 전에는 외부에 전달하지 않습니다.';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
function runnerPath(file,pattern){
  if(process.env.GITHUB_ACTIONS!=='true'||!process.env.RUNNER_TEMP)throw Error('P124 is restricted to GitHub-hosted Actions');
  const root=path.resolve(process.env.RUNNER_TEMP),target=path.resolve(file);
  if(path.dirname(target)!==root||!pattern.test(path.basename(target)))throw Error('P124 output must be a named file directly under RUNNER_TEMP');
  return target;
}
function signature(value){
  const text=String(value).normalize('NFC').replaceAll('\u2212','-');
  const urls=text.match(/https?:\/\/[^\s]+/g)||[];
  const numbers=text.match(/(?:[$₩€£]|[+\-])?\d+(?:[.,:/%\-]\d+)*(?:%|원|달러|만원|억원)?/g)||[];
  const quotes=text.match(/"[^"\n]*"|'[^'\n]*'|“[^”\n]*”|‘[^’\n]*’/g)||[];
  const roots=['않','못','없','아니','불가','금지','거부','취소','미승인','불허','제외','비승인'];
  const counts=roots.map(root=>[root,text.split(root).length-1]).filter(([,count])=>count>0);
  const negative=/(?:않|못|없|아니|불가|금지|거부|취소|미승인|불허|제외|비승인|(?:^|\s)안(?=\s)|\b(?:not|no|never|cannot|can't|without|deny|denied|prohibit\w*)\b)/i;
  const negativeSentences=text.split(/(?<=[.!?。])|[\r\n;]+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(x=>x&&negative.test(x));
  const names=[...text.matchAll(/(?:성명|이름|담당자|수신인|발신인|고객명|회사명|대표자)\s*[:：=]\s*([가-힣]{2,4}|[A-Z][A-Za-z0-9_.-]{1,31})/g)].map(x=>x[1]);
  const titled=[...text.matchAll(/([가-힣]{2,4}|[A-Z][A-Za-z0-9_.-]{1,31})(?=(?:님|씨|대표|사장|회장|이사)(?:은|이|가|을|를|께서|께|으로|와|과|[,.;!?]|\s|$))/g)].map(x=>x[1]);
  const capitals=text.match(/\b[A-Z][A-Za-z0-9_.-]{1,31}\b/g)||[];
  const table=text.split(/\r?\n/).filter(x=>/^\s*\|.+\|\s*$/.test(x)||x.split('\t').length>=3).map(x=>x.trim().replace(/\s+/g,' '));
  const spacedAn=(text.match(/(?:^|[\s(])안(?=\s)/g)||[]).length;
  return JSON.stringify([urls,numbers,quotes,[...new Set([...names,...titled,...capitals])].sort(),table,counts,negativeSentences,spacedAn]);
}
function createReport(scenario){
  return {schema:scenario==='quality'?'astra-c005-qwen3-unique-quality-report-v1':'astra-p124-electron-qwen3-report-v1',scenario,platform:process.platform,
    github_sha:process.env.GITHUB_SHA||null,model:{id:'Qwen3-4B-Instruct-2507',tag:'qwen3:4b-instruct',quantization:'Q8_0',
      combined_sha256:process.env.P124_MODEL_SHA256||null,source:'GitHub release locomotive-works/npu-local-model-running@v1.0',
      license:'Apache-2.0; test-only download; not redistributed'},
    runtime:{mode:scenario==='tampered'?'synthetic loopback protocol fixture':'GitHub-hosted Windows Ollama CPU runtime',
      ollama_version:scenario==='tampered'?null:'0.40.16',windows_zip_sha256:process.env.P124_OLLAMA_SHA256||null,
      ollama_host:'127.0.0.1:11434',cloud_disabled:process.env.OLLAMA_NO_CLOUD==='1',
      cpu_threads:require('node:os').cpus().length,system_memory_bytes:require('node:os').totalmem()},
    resource_profile:scenario==='quality'?{host_memory_bytes:require('node:os').totalmem(),cpu_threads:require('node:os').cpus().length}:null,
    sku_contexts:[],sku_entitlement_flow:null,automatic_applies:0,external_transfer:false,synthetic_v1_v2_unchanged:false,
    product_step2_storage_unchanged:false,product_step2_content_preserved:false,product_step2_timestamp_only_changed:false,
    pdf_text_equal:false,limitations:['The actual Root -> Workspace -> CommercialLicensePanel -> runSkuGatedAction path is exercised with an ephemeral GitHub Actions test issuer; production issuer keys and sale activation remain disabled.',
      'The synthetic V1 record is migrated by the product and its STEP2 V2 content/assets are checked after review; updatedAt may change as normal edit/undo writes persist.',
      'Only synthetic paragraphs and a fresh isolated Electron profile are used; no customer files or customer profile are opened.',
      'The Qwen model is downloaded at CI runtime and is not bundled or redistributed.']};
}
async function readP124Entitlements(){
  const file=runnerPath(process.env.ASTRA_P124_ENTITLEMENT_CONFIG,/^astra-p124-test-entitlements\.json$/i);
  const config=JSON.parse(await fs.readFile(file,'utf8'));
  assert.equal(config.schema,'astra-p124-test-entitlements-v1');
  assert.ok(config.issuerPublicJwk&&config.issuerPublicJwk.d===undefined,'test issuer must expose only a public JWK');
  assert.match(config.issuerThumbprintSha256,/^[0-9a-f]{64}$/);
  assert.deepEqual(Object.keys(config.receipts).sort(),['basic','business','pro']);
  assert.ok(Object.values(config.receipts).every(value=>typeof value==='string'&&value.length<2048));
  return config;
}
async function readPdfText(bytes){
  const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const task=getDocument({data:new Uint8Array(bytes),useSystemFonts:true});
  try{
    const pdf=await task.promise,all=[];
    for(let n=1;n<=pdf.numPages;n++){
      const page=await pdf.getPage(n),content=await page.getTextContent();
      all.push(content.items.filter(item=>typeof item.str==='string').map(item=>item.str).join(''));
      page.cleanup();
    }
    return all.join('\n').normalize('NFC').replace(/\s+/gu,'');
  }finally{await task.destroy();}
}
async function runP124ElectronAcceptance(win,renderPdf){
  const scenario=process.env.P124_SCENARIO;
  assert.ok(['healthy','missing','tampered','quality'].includes(scenario),'Unknown P124/C005 scenario');
  const reportFile=runnerPath(process.env.P124_REPORT_OUT,/^(astra-p124-(healthy|missing|tampered)|astra-c005-quality)\.json$/i);
  const screenshotRoot=path.resolve(process.env.P124_SCREENSHOT_DIR||'');
  if(screenshotRoot!==path.resolve(process.env.RUNNER_TEMP))
    throw Error('P124 screenshots must stay in the isolated runner temp directory');
  const report=createReport(scenario),started=Date.now();
  let currentStep='initializing actual Workspace';
  const markStep=step=>{currentStep=step;console.log('P124 step: '+step);};
  const evaluate=async expression=>{
    let result,script='';
    try{
      script='(async()=>{try{return {__p124Ok:true,value:await ('+expression+')}' +
        '}catch(error){return {__p124Ok:false,error:String(error?.message||error)}}})()';
      result=await win.webContents.executeJavaScript(script,true);
    }catch(error){
      console.log('P124 failed evaluation source: '+script.slice(0,800).replace(/\\s+/g,' '));
      throw Error('P124 renderer evaluation failed: '+String(error?.message||error));
    }
    if(!result?.__p124Ok)throw Error('P124 renderer script failed: '+String(result?.error||'unknown renderer error'));
    return result.value;
  };
  const waitFor=async(fn,predicate=x=>Boolean(x),timeout=120000,label='condition')=>{
    const deadline=Date.now()+timeout;
    while(Date.now()<deadline){const value=await fn();if(predicate(value))return value;await sleep(120);}
    throw Error('P124 timed out: '+label);
  };
  const click=selector=>{
    const encoded=encodeURIComponent(selector);
    return evaluate(`(()=>{const selector=decodeURIComponent('${encoded}'),e=document.querySelector(selector);
      if(!e||e.disabled)throw Error('Missing/disabled acceptance control: '+selector);
      e.click();return true})()`);
  };
  const currentSource=()=>evaluate('document.querySelector(".section-editor textarea")?.value||null');
  const setSource=async text=>{
    await evaluate('(()=>{const e=document.querySelector(".section-editor textarea");if(!e)throw Error("Missing real Workspace paragraph editor");const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set;set.call(e,'+JSON.stringify(text)+');e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}));return true})()');
    await waitFor(currentSource,value=>value===text,10000,'Workspace paragraph update');
  };
  const setReceipt=async receipt=>{
    await evaluate('(()=>{const e=document.querySelector("[data-commercial-license-input]");if(!e)throw Error("Missing production CommercialLicensePanel receipt field");const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set;set.call(e,'+JSON.stringify(receipt)+');e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}));return true})()');
  };
  const verifyEntitlement=async(plan,receipt)=>{
    await setReceipt(receipt);
    await evaluate('(()=>{const e=document.querySelector("[data-commercial-capability]");e.value='+JSON.stringify(plan.capability)+';e.dispatchEvent(new Event("change",{bubbles:true}));return true})()');
    await click('[data-commercial-check]');
    const result=await waitFor(()=>evaluate('document.querySelector("[data-commercial-check-result]")?.textContent||""'),
      value=>value.includes('서명과 기능 사용권 확인됨')||value.includes('사용권 거부'),12000,'actual SKU receipt verification '+plan.sku);
    assert.match(result,/서명과 기능 사용권 확인됨/,'production license panel must validate the signed '+plan.tier+' receipt');
    return result;
  };
  const layoutSelected=layoutId=>evaluate(`(()=>{const e=Array.from(document.querySelectorAll('[data-extended-layout-id]')).find(node=>node.getAttribute('data-extended-layout-id')==='${layoutId}');return Boolean(e&&e.getAttribute('aria-pressed')==='true')})()`);
  const selectLayout=async layoutId=>{
    const selector='[data-extended-layout-id="'+layoutId+'"]';
    await click(selector);
    await waitFor(()=>layoutSelected(layoutId),Boolean,10000,'actual Workspace layout entitlement '+layoutId);
  };
  const denyLayout=async(layoutId,sku)=>{
    const selector='[data-extended-layout-id="'+layoutId+'"]';
    await click(selector);
    await waitFor(()=>evaluate('Array.from(document.querySelectorAll("[role=alert]")).some(node=>node.textContent.includes("사용권"))'),
      Boolean,10000,'actual Workspace SKU denial '+sku+' -> '+layoutId);
    assert.equal(await layoutSelected(layoutId),false,'insufficient '+sku+' entitlement must not select '+layoutId);
    if(await evaluate('Boolean(document.querySelector("p[role=alert] button"))'))await click('p[role=alert] button');
  };
  const waitOperation=async label=>{
    await waitFor(()=>evaluate(`Boolean(document.querySelector('[data-local-ai-cancel]')||
      document.querySelector('[data-local-ai-proposal]')||
      /윤문 제안|로컬 추론 실패|윤문\s*제안|중단했습니다/.test(document.querySelector('[data-local-ai-status]')?.textContent||''))`),Boolean,180000,label+' completion start');
    await waitFor(()=>evaluate('!document.querySelector("[data-local-ai-cancel]")'),Boolean,180000,label+' completion');
  };
  const printPdf=async(name)=>{
    const target=runnerPath(path.join(process.env.RUNNER_TEMP,name),/^astra-p124-(healthy-(basic|pro|business)-(before|after)|missing|tampered)\.pdf$/i);
    const bytes=await renderPdf();
    const audit=await auditOutputPdf(bytes,['ASTRA_P124_PDF_SOURCE_7401','230,000원','승인 전에는 외부에 전달하지 않습니다.'],0);
    assert.equal(audit.pages,1,'P124 synthetic PDF must stay one A4 page');
    assert.deepEqual(audit.issues,[],'P124 synthetic PDF output audit must pass');
    await fs.writeFile(target,bytes,{flag:'wx'});
    const persisted=await fs.readFile(target);
    assert.ok(persisted.equals(bytes),'PDF bytes must match the Electron print result');
    return {file:path.basename(target),sha256:sha(bytes),text:await readPdfText(persisted)};
  };
  const initialOrigin=await evaluate('location.protocol+"//"+location.host');
  assert.equal(initialOrigin,'astra://app','P124 must run in the trusted product protocol');
  const entitlementConfig=await readP124Entitlements();
  report.sku_entitlement_flow={build:'GitHub-hosted P124 test build',issuer_thumbprint_sha256:entitlementConfig.issuerThumbprintSha256,
    production_issuer_configured:false,production_sale_activation:false};
  await waitFor(()=>evaluate('Boolean(document.querySelector("[data-p124-electron-acceptance]")&&document.querySelector("[data-commercial-license-input]")&&document.querySelector(".section-editor textarea")&&document.querySelector("[data-local-ai-review]")&&window.astraDesktop?.localModelPropose)'),Boolean,30000,'real Root/Workspace, license panel, paragraph review and Electron bridge');
  assert.equal(await evaluate('window.__p124P124TestMode===true'),true,'P124 test-only product fixture marker must be present');
  const storageBefore=await evaluate('window.__p124StorageReady.then(()=>window.__p124SnapshotStorage())');
  await waitFor(()=>evaluate('window.__p124ReadPersistedSource()'),value=>value===BASELINE,15000,'real STEP1 V1 migration into STEP2 V2');
  const productStorageBefore=await evaluate('window.__p124SnapshotProductStorage()');
  const productTimestampsBefore=await evaluate('window.__p124ReadProductTimestamps()');
  const initialPdf=scenario==='healthy'?await printPdf('astra-p124-healthy-basic-before.pdf'):null;
  const uiResults=[];
  try{
    for(const plan of SKU_PLANS){
      const receipt=entitlementConfig.receipts[plan.tier];
      markStep(plan.sku+': verify signed receipt');
      const licenseResult=await verifyEntitlement(plan,receipt);
      let deniedLayout=null;
      if(plan.deniedLayout){
        deniedLayout=plan.deniedLayout;
        markStep(plan.sku+': deny '+plan.deniedLayout+' layout');
        await denyLayout(plan.deniedLayout,plan.sku);
      }
      if(plan.layoutId){markStep(plan.sku+': allow '+plan.layoutId+' layout');await selectLayout(plan.layoutId);}
      const selected=plan.layoutId||'basic-default';
      const beforeProbe=await currentSource();
      assert.equal(beforeProbe,BASELINE,'SKU setup must not change the actual STEP2 paragraph');
      const skuPdfBefore=scenario==='healthy'
        ?(plan.sku==='BASIC'?initialPdf:await printPdf('astra-p124-healthy-'+plan.sku.toLowerCase()+'-before.pdf'))
        :null;
      const priorConsent=await evaluate('Boolean(document.querySelector("[data-local-ai-consent]")?.checked)');
      if(priorConsent){
        markStep(plan.sku+': clear previous SKU-context consent');
        await click('[data-local-ai-consent]');
      }
      markStep(plan.sku+': probe actual local model');
      await click('[data-local-ai-probe]');
      const modelStatus=await waitFor(()=>evaluate('document.querySelector("[data-local-ai-status]")?.textContent||""'),
        value=>scenario==='missing'?value.includes('찾지 못했습니다'):value.includes('로컬 모델을 찾았습니다'),
        12000,'model status '+plan.sku);
      if(scenario==='missing'){
        assert.equal(await evaluate('document.querySelector("[data-local-ai-run]")?.disabled'),true,
          'missing model must leave actual Workspace inference disabled');
        assert.equal(await currentSource(),BASELINE,'model missing must retain the original V1-derived paragraph');
        uiResults.push({sku:plan.sku,tier:plan.tier,receipt_panel:'verified',license_result:licenseResult,
          allowed_layout:selected,denied_layout:deniedLayout,model_status:'unavailable',run_disabled:true,
          source_unchanged:true,automatic_applies:0});
        continue;
      }
      assert.equal(await evaluate('document.querySelector("[data-local-ai-run]")?.disabled'),true,
        'explicit consent is required after model detection');
      if(scenario==='tampered'){
        await click('[data-local-ai-consent]');
        const tamperedSource='최종 결제 금액은 230,000원으로 확정되었습니다.';
        await setSource(tamperedSource);
        await click('[data-local-ai-run]');await waitOperation('tampered response '+plan.sku);
        assert.equal(await evaluate('Boolean(document.querySelector("[data-local-ai-proposal]"))'),false,
          'tampered model output must never appear as an approved proposal');
        assert.equal(await currentSource(),tamperedSource,'tampered output must not alter actual Workspace input');
        const message=await evaluate('document.querySelector("[data-local-ai-status]")?.textContent||""');
        assert.match(message,/원문은 변경되지 않았습니다/,'UI must explain rejected output keeps the source');
        await setSource(BASELINE);
        await waitFor(()=>evaluate('window.__p124ReadPersistedSource()'),value=>value===BASELINE,12000,'restore persisted original V1-derived source');
        uiResults.push({sku:plan.sku,tier:plan.tier,receipt_panel:'verified',license_result:licenseResult,
          allowed_layout:selected,denied_layout:deniedLayout,model_status:'available',
          tampered_output:'rejected',source_unchanged:true,automatic_applies:0});
        continue;
      }
      await waitFor(()=>evaluate('window.astraDesktop.localModelPropose("synthetic-no-consent",false)'),
        result=>result?.reason==='local-model-consent-required',10000,'IPC consent rejection '+plan.sku);
      assert.equal(await currentSource(),BASELINE,'unconsented IPC call must leave product source unchanged');
      await click('[data-local-ai-consent]');
      assert.equal(await evaluate('document.querySelector("[data-local-ai-run]")?.disabled'),false);
      const isQuality=scenario==='quality';
      const proposalCases=[],caseResults=[];let approvedUndo=false;let rejected=0;let attempted=0;let replaySource=null;
      const preferred=CASES.find(([id])=>id==='neutral-03');
      const orderedCases=isQuality?CASES:(preferred?[preferred,...CASES.filter(([id])=>id!=='neutral-03')]:CASES);
      // C005 uses every unique synthetic input once; P124 retains proposal replay only for repeat-decision coverage.
      for(const [id,candidateText] of orderedCases){
        if(!isQuality&&proposalCases.length>=10)break;
        attempted++;
        const text=isQuality?candidateText:(replaySource?.text??candidateText);
        const caseId=isQuality?id:(replaySource?replaySource.id+'-replay-'+(proposalCases.length+1):id);
        await evaluate('window.__p124CaseId='+JSON.stringify(plan.sku+'-'+caseId));
        await setSource(text);
        await click('[data-local-ai-run]');await waitOperation('real Qwen3 '+plan.sku+' '+id);
        const hasProposal=await evaluate('Boolean(document.querySelector("[data-local-ai-proposal]"))');
        assert.equal(await currentSource(),text,'real model inference must never auto-apply to the product Workspace');
        if(!hasProposal){
          if(isQuality)caseResults.push({case_id:id,input_sha256:sha(text),outcome:'no-guarded-proposal'});
          continue;
        }
        const proposed=await evaluate('document.querySelector("[data-local-ai-after]")?.textContent||""');
        assert.ok(proposed&&signature(text)===signature(proposed),'visible draft must preserve protected facts');
        if(!isQuality&&!replaySource)replaySource={id,text};
        proposalCases.push({case_id:caseId,input_sha256:sha(text),proposal_sha256:sha(proposed),decision:approvedUndo?'reject':'approve-then-undo'});
        if(isQuality)caseResults.push({case_id:id,input_sha256:sha(text),proposal_sha256:sha(proposed),outcome:'guarded-proposal'});
        if(!approvedUndo){
          if(scenario==='healthy'&&proposalCases.length===1){
            const image=await win.capturePage();
            const screenshot=runnerPath(path.join(screenshotRoot,'astra-p124-'+plan.sku.toLowerCase()+'.png'),/^astra-p124-(basic|pro|business)\.png$/i);
            await fs.writeFile(screenshot,image.toPNG(),{flag:'wx'});
            report.screenshots??=[];report.screenshots.push({sku:plan.sku,file:path.basename(screenshot),sha256:sha(image.toPNG())});
          }
          await click('[data-local-ai-accept]');
          await waitFor(currentSource,value=>value===proposed,10000,'explicit approve '+plan.sku);
          await click('[data-local-ai-undo]');
          await waitFor(currentSource,value=>value===text,10000,'Undo '+plan.sku);
          approvedUndo=true;
        }else{
          await click('[data-local-ai-reject]');
          await waitFor(()=>evaluate('!document.querySelector("[data-local-ai-proposal]")'),Boolean,10000,'reject '+plan.sku);
          assert.equal(await currentSource(),text,'rejection must retain the product source');
          rejected++;
        }
      }
      if(isQuality){
        assert.equal(attempted,CASES.length,'C005 must run each distinct synthetic input once per SKU');
        assert.equal(new Set(caseResults.map(item=>item.case_id)).size,CASES.length,'C005 case IDs must remain distinct');
      }else{
        assert.ok(proposalCases.length>=10,'each actual SKU context must show ten real model proposals');
        assert.ok(approvedUndo,'each actual SKU context must explicitly approve and Undo');
        assert.ok(rejected>=1,'each actual SKU context must explicitly reject at least one proposal');
      }
      const cancelText='실제 로컬 추론 취소를 확인하기 위한 합성 문장입니다. '.repeat(19).slice(0,1600);
      await setSource(cancelText);await click('[data-local-ai-run]');
      await waitFor(()=>evaluate('Boolean(document.querySelector("[data-local-ai-cancel]"))'),Boolean,20000,'cancel control '+plan.sku);
      await sleep(150);await click('[data-local-ai-cancel]');
      await waitFor(()=>evaluate('!document.querySelector("[data-local-ai-cancel]")'),Boolean,20000,'cancel completes '+plan.sku);
      assert.equal(await currentSource(),cancelText,'cancel must retain actual Workspace source');
      assert.equal(await evaluate('Boolean(document.querySelector("[data-local-ai-proposal]"))'),false,'cancelled output must not show a proposal');
      await setSource(BASELINE);
      await waitFor(()=>evaluate('window.__p124ReadPersistedSource()'),value=>value===BASELINE,12000,'persisted source after approve/reject/undo/cancel');
      const printed=scenario==='healthy'?await printPdf('astra-p124-healthy-'+plan.sku.toLowerCase()+'-after.pdf'):null;
      if(skuPdfBefore)assert.equal(printed.text,skuPdfBefore.text,
        plan.sku+' PDF text must remain identical before and after actual Workspace reviews');
      uiResults.push({sku:plan.sku,tier:plan.tier,receipt_panel:'verified',license_result:licenseResult,
        allowed_layout:selected,denied_layout:deniedLayout,model_status:'available',actual_proposals:proposalCases.length,
        inference_attempts:attempted,actual_unique_inputs:isQuality?caseResults.length:0,case_results:isQuality?caseResults:undefined,
        approved_then_undone:approvedUndo?1:0,rejected,cancelled:1,proposals:proposalCases,
        pdf_sha256:printed?.sha256||null,pdf_text_equal_before_after:Boolean(skuPdfBefore),automatic_applies:0});
    }
    if(scenario==='quality'){
      const perSku=uiResults.map(item=>({sku:item.sku,distinct_inputs:item.actual_unique_inputs,validated_proposals:item.actual_proposals||0,
        proposal_threshold_per_sku:10,proposal_threshold_met:(item.actual_proposals||0)>=10,
        approved_then_undone:item.approved_then_undone,rejected:item.rejected,cancelled:item.cancelled,
        guarded_no_proposal_cases:(item.case_results||[]).filter(test=>test.outcome==='no-guarded-proposal').length}));
      const completeUniqueCoverage=perSku.every(item=>item.distinct_inputs===CASES.length);
      const qualityGate=perSku.every(item=>item.proposal_threshold_met&&item.approved_then_undone===1&&item.rejected>=1&&item.cancelled===1);
      report.c005_quality={distinct_input_count:CASES.length,distinct_input_ids:CASES.map(([id])=>id),
        sku_count:uiResults.length,total_real_inference_calls:uiResults.reduce((sum,item)=>sum+item.inference_attempts,0),
        unique_coverage_all_skus:completeUniqueCoverage,per_sku:perSku,quality_gate:qualityGate?'PASS':'NOT_MET',
        safety_gate_zero_automatic_applies:uiResults.every(item=>item.automatic_applies===0),
        completion_status:'BLOCKED_FOR_PHYSICAL_8_GIB_PROFILE',score_change:0};
    }
    if(scenario==='healthy'){
      const finalPdf=await readPdfText(await fs.readFile(path.join(process.env.RUNNER_TEMP,'astra-p124-healthy-business-after.pdf')));
      assert.ok(finalPdf.includes('ASTRA_P124_PDF_SOURCE_7401')&&finalPdf.includes('230,000원')&&finalPdf.includes('승인전에는외부에전달하지않습니다'),
        'BUSINESS final PDF must retain the original marker, amount and negation');
      report.pdf={comparison:'before/after within each SKU layout',source_marker:true,amount:true,negation:true,
        sku_pdf_text_equal_before_after:uiResults.every(item=>item.pdf_text_equal_before_after),
        sha256_by_sku:uiResults.map(({sku,pdf_sha256})=>({sku,sha256:pdf_sha256})),
        extracted_text_sha256:sha(finalPdf)};
      report.pdf_text_equal_by_sku=true;
    }
    const storageAfter=await evaluate('window.__p124SnapshotStorage()');
    assert.equal(storageAfter,storageBefore,'synthetic V1/V2 sentinels must remain unchanged');
    const productStorageAfter=await evaluate('window.__p124SnapshotProductStorage()');
    const productTimestampsAfter=await evaluate('window.__p124ReadProductTimestamps()');
    assert.equal(productStorageAfter,productStorageBefore,'actual STEP1 V1 and STEP2 V2 content/assets must be preserved');
    report.synthetic_v1_v2_unchanged=true;
    report.product_step2_content_preserved=true;
    report.product_step2_timestamp_only_changed=productTimestampsAfter!==productTimestampsBefore;
    report.product_step2_storage_unchanged=!report.product_step2_timestamp_only_changed;
    report.sku_contexts=uiResults;
    report.automatic_applies=uiResults.reduce((sum,item)=>sum+(item.automatic_applies||0),0);
    assert.equal(report.automatic_applies,0);
    report.status='PASS';report.elapsed_ms=Date.now()-started;
    if(scenario==='quality'){
      assert.equal(report.c005_quality.distinct_input_count,31,'C005 uses the complete 31-case corpus');
      assert.equal(report.c005_quality.unique_coverage_all_skus,true,'C005 runs 31 unique cases in each SKU');
      assert.equal(report.c005_quality.safety_gate_zero_automatic_applies,true,'C005 must not auto-apply any output');
      report.c005_quality.resource_profile=report.resource_profile;
    }
  }catch(error){
    report.sku_contexts=uiResults;report.status='FAIL';report.elapsed_ms=Date.now()-started;
    report.failure_code=(currentStep+': '+String(error?.message||'P124 acceptance failed')).slice(0,320);
    console.log('P124 failure detail: '+report.failure_code);
    throw error;
  }finally{
    await fs.writeFile(reportFile,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
    console.log(`${scenario==='quality'?'C005':'P124'} ${report.status} scenario=${scenario}; sku contexts=${uiResults.length}; report=${path.basename(reportFile)}`);
  }
}
module.exports={runP124ElectronAcceptance};
