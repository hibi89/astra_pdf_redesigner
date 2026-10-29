'use strict';
const {app,BrowserWindow,dialog,ipcMain,net,protocol,session}=require('electron');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {resolveBundleAsset}=require('./bundle-path.cjs');
const {auditOutputPdf}=require('./pdf-output-audit.cjs');
const {acceptanceDomSource,MARKERS}=require('./pdf-acceptance-fixture.cjs');
const {runStep2ProjectAcceptance}=require('./step2-project-acceptance.cjs');
const {runStep3ProjectAcceptance}=require('./step3-project-acceptance.cjs');
const {createLocalModelController}=require('./local-model-controller.cjs');
const localModel=createLocalModelController({resourcesDir:process.resourcesPath});

const APP_URL='astra://app/index.html';
const SMOKE=process.argv.includes('--astra-desktop-smoke');
const PDF_ACCEPTANCE=SMOKE&&process.argv.includes('--astra-pdf-acceptance');
const STEP2_ACCEPTANCE=SMOKE&&(process.argv.includes('--astra-step2-acceptance')||process.argv.includes('--astra-step2-preservation-verify'));
const STEP3_ACCEPTANCE=SMOKE&&process.argv.includes('--astra-step3-acceptance');
let step3NativeCaptureArmed=false;
function step3OutputPath(){
  if(process.env.GITHUB_ACTIONS!=='true'||!process.env.RUNNER_TEMP||!process.env.ASTRA_STEP3_ACCEPTANCE_OUT)
    throw Error('STEP3 acceptance is restricted to ephemeral GitHub Actions runners');
  const root=path.resolve(process.env.RUNNER_TEMP);
  const output=path.resolve(process.env.ASTRA_STEP3_ACCEPTANCE_OUT);
  if(path.dirname(output)!==root||
     !/^astra-step3-import-[A-Za-z0-9-]+\.pdf$/i.test(path.basename(output)))
    throw Error('STEP3 output must be an isolated runner PDF');
  return output;
}
protocol.registerSchemesAsPrivileged([{
  scheme:'astra',
  privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true},
}]);
app.setName('ASTRA PDF Redesigner');
app.setPath('userData',SMOKE
  ?(process.env.GITHUB_ACTIONS==='true'&&process.env.ASTRA_STEP2_PROFILE_DIR&&
    path.dirname(path.resolve(process.env.ASTRA_STEP2_PROFILE_DIR))===path.resolve(process.env.RUNNER_TEMP||'')&&
    /^astra-step2-profile-[A-Za-z0-9-]+$/.test(path.basename(process.env.ASTRA_STEP2_PROFILE_DIR))
    ?path.resolve(process.env.ASTRA_STEP2_PROFILE_DIR)
    :path.join(os.tmpdir(),'astra-desktop-ci-'+process.pid))
  :path.join(app.getPath('appData'),'AstraPDFRedesigner'));
if(process.platform==='win32')app.setAppUserModelId('com.astra.pdfredesigner');

const lock=app.requestSingleInstanceLock();
if(!lock)app.quit();
let mainWindow;
const isAppUrl=(input)=>{
  try{const u=new URL(input);return u.protocol==='astra:'&&u.hostname==='app';}
  catch{return false;}
};

function configureSession(){
  const ses=session.defaultSession;
  const root=path.resolve(app.getAppPath(),'dist');
  ses.protocol.handle('astra',request=>{
    if(request.method!=='GET'&&request.method!=='HEAD')
      return new Response('Method not allowed',{status:405});
    const target=resolveBundleAsset(root,request.url);
    if(!target)return new Response('Not found',{status:404});
    return net.fetch(pathToFileURL(target).toString());
  });
  // No external HTTP requests; PDF bytes and documents remain local.
  ses.webRequest.onBeforeRequest({urls:['http://*/*','https://*/*']},(_details,callback)=>{
    callback({cancel:true});
  });
  ses.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
  ses.webRequest.onHeadersReceived({urls:['astra://app/*']},(details,callback)=>{
    callback({responseHeaders:{
      ...details.responseHeaders,
      'Content-Security-Policy':[
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"+
        " img-src 'self' blob: data:; font-src 'self' data:;"+
        " worker-src 'self' blob:; connect-src 'self'; frame-src 'self' blob:;"+
        " object-src 'none'; base-uri 'self'; form-action 'none'",
      ],
    }});
  });
  ses.on('will-download',(event,item)=>{
    const target=dialog.showSaveDialogSync(mainWindow,{
      title:'내보낼 파일 저장',
      defaultPath:item.getFilename(),
    });
    if(!target){event.preventDefault();return;}
    item.setSavePath(target);
  });
}


const PDF_OPTIONS=Object.freeze({pageSize:'A4',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
function validOutputMarkers(value){
  if(value===undefined)return[];
  if(!Array.isArray(value)||value.length>7000||value.some(marker=>typeof marker!=='string'||marker.length>96)||
     value.reduce((total,marker)=>total+marker.length,0)>600000)
    throw Error('Invalid PDF output review markers');
  return value;
}
async function renderLocalPdf(){
  if(!mainWindow||mainWindow.isDestroyed())throw Error('No active document window');
  const pdf=await mainWindow.webContents.printToPDF(PDF_OPTIONS);
  if(pdf.length<1024||pdf.subarray(0,5).toString('ascii')!=='%PDF-')
    throw Error('PDF renderer returned an invalid document');
  return pdf;
}
function registerPdfSaving(){
  ipcMain.handle('astra:save-pdf',async(event,rawExpectedTextMarkers,expectRasterImage=false)=>{
    if(!mainWindow||event.sender!==mainWindow.webContents||
       !isAppUrl(event.sender.getURL()))throw Error('Blocked untrusted PDF export request');
    const expectedTextMarkers=validOutputMarkers(rawExpectedTextMarkers);
    if(typeof expectRasterImage!=='boolean')throw Error('Invalid PDF image review flag');
    // Smoke mode uses an isolated test-only directory. It never opens the
    // native picker or writes into the user's Documents directory.
    if(SMOKE){
      const persistentTestOutput=STEP3_ACCEPTANCE&&step3NativeCaptureArmed;
      const output=persistentTestOutput?step3OutputPath():path.join(app.getPath('userData'),'astra-desktop-smoke.pdf');
      try{
        const data=await renderLocalPdf();
        await fs.mkdir(path.dirname(output),{recursive:true});
        await fs.writeFile(output,data,{flag:'wx'});
        const actual=await fs.readFile(output);
        if(actual.length!==data.length||actual.subarray(0,5).toString('ascii')!=='%PDF-')
          throw Error('Generated PDF did not persist correctly');
        console.log('PASS ASTRA DESKTOP PDF EXPORT: Electron printToPDF and Windows filesystem, bytes='+actual.length);
        return{status:'saved'};
      }finally{if(!persistentTestOutput)await fs.rm(output,{force:true});}
    }
    try{
      const data=await renderLocalPdf();
      const audit=await auditOutputPdf(data,expectedTextMarkers,expectRasterImage);
      if(audit.issues.length){
        const choice=await dialog.showMessageBox(mainWindow,{
          type:'warning',title:'PDF 출력 검수',
          message:'자동 검수에서 확인이 필요한 항목을 찾았습니다.',
          detail:audit.issues.map(issue=>'• '+issue).join('\n')+'\n\n텍스트 외관, 표·도형, 원본과의 의미상 일치 여부는 자동 검수만으로 보증되지 않습니다. 출력 파일을 확인하세요.',
          buttons:['계속 저장','취소'],defaultId:0,cancelId:1,noLink:true,
        });
        if(choice.response!==0)return{status:'cancelled'};
      }
      const selection=await dialog.showSaveDialog(mainWindow,{
        title:'PDF로 저장',
        buttonLabel:'PDF 저장',
        defaultPath:path.join(app.getPath('documents'),'ASTRA-문서.pdf'),
        filters:[{name:'PDF 문서',extensions:['pdf']}],
      });
      if(selection.canceled||!selection.filePath)return{status:'cancelled'};
      const output=/\.pdf$/i.test(selection.filePath)?selection.filePath:selection.filePath+'.pdf';
      await fs.writeFile(output,data);
      console.log('PASS ASTRA PDF OUTPUT PREFLIGHT: pages='+audit.pages+', textItems='+audit.textItems+', warnings='+audit.issues.length);
      return{status:'saved'};
    }catch(error){
      console.error('ASTRA desktop PDF export failed:',error instanceof Error?error.name:'unknown');
      return{status:'error',message:'PDF 파일을 저장하지 못했습니다. 대상 폴더의 권한과 여유 공간을 확인하세요.'};
    }
  });
}

function registerLocalModel(){
  const trusted=event=>mainWindow&&!mainWindow.isDestroyed()&&
    event.sender===mainWindow.webContents&&isAppUrl(event.sender.getURL());
  ipcMain.handle('astra:local-model-status',async event=>{
    if(!trusted(event))throw Error('Untrusted model status request');
    return localModel.status();
  });
  ipcMain.handle('astra:local-model-propose',async(event,text)=>{
    if(!trusted(event))throw Error('Untrusted model proposal request');
    return localModel.propose(text);
  });
  ipcMain.handle('astra:local-model-cancel',async event=>{
    if(!trusted(event))throw Error('Untrusted model cancellation request');
    return localModel.cancel();
  });
}

function createWindow(){
  mainWindow=new BrowserWindow({
    width:1360,height:900,minWidth:900,minHeight:620,
    show:!SMOKE,title:'ASTRA PDF Redesigner',
    backgroundColor:'#f4f5f6',
    webPreferences:{
      preload:path.join(__dirname,'preload.cjs'),
      sandbox:true,contextIsolation:true,nodeIntegration:false,
      webviewTag:false,devTools:!app.isPackaged,webSecurity:true,
    },
  });
  mainWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  mainWindow.webContents.on('will-navigate',(event,url)=>{
    if(!isAppUrl(url))event.preventDefault();
  });
  mainWindow.webContents.on('will-attach-webview',event=>event.preventDefault());
  return mainWindow.loadURL(APP_URL);
}

async function runSmoke(win){
  const evaluate=(source)=>win.webContents.executeJavaScript(source,true);
  let mounted=false;
  for(let i=0;i<40;i++){
    mounted=await evaluate("Boolean(document.querySelector('#root')?.firstElementChild)");
    if(mounted)break;
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!mounted)throw Error('React renderer did not mount');
  const source=[
    "(async()=>{",
    "if(location.protocol!=='astra:')throw Error('Wrong scheme');",
    "if(typeof window.print!=='function')throw Error('Print API missing');",
    "localStorage.setItem('__astra_desktop_ci__','ok');",
    "const valid=await new Promise((resolve,reject)=>{",
    "const request=indexedDB.open('__astra_desktop_ci__',1);",
    "request.onerror=()=>reject(request.error);",
    "request.onupgradeneeded=()=>request.result.createObjectStore('pings');",
    "request.onsuccess=()=>{request.result.close();resolve(true);};",
    "});",
    "indexedDB.deleteDatabase('__astra_desktop_ci__');",
    "return{valid,title:document.title};",
    "})()",
  ].join('');
  const checked=await evaluate(source);
  if(!checked.valid||!checked.title)throw Error('Desktop storage or title failure');
  await win.loadURL(APP_URL);
  const persisted=await evaluate("localStorage.getItem('__astra_desktop_ci__')==='ok'");
  if(!persisted)throw Error('Local storage lost after navigation');
  const bridge=await evaluate("typeof window.astraDesktop?.savePdf==='function'");
  if(!bridge)throw Error('Secure PDF export bridge unavailable');
  const modelStatus=await evaluate('window.astraDesktop.localModelStatus()');
  if(modelStatus.status!=='unavailable')throw Error('Model must fail closed without shipped weights');
  const unavailableProposal=await evaluate("window.astraDesktop.localModelPropose('synthetic CI text')");
  if(unavailableProposal.status!=='unavailable')throw Error('Unshipped model unexpectedly executed');
  const saved=await evaluate("window.astraDesktop.savePdf()");
  if(saved?.status!=='saved')throw Error('Desktop PDF export failed: '+JSON.stringify(saved));
  await evaluate("localStorage.removeItem('__astra_desktop_ci__')");
  console.log('PASS DESKTOP ELECTRON SMOKE: React, secure protocol, IndexedDB, print API, storage reload');
}


async function runPdfContentAcceptance(win){
  if(!SMOKE||!PDF_ACCEPTANCE||process.env.GITHUB_ACTIONS!=='true')
    throw Error('PDF acceptance fixture is restricted to CI smoke');
  const runnerRoot=path.resolve(process.env.RUNNER_TEMP||'');
  const output=path.resolve(process.env.ASTRA_PDF_ACCEPTANCE_OUT||'');
  if(!process.env.RUNNER_TEMP||!process.env.ASTRA_PDF_ACCEPTANCE_OUT||
     path.dirname(output)!==runnerRoot||
     !/^astra-pdf-acceptance-[A-Za-z0-9-]+\.pdf$/i.test(path.basename(output)))
    throw Error('PDF acceptance output must be an isolated GitHub runner PDF');
  const fixture=await win.webContents.executeJavaScript(acceptanceDomSource(),true);
  if(!fixture?.imageLoaded||!fixture?.text?.includes(MARKERS.first)||
     !fixture?.text?.includes(MARKERS.second)||!fixture?.text?.includes(MARKERS.korean))
    throw Error('Synthetic printable preview was not ready');
  const bytes=await renderLocalPdf();
  const audit=await auditOutputPdf(bytes,Object.values(MARKERS),true);
  if(audit.pages!==2||audit.issues.length)
    throw Error('Installed Electron output preflight rejected synthetic A4 fixture: '+JSON.stringify(audit));
  await fs.writeFile(output,bytes,{flag:'wx'});
  const written=await fs.readFile(output);
  if(written.length!==bytes.length||written.subarray(0,5).toString('ascii')!=='%PDF-')
    throw Error('Installed Electron did not persist the PDF acceptance output');
  console.log('PASS ASTRA PDF CONTENT FIXTURE: installed renderer printed a two-page Korean/image synthetic preview; independent output audit passed');
}

if(lock){
  app.on('second-instance',()=>{
    if(mainWindow){if(mainWindow.isMinimized())mainWindow.restore();mainWindow.focus();}
  });
  app.whenReady().then(async()=>{
    try{
      configureSession();
      registerPdfSaving();
      registerLocalModel();
      await createWindow();
      if(SMOKE){
        await runSmoke(mainWindow);
        if(PDF_ACCEPTANCE)await runPdfContentAcceptance(mainWindow);
        if(STEP2_ACCEPTANCE)await runStep2ProjectAcceptance(mainWindow,renderLocalPdf);
        if(STEP3_ACCEPTANCE)await runStep3ProjectAcceptance(mainWindow,renderLocalPdf,
          ()=>{step3NativeCaptureArmed=true;},step3OutputPath());
        app.exit(0);
      }
    }catch(error){console.error('ASTRA desktop startup failure:',error);app.exit(1);}
  });
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)void createWindow();});
  app.on('window-all-closed',()=>app.quit());
}
