// Dedicated Chromium/Edge process for real-CDP CI: OS-assigned debug port,
// bounded stderr diagnostics, and exit-confirmed process shutdown.
import {spawn} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const isAlive=child=>child.exitCode===null&&child.signalCode===null;

export function launchBrowser(binary,profile,label='browser') {
  // Chrome and Edge write a fresh DevToolsActivePort into this isolated profile
  // when remote-debugging-port=0. Never query a hard-coded port owned by
  // a previous test run or another browser.
  const child=spawn(binary,[
    '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
    '--disable-background-networking','--no-first-run','--no-default-browser-check',
    `--user-data-dir=${profile}`,'--remote-debugging-port=0','about:blank',
  ],{stdio:['ignore','ignore','pipe']});
  let stderr='',spawnError=null,exitState=null;
  child.stderr?.on('data',chunk=>{stderr=(stderr+String(chunk)).slice(-16000);});
  // Retain early spawn errors rather than throwing as an unhandled event.
  child.on('error',err=>{spawnError=err;});
  const exit=new Promise(resolve=>{
    const settled=value=>{if(!exitState){exitState=value;resolve(value);}};
    child.once('exit',(code,signal)=>settled({code,signal}));
    child.once('error',error=>settled({error:error.message}));
  });
  const diagnostic=(cause)=>new Error(
    `${label} (${binary}) ${cause}; pid=${child.pid??'none'}; `+
    `exit=${JSON.stringify(exitState)}; spawnError=${spawnError?.message??'none'}; `+
    `stderr-tail=${stderr.trim().slice(-8000)||'(empty)'}`
  );
  return{
    child,
    async devtools(timeoutMs=18000){
      const file=join(profile,'DevToolsActivePort');
      const until=Date.now()+timeoutMs;
      let last='DevToolsActivePort not found';
      while(Date.now()<until){
        if(spawnError||!isAlive(child))throw diagnostic('exited before CDP was ready: '+last);
        try{
          const record=readFileSync(file,'utf8').split(/\r?\n/);
          const port=Number(record[0]);
          if(!Number.isInteger(port)||port<1||port>65535)throw Error('invalid DevToolsActivePort');
          const r=await fetch(`http://127.0.0.1:${port}/json/version`,{signal:AbortSignal.timeout(700)});
          if(!r.ok)throw Error('HTTP '+r.status);
          const info=await r.json();
          if(typeof info.webSocketDebuggerUrl!=='string')throw Error('CDP endpoint missing');
          console.log(`PASS BROWSER CDP READY: ${label} pid=${child.pid}, assigned-port=${port}`);
          return info.webSocketDebuggerUrl;
        }catch(error){last=error instanceof Error?error.message:String(error);}
        await pause(140);
      }
      throw diagnostic('CDP startup timed out after '+timeoutMs+'ms: '+last);
    },
    async close(){
      if(!isAlive(child)){await exit;return;}
      child.kill('SIGTERM');
      await Promise.race([exit,pause(3500)]);
      if(isAlive(child)){
        child.kill('SIGKILL');
        await Promise.race([exit,pause(3500)]);
      }
      if(isAlive(child))throw diagnostic('did not exit after SIGTERM/SIGKILL');
      await exit;
    },
  };
}
