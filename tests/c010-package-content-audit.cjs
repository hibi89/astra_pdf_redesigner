'use strict';

const fs=require('node:fs');
const path=require('node:path');

const MAX_FILE_BYTES=100*1024*1024;
const PATH_RULES=[
  {id:'test-fixture-path',pattern:/(?:^|\/)(?:tests?|fixtures)(?:\/|$)|p124-electron-qwen3-acceptance|p124-electron-qwen3[._-]/i},
  {id:'environment-file-path',pattern:/(?:^|\/)\.env(?:\.[^/]*)?$/i},
  {id:'customer-data-path',pattern:/(?:^|\/)(?:customer[-_ ]?data|buyer[-_ ]?data|customer[-_ ]?documents?)(?:\/|$)/i},
];
const CONTENT_RULES=[
  {id:'private-key-material',pattern:/-----BEGIN (?:(?:RSA|EC|DSA|OPENSSH) )?PRIVATE KEY-----/g},
  {id:'github-token',pattern:/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g},
  {id:'aws-access-key-id',pattern:/\bAKIA[0-9A-Z]{16}\b/g},
  {id:'aws-secret-access-key-assignment',pattern:/aws_secret_access_key\s*[:=]\s*['"][A-Za-z0-9/+=]{30,}['"]/gi},
  {id:'google-api-key',pattern:/\bAIza[0-9A-Za-z_-]{35}\b/g},
  {id:'openai-api-key',pattern:/\bsk-(?:proj-|live-)?[A-Za-z0-9_-]{24,}\b/g},
  {id:'slack-token',pattern:/\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g},
  {id:'stripe-live-secret',pattern:/\bsk_live_[A-Za-z0-9]{16,}\b/g},
  {id:'email-address',pattern:/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi},
  {id:'korean-resident-id-pattern',pattern:/\b\d{6}-?[1-4]\d{6}\b/g},
  {id:'korean-mobile-number-pattern',pattern:/(?:\+?82[- ]?)?01[016789][- ]?\d{3,4}[- ]?\d{4}\b/g},
];

function scanPackageTree(inputRoot){
  if(typeof inputRoot!=='string'||!inputRoot.trim())throw new TypeError('Pass the extracted app.asar directory.');
  const root=fs.realpathSync(path.resolve(inputRoot));
  if(!fs.statSync(root).isDirectory())throw new Error('Package audit root is not a directory.');
  const files=[];
  const findings=[];
  let totalBytes=0;
  const addFinding=(rule,file,offset=null)=>findings.push({rule,file,offset});
  const walk=(directory,relativeDirectory='')=>{
    for(const entry of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
      const absolute=path.join(directory,entry.name);
      const relativePath=path.posix.join(relativeDirectory,entry.name.replaceAll(path.sep,'/'));
      if(entry.isSymbolicLink()){
        addFinding('unexpected-symlink',relativePath);
        continue;
      }
      if(entry.isDirectory()){
        walk(absolute,relativePath);
        continue;
      }
      if(!entry.isFile())continue;
      for(const rule of PATH_RULES)if(rule.pattern.test(relativePath))addFinding(rule.id,relativePath);
      const stat=fs.statSync(absolute);
      if(stat.size>MAX_FILE_BYTES){
        addFinding('oversize-unscanned-file',relativePath);
        continue;
      }
      const bytes=fs.readFileSync(absolute);
      totalBytes+=bytes.length;
      files.push(relativePath);
      const searchable=bytes.toString('latin1');
      for(const rule of CONTENT_RULES){
        rule.pattern.lastIndex=0;
        let match;
        while((match=rule.pattern.exec(searchable))!==null){
          addFinding(rule.id,relativePath,match.index);
          if(match[0].length===0)rule.pattern.lastIndex++;
        }
      }
    }
  };
  walk(root);
  findings.sort((a,b)=>a.file.localeCompare(b.file)||a.rule.localeCompare(b.rule)||(a.offset??-1)-(b.offset??-1));
  return{fileCount:files.length,totalBytes,files,findings};
}

if(require.main===module){
  try{
    const result=scanPackageTree(process.argv[2]);
    const summary={
      status:result.findings.length?'FAIL':'PASS',
      filesScanned:result.fileCount,
      bytesScanned:result.totalBytes,
      signatureRules:CONTENT_RULES.length,
      pathRules:PATH_RULES.length,
      findings:result.findings,
    };
    console.log('C010_PACKAGE_CONTENT_AUDIT '+JSON.stringify(summary));
    if(result.findings.length)process.exitCode=1;
  }catch(error){
    console.error('C010_PACKAGE_CONTENT_AUDIT ERROR '+(error instanceof Error?error.message:String(error)));
    process.exitCode=1;
  }
}

module.exports={scanPackageTree};
