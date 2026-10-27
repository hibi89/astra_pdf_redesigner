'use strict';
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');

const repoRoot=path.resolve(__dirname,'..');
const tempRoot=path.resolve(os.tmpdir());
const profile=fs.mkdtempSync(path.join(tempRoot,'astra-p5-pdf-visual-profile-'));
const nonce=process.pid+'-'+Date.now();
const output=path.join(tempRoot,'astra-p5-pdf-visual-'+nonce+'.pdf');
const renderPrefix=path.join(tempRoot,'astra-p5-pdf-visual-'+nonce+'-page');
const electronBin=require('electron');
const verifier=path.join(repoRoot,'tests','verify-desktop-pdf.mjs');
let completed=false;

function run(binary,args,options={}){
  const result=spawnSync(binary,args,{cwd:repoRoot,encoding:'utf8',windowsHide:true,
    timeout:120000,maxBuffer:8*1024*1024,...options});
  if(result.stdout)process.stdout.write(result.stdout);
  if(result.stderr)process.stderr.write(result.stderr);
  if(result.error)throw result.error;
  if(result.status!==0)throw Error(binary+' exited with status '+result.status);
}

function removeOwnedProfile(){
  if(!fs.existsSync(profile))return;
  const resolved=path.resolve(profile),info=fs.lstatSync(resolved);
  if(path.dirname(resolved)!==tempRoot||
     !/^astra-p5-pdf-visual-profile-[A-Za-z0-9-]+$/.test(path.basename(resolved))||
     !info.isDirectory()||info.isSymbolicLink())
    throw Error('Refusing to remove an unexpected local PDF acceptance profile');
  fs.rmSync(resolved,{recursive:true,force:false,maxRetries:8,retryDelay:100});
  if(fs.existsSync(resolved))throw Error('Local PDF acceptance profile cleanup left files behind');
}

try{
  if(path.dirname(profile)!==tempRoot||path.dirname(output)!==tempRoot||
     !/^astra-p5-pdf-visual-profile-[A-Za-z0-9-]+$/.test(path.basename(profile))||
     !/^astra-p5-pdf-visual-[A-Za-z0-9-]+\.pdf$/.test(path.basename(output))||
     fs.existsSync(output))
    throw Error('Local PDF acceptance generated an unsafe temp path');

  run(electronBin,[repoRoot,'--astra-desktop-smoke','--astra-local-step2-acceptance'],{
    env:{...process.env,ASTRA_LOCAL_PDF_PROFILE:profile,ASTRA_LOCAL_PDF_OUTPUT:output},
  });
  run(process.execPath,[verifier,output,'--local-synthetic','--step2-project']);

  const pdfToPpm=process.env.PDFTOPPM_PATH||'pdftoppm';
  run(pdfToPpm,['-r','120','-png',output,renderPrefix]);
  const rendered=fs.readdirSync(tempRoot)
    .filter(name=>name.startsWith(path.basename(renderPrefix)+'-')&&name.endsWith('.png'))
    .sort((left,right)=>left.localeCompare(right,undefined,{numeric:true}));
  if(rendered.length!==3)throw Error('Expected three rendered PDF pages; found '+rendered.length);
  completed=true;
  console.log('PASS ASTRA LOCAL PDF VISUAL FIXTURE: synthetic STEP2 PDF passed A4/content checks and rendered 3 pages');
  for(const name of rendered)console.log(path.join(tempRoot,name));
  console.log('Synthetic PDF: '+output);
}finally{
  try{removeOwnedProfile();}
  finally{
    if(!completed){
      if(path.dirname(output)===tempRoot&&/^astra-p5-pdf-visual-[A-Za-z0-9-]+\.pdf$/.test(path.basename(output))&&fs.existsSync(output))
        fs.rmSync(output,{force:true});
      if(path.dirname(renderPrefix)===tempRoot&&/^astra-p5-pdf-visual-[A-Za-z0-9-]+-page$/.test(path.basename(renderPrefix))){
        for(const name of fs.readdirSync(tempRoot).filter(item=>item.startsWith(path.basename(renderPrefix)+'-')&&item.endsWith('.png'))){
          const renderedPath=path.join(tempRoot,name),info=fs.lstatSync(renderedPath);
          if(path.dirname(renderedPath)===tempRoot&&info.isFile()&&!info.isSymbolicLink())fs.rmSync(renderedPath,{force:true});
        }
      }
    }
  }
}
