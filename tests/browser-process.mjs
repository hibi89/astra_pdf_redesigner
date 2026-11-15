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
    // Use the WebSocket path written by this exact browser into its own profile.
    // Edge sometimes announces "DevTools listening" while /json/version hangs;
    // HTTP discovery is unnecessary and was the source of the flaky timeout.
    // Linux Edge cold starts have taken ~24s in successful CI; allow a bounded
    // 60s readiness window for Edge only. Chrome retains the 35s limit.
    async connect(timeoutMs=/microsoft-edge/i.test(binary)?60000:35000){
      const file=join(profile,'DevToolsActivePort');
      const deadline=Date.now()+timeoutMs;
      let last='DevToolsActivePort not yet available';
      let attempts=0;
      while(Date.now()<deadline){
        if(spawnError||!isAlive(child))throw diagnostic('exited before CDP WebSocket handshake: '+last);
        try{
          const record=readFileSync(file,'utf8').split(/\r?\n/);
          const port=Number(record[0]?.trim());
          const path=record[1]?.trim();
          if(!Number.isInteger(port)||port<1||port>65535)throw Error('DevToolsActivePort has no valid port');
          if(!/^\/devtools\/browser\/[a-zA-Z0-9-]+$/.test(path??''))throw Error('DevToolsActivePort has no browser WebSocket path');
          const address=`ws://127.0.0.1:${port}${path}`;
          attempts++;
          const ws=new WebSocket(address);
          try{
            await new Promise((resolve,reject)=>{
              let settled=false,timer;
              const cleanup=()=>{
                clearTimeout(timer);
                ws.removeEventListener('open',onOpen);
                ws.removeEventListener('error',onError);
                ws.removeEventListener('close',onClose);
              };
              const succeed=()=>{
                if(settled)return;
                settled=true;cleanup();resolve();
              };
              const fail=message=>{
                if(settled)return;
                settled=true;cleanup();reject(Error(message));
              };
              const onOpen=()=>succeed();
              const onError=event=>fail('CDP WebSocket error: '+String(event?.message??'connection failed'));
              const onClose=event=>fail('CDP WebSocket closed before open: '+String(event?.code??'unknown'));
              ws.addEventListener('open',onOpen);
              ws.addEventListener('error',onError);
              ws.addEventListener('close',onClose);
              timer=setTimeout(()=>fail('CDP WebSocket handshake timed out'),Math.max(150,Math.min(1800,deadline-Date.now())));
            });
          }catch(error){
            try{ws.close();}catch{/* already closed */}
            throw error;
          }
          console.log(`PASS BROWSER CDP CONNECTED: ${label} pid=${child.pid}, assigned-port=${port}, attempts=${attempts}`);
          return ws;
        }catch(error){last=error instanceof Error?error.message:String(error);}
        await pause(200);
      }
      throw diagnostic('CDP WebSocket startup timed out after '+timeoutMs+'ms, attempts='+attempts+': '+last);
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
