'use strict';
// M08-A: render *each actual chosen theme* in the installed Electron/NSIS renderer.
// All files are temporary synthetic PDFs on GitHub-hosted Windows CI only.
const fs=require('node:fs/promises');
const path=require('node:path');
const {auditOutputPdf}=require('./pdf-output-audit.cjs');

const BASIC_THEMES=Object.freeze(['report','minimal','diary','compact','editorial','ledger','brief','folio']);
async function chooseTheme(themeIndex){
  const themes=[...document.querySelectorAll('input[name="v2theme"]')];
  if(themes.length!==8)throw Error('Installed theme chooser count not eight: '+themes.length);
  const theme=['report','minimal','diary','compact','editorial','ledger','brief','folio'][themeIndex];
  const radio=themes[themeIndex];
  if(!radio||radio.disabled)throw Error('Installed template unavailable: '+theme);
  radio.click();
  for(let i=0;i<160;i++){
    const paper=document.querySelector('.project-paper');
    const selected=themes[themeIndex]?.checked;
    if(selected&&paper?.classList.contains('paper-theme-'+theme)&&
       document.querySelector('.save-chip')?.textContent==='저장됨'&&
       paper.textContent.includes('ASTRA_PDF_PAGE_ONE_7401')&&
       paper.textContent.includes('ASTRA_PDF_PAGE_TWO_7402')){
      await document.fonts.ready;
      await Promise.all([...paper.querySelectorAll('img')].map(img=>img.decode()));
      const title=paper.querySelector('.document-heading h1')?.textContent?.trim();
      if(!title)throw Error('No title in installed print preview: '+theme);
      return {theme,title,images:paper.querySelectorAll('img').length};
    }
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw Error('Installed renderer never switched/committed theme '+theme);
}

async function prepareInstalledStyleComparison(){
  const themes=[...document.querySelectorAll('input[name="v2theme"]')];
  if(themes.length!==8)throw Error('STEP4 installed compare expected eight existing themes');
  const originalIndex=themes.findIndex(input=>input.checked);
  const targetIndex=originalIndex===7?0:7;
  const targetTheme=['report','minimal','diary','compact','editorial','ledger','brief','folio'][targetIndex];
  const paper=document.querySelector('.project-paper');
  const originalClass=paper?.className;
  const sourceText=paper?.textContent;
  const saveStatus=document.querySelector('.save-chip')?.textContent;
  if(originalIndex<0||!paper?.textContent.includes('ASTRA_PDF_PAGE_ONE_7401')||
     !paper.textContent.includes('ASTRA_PDF_PAGE_TWO_7402'))throw Error('STEP4 source fixture missing');
  document.querySelector('[data-style-compare-toggle]')?.click();
  for(let i=0;i<100;i++){
    if(document.querySelectorAll('[data-style-compare-theme]').length===8)break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  const candidate=document.querySelector('[data-style-compare-theme="'+targetTheme+'"]');
  if(!candidate)throw Error('STEP4 comparison candidates did not load');
  candidate.click();
  for(let i=0;i<100;i++){
    if(document.querySelector('.project-paper')?.classList.contains('paper-theme-'+targetTheme))break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  if(!document.querySelector('.project-paper')?.classList.contains('paper-theme-'+targetTheme))
    throw Error('STEP4 ephemeral compare theme was not rendered');
  if(!themes[originalIndex].checked||document.querySelector('.save-chip')?.textContent!==saveStatus)
    throw Error('STEP4 ephemeral comparison wrote a design change');
  document.querySelector('[data-style-compare-side-by-side]')?.click();
  for(let i=0;i<100;i++){
    if(document.querySelectorAll('[data-style-compare-gallery] .style-compare-card .project-paper').length===2)break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  const originalPreview=document.querySelector('[data-style-compare-original] .project-paper');
  const candidatePreview=document.querySelector('[data-style-compare-candidate] .project-paper');
  if(!originalPreview?.classList.contains('paper-theme-'+['report','minimal','diary','compact','editorial','ledger','brief','folio'][originalIndex])||
     !candidatePreview?.classList.contains('paper-theme-'+targetTheme))
    throw Error('STEP4 side-by-side gallery did not show the saved design beside its candidate');
  if(!themes[originalIndex].checked||document.querySelector('.save-chip')?.textContent!==saveStatus)
    throw Error('STEP4 side-by-side gallery changed the saved design');
  return {originalIndex,targetIndex,originalClass,sourceText,saveStatus,sideBySide:true,
    expectedRasterImages:originalPreview.querySelectorAll('img').length};
}
async function finishInstalledStyleComparison(expected){
  const apply=document.querySelector('[data-style-compare-apply]');
  if(!apply||apply.disabled)throw Error('STEP4 compare apply unavailable');
  apply.click();
  for(let i=0;i<100;i++){
    if(document.querySelectorAll('input[name="v2theme"]')[expected.targetIndex]?.checked&&
       document.querySelector('.save-chip')?.textContent==='저장됨')break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  if(!document.querySelectorAll('input[name="v2theme"]')[expected.targetIndex]?.checked)
    throw Error('STEP4 comparison theme was not saved');
  const undo=document.querySelector('[data-style-compare-undo]');
  if(!undo||undo.disabled)throw Error('STEP4 exact apply undo unavailable');
  undo.click();
  for(let i=0;i<100;i++){
    if(document.querySelectorAll('input[name="v2theme"]')[expected.originalIndex]?.checked&&
       document.querySelector('.save-chip')?.textContent==='저장됨')break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  const paper=document.querySelector('.project-paper');
  if(!document.querySelectorAll('input[name="v2theme"]')[expected.originalIndex]?.checked||
     paper?.className!==expected.originalClass||paper?.textContent!==expected.sourceText)
    throw Error('STEP4 apply undo failed to restore design or document content');
  document.querySelector('[data-style-compare-toggle]')?.click();
  return true;
}
async function exerciseInstalledStyleComparison(win,renderLocalPdf){
  const expected=await win.webContents.executeJavaScript(
    '('+prepareInstalledStyleComparison.toString()+')()',true);
  const bytes=await renderLocalPdf(); // actual installed Electron PDF while the comparison theme is still ephemeral
  if(bytes.length<3000||bytes.subarray(0,5).toString('ascii')!=='%PDF-')
    throw Error('STEP4 comparison preview did not produce a valid actual PDF');
  const audit=await auditOutputPdf(bytes,['ASTRA_PDF_PAGE_ONE_7401','ASTRA_PDF_PAGE_TWO_7402'],expected.expectedRasterImages);
  if(audit.pages!==2||audit.missing.length||audit.issues.length)
    throw Error('STEP4 side-by-side print must emit the candidate A4 document once: '+JSON.stringify(audit));
  await win.webContents.executeJavaScript(
    '('+finishInstalledStyleComparison.toString()+')('+JSON.stringify(expected)+')',true);
  console.log('PASS STEP4 INSTALLED SAME-DOCUMENT COMPARE/APPLY/UNDO: side-by-side previews match actual current/candidate layouts, one 2-page A4 candidate printed, existing design/content restored');
}
async function runInstalledEightLayoutAcceptance(win,renderLocalPdf){
  if(process.env.GITHUB_ACTIONS!=='true'||process.platform!=='win32'||!process.env.RUNNER_TEMP)
    throw Error('M08-A allowed only on GitHub-hosted Windows CI');
  const root=path.resolve(process.env.RUNNER_TEMP);
  const raw=process.env.ASTRA_STEP3_EIGHT_DIR;
  if(!raw)throw Error('M08-A output directory not configured');
  const folder=path.resolve(raw);
  if(path.dirname(folder)!==root||!/^astra-step3-layouts-[A-Za-z0-9-]+$/i.test(path.basename(folder)))
    throw Error('M08-A output path must be an isolated runner-only directory');
  await fs.mkdir(folder,{recursive:false}); // never overwrite or reuse a prior output
  await exerciseInstalledStyleComparison(win,renderLocalPdf);
  let commonTitle=null;
  for(let index=0;index<BASIC_THEMES.length;index++){
    const theme=BASIC_THEMES[index];
    const selected=await win.webContents.executeJavaScript(
      '('+chooseTheme.toString()+')('+index+')',true);
    if(selected?.theme!==theme||selected.images<1)
      throw Error('Installed theme/image not ready: '+theme);
    if(commonTitle!==null&&commonTitle!==selected.title)
      throw Error('Theme changed original synthetic document title: '+theme);
    commonTitle=selected.title;
    const bytes=await renderLocalPdf(); // real installed Electron printToPDF(A4)
    if(bytes.length<3000||bytes.subarray(0,5).toString('ascii')!=='%PDF-')
      throw Error('Installed print produced invalid PDF for '+theme);
    const file=path.join(folder,'astra-'+theme+'.pdf');
    await fs.writeFile(file,bytes,{flag:'wx'});
    console.log('PASS M08-A INSTALLED PDF WRITTEN:',theme,'bytes='+bytes.length);
  }
  await fs.writeFile(path.join(folder,'manifest.json'),
    JSON.stringify({themes:BASIC_THEMES,title:commonTitle},null,2),{flag:'wx'});
  console.log('PASS M08-A INSTALLED 8 PDF OUTPUTS: actual Electron A4 renderer, preserved synthetic source');
}
module.exports={BASIC_THEMES,runInstalledEightLayoutAcceptance};
