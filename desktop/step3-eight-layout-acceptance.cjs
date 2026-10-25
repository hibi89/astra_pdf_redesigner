'use strict';
// M08-A: render *each actual chosen theme* in the installed Electron/NSIS renderer.
// All files are temporary synthetic PDFs on GitHub-hosted Windows CI only.
const fs=require('node:fs/promises');
const path=require('node:path');

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
