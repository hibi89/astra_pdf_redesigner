'use strict';
// P124 hosted-runner-only acceptance. It drives the production review
// component through Electron's real preload + main-process IPC bridge.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs/promises');
const path=require('node:path');
const {auditOutputPdf}=require('./pdf-output-audit.cjs');

const SKU_NAMES=['BASIC','PRO','BUSINESS'];
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
  return {schema:'astra-p124-electron-qwen3-report-v1',scenario,platform:process.platform,
    github_sha:process.env.GITHUB_SHA||null,model:{id:'Qwen3-4B-Instruct-2507',tag:'qwen3:4b-instruct',quantization:'Q8_0',
      combined_sha256:process.env.P124_MODEL_SHA256||null,source:'GitHub release locomotive-works/npu-local-model-running@v1.0',
      license:'Apache-2.0; test-only download; not redistributed'},
    runtime:{mode:scenario==='tampered'?'synthetic loopback protocol fixture':'GitHub-hosted Windows Ollama CPU runtime',
      ollama_version:scenario==='tampered'?null:'0.40.16',windows_zip_sha256:process.env.P124_OLLAMA_SHA256||null,
      ollama_host:'127.0.0.1:11434',cloud_disabled:process.env.OLLAMA_NO_CLOUD==='1',
      cpu_threads:require('node:os').cpus().length,system_memory_bytes:require('node:os').totalmem()},
    sku_contexts:[],automatic_applies:0,external_transfer:false,synthetic_v1_v2_unchanged:false,
    product_step2_storage_unchanged:false,
    pdf_text_equal:false,limitations:['Test-only SKU labels exercise the shared production LocalModelReview UI; no production issuer key or sale entitlement is configured.',
      'Only synthetic paragraphs and a synthetic print preview are used; no customer files or production profile are opened.',
      'The Qwen model is downloaded at CI runtime and is not bundled or redistributed.']};
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
  assert.ok(['healthy','missing','tampered'].includes(scenario),'Unknown P124 scenario');
  const reportFile=runnerPath(process.env.P124_REPORT_OUT,/^astra-p124-(healthy|missing|tampered)\.json$/i);
  const screenshotRoot=path.resolve(process.env.P124_SCREENSHOT_DIR||'');
  if(screenshotRoot!==path.resolve(process.env.RUNNER_TEMP))
    throw Error('P124 screenshots must stay in the isolated runner temp directory');
  const report=createReport(scenario),started=Date.now();
  const evaluate=async expression=>{
    const value=await win.webContents.executeJavaScript(`(async()=>(${expression}))()`,true);
    return value;
  };
  const waitFor=async(fn,predicate=x=>Boolean(x),timeout=120000,label='condition')=>{
    const deadline=Date.now()+timeout;
    while(Date.now()<deadline){const value=await fn();if(predicate(value))return value;await sleep(120);}
    throw Error('P124 timed out: '+label);
  };
  const click=selector=>evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e||e.disabled)throw Error('Missing/disabled acceptance control');e.click();return true})()`);
  const currentSource=()=>evaluate('document.querySelector("[data-model-source]")?.value||null');
  const applyCount=()=>evaluate('Number(document.querySelector("[data-model-apply-count]")?.textContent||0)');
  const selectSku=async sku=>{
    await evaluate(`(()=>{const e=document.querySelector('[data-p124-sku]');e.value=${JSON.stringify(sku)};e.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
    await waitFor(()=>evaluate(`document.querySelector('[data-p124-active-sku]')?.textContent==='${sku}'`),Boolean,10000,'SKU context '+sku);
  };
  const setSource=async text=>{
    await evaluate(`(()=>{const e=document.querySelector('[data-model-source]');const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;set.call(e,${JSON.stringify(text)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
    await waitFor(currentSource,value=>value===text,10000,'synthetic source update');
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
  await waitFor(()=>evaluate('Boolean(document.querySelector("[data-p124-electron-acceptance]")&&window.astraDesktop?.localModelPropose)'),Boolean,20000,'Electron fixture and preload bridge');
  const storageBefore=await evaluate('window.__p124StorageReady.then(()=>window.__p124SnapshotStorage())');
  const productStorageBefore=await evaluate('window.__p124SnapshotProductStorage()');
  const initialPdf=scenario==='healthy'?await printPdf('astra-p124-healthy-basic-before.pdf'):null;
  const uiResults=[];
  try{
    for(const sku of SKU_NAMES){
      await selectSku(sku);
      const beforeCount=await applyCount();
      await click('[data-local-ai-probe]');
      const status=await waitFor(()=>evaluate('document.querySelector("[data-local-ai-status]")?.textContent||""'),
        text=>scenario==='missing'?text.includes('찾지 못했습니다'):text.includes('로컬 모델을 찾았습니다'),
        12000,'model status '+sku);
      if(scenario==='missing'){
        assert.equal(await evaluate('document.querySelector("[data-local-ai-run]")?.disabled'),true,
          'missing model must leave AI inference disabled');
        assert.equal(await currentSource(),BASELINE,'model missing must retain the original source');
        assert.equal(await applyCount(),beforeCount,'model missing must not apply changes');
        uiResults.push({sku,model_status:'unavailable',run_disabled:true,automatic_applies:0});
        continue;
      }
      assert.equal(await evaluate('document.querySelector("[data-local-ai-run]")?.disabled'),true,
        'explicit consent is required after model detection');
      if(scenario==='tampered'){
        await click('[data-local-ai-consent]');
        await setSource('최종 결제 금액은 230,000원으로 확정되었습니다.');
        await click('[data-local-ai-run]');await waitOperation('tampered response '+sku);
        assert.equal(await evaluate('Boolean(document.querySelector("[data-local-ai-proposal]"))'),false,
          'tampered model output must never appear as an approved proposal');
        assert.equal(await currentSource(),'최종 결제 금액은 230,000원으로 확정되었습니다.');
        assert.equal(await applyCount(),beforeCount,'tampered response must not change the document');
        const message=await evaluate('document.querySelector("[data-local-ai-status]")?.textContent||""');
        assert.match(message,/원문은 변경되지 않았습니다/,'UI must explain rejected output keeps the source');
        uiResults.push({sku,model_status:'available',tampered_output:'rejected',source_unchanged:true,automatic_applies:0});
        continue;
      }

      await waitFor(()=>evaluate('window.astraDesktop.localModelPropose("synthetic-no-consent",false)'),x=>x?.reason==='local-model-consent-required',10000,'IPC consent rejection '+sku);
      assert.equal(await applyCount(),beforeCount,'unconsented IPC call must not apply text');
      await click('[data-local-ai-consent]');
      assert.equal(await evaluate('document.querySelector("[data-local-ai-run]")?.disabled'),false);
      const proposalCases=[];let approvedUndo=false;let rejected=0;let attempted=0;
      for(const [id,text] of CASES){
        if(proposalCases.length>=10)break;
        attempted++;
        const countBeforeCase=await applyCount();
        await evaluate(`window.__p124CaseId=${JSON.stringify(sku+'-'+id)}`);
        await setSource(text);
        await click('[data-local-ai-run]');await waitOperation('real Qwen3 '+sku+' '+id);
        const hasProposal=await evaluate('Boolean(document.querySelector("[data-local-ai-proposal]"))');
        assert.equal(await currentSource(),text,'model inference must never auto-apply');
        assert.equal(await applyCount(),countBeforeCase,'inference must leave the apply counter unchanged');
        if(!hasProposal)continue;
        const proposed=await evaluate('document.querySelector("[data-local-ai-after]")?.textContent||""');
        assert.ok(proposed&&signature(text)===signature(proposed),'visible draft must preserve protected facts');
        proposalCases.push({case_id:id,input_sha256:sha(text),proposal_sha256:sha(proposed),decision:approvedUndo?'reject':'approve-then-undo'});
        if(!approvedUndo){
          if(scenario==='healthy'&&proposalCases.length===1){
            const image=await win.capturePage();
            const screenshot=runnerPath(path.join(screenshotRoot,'astra-p124-'+sku.toLowerCase()+'.png'),/^astra-p124-(basic|pro|business)\.png$/i);
            await fs.writeFile(screenshot,image.toPNG(),{flag:'wx'});
            report.screenshots??=[];report.screenshots.push({sku,file:path.basename(screenshot),sha256:sha(image.toPNG())});
          }
          await click('[data-local-ai-accept]');
          await waitFor(currentSource,value=>value===proposed,10000,'explicit approve '+sku);
          assert.equal(await applyCount(),countBeforeCase+1,'explicit approve applies exactly one paragraph');
          await click('[data-local-ai-undo]');
          await waitFor(currentSource,value=>value===text,10000,'Undo '+sku);
          assert.equal(await applyCount(),countBeforeCase+2,'Undo restores the exact pre-approval source');
          approvedUndo=true;
        }else{
          await click('[data-local-ai-reject]');
          await waitFor(()=>evaluate('!document.querySelector("[data-local-ai-proposal]")'),Boolean,10000,'reject '+sku);
          assert.equal(await currentSource(),text,'rejection must retain the source');
          assert.equal(await applyCount(),countBeforeCase,'rejection must not apply a proposal');
          rejected++;
        }
      }
      assert.ok(proposalCases.length>=10,'each SKU must show at least ten real model proposals');
      assert.ok(approvedUndo,'each SKU must explicitly approve one proposal and undo it');
      assert.ok(rejected>=1,'each SKU must explicitly reject at least one proposal');
      const cancelText='실제 로컬 추론 취소를 확인하기 위한 합성 문장입니다. '.repeat(19).slice(0,1600);
      const cancelCount=await applyCount();await setSource(cancelText);await click('[data-local-ai-run]');
      await waitFor(()=>evaluate('Boolean(document.querySelector("[data-local-ai-cancel]"))'),Boolean,20000,'cancel control '+sku);
      await sleep(150);await click('[data-local-ai-cancel]');
      await waitFor(()=>evaluate('!document.querySelector("[data-local-ai-cancel]")'),Boolean,20000,'cancel completes '+sku);
      assert.equal(await currentSource(),cancelText,'cancel must retain original text');
      assert.equal(await evaluate('Boolean(document.querySelector("[data-local-ai-proposal]"))'),false,'cancelled output must not show a proposal');
      assert.equal(await applyCount(),cancelCount,'cancel must not apply model output');
      await setSource(BASELINE);
      const printed=await printPdf(`astra-p124-healthy-${sku.toLowerCase()}-after.pdf`);
      if(sku==='BASIC')assert.equal(printed.text,initialPdf.text,'BASIC PDF text changed after an unapproved proposal/reject/Undo');
      uiResults.push({sku,model_status:'available',actual_proposals:proposalCases.length,
        inference_attempts:attempted,approved_then_undone:1,rejected,cancelled:1,
        proposals:proposalCases,pdf_sha256:printed.sha256,automatic_applies:0});
    }
    if(scenario==='healthy'){
      const finalPdf=await readPdfText(await fs.readFile(path.join(process.env.RUNNER_TEMP,'astra-p124-healthy-business-after.pdf')));
      assert.equal(finalPdf,initialPdf.text,'PDF text must remain identical after all 3 SKU review scenarios');
      assert.ok(finalPdf.includes('ASTRA_P124_PDF_SOURCE_7401')&&finalPdf.includes('230,000원')&&finalPdf.includes('승인전에는외부에전달하지않습니다'),
        'PDF output must retain the original marker, amount and negation');
      report.pdf={before_sha256:initialPdf.sha256,final_sha256:uiResults.at(-1).pdf_sha256,
        extracted_text_sha256:sha(finalPdf),text_equal:true,original_marker:true,amount:true,negation:true};
      report.pdf_text_equal=true;
    }
    const storageAfter=await evaluate('window.__p124SnapshotStorage()');
    assert.equal(storageAfter,storageBefore,'synthetic localStorage V1 and IndexedDB V2 sentinels must remain unchanged');
    const productStorageAfter=await evaluate('window.__p124SnapshotProductStorage()');
    assert.equal(productStorageAfter,productStorageBefore,'actual product localStorage V1 and STEP2 IndexedDB V2 must remain unchanged');
    report.synthetic_v1_v2_unchanged=true;
    report.product_step2_storage_unchanged=true;
    report.sku_contexts=uiResults;
    report.automatic_applies=uiResults.reduce((sum,item)=>sum+(item.automatic_applies||0),0);
    assert.equal(report.automatic_applies,0);
    report.status='PASS';report.elapsed_ms=Date.now()-started;
  }catch(error){
    report.sku_contexts=uiResults;report.status='FAIL';report.elapsed_ms=Date.now()-started;
    report.failure_code=String(error?.message||'P124 acceptance failed').slice(0,160);
    throw error;
  }finally{
    await fs.writeFile(reportFile,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
    console.log(`P124 ${report.status} scenario=${scenario}; sku contexts=${uiResults.length}; report=${path.basename(reportFile)}`);
  }
}
module.exports={runP124ElectronAcceptance};
