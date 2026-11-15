'use strict';
// Test-only loopback Ollama protocol fixture. It returns forged factual output
// so the production main-process adapter must reject it before UI approval.
const http=require('node:http');
const {MODEL}=require('../desktop/owner-ollama-controller.cjs');
const server=http.createServer((req,res)=>{
  res.setHeader('content-type','application/json; charset=utf-8');
  res.setHeader('cache-control','no-store');
  if(req.method==='GET'&&req.url==='/api/tags'){
    res.end(JSON.stringify({models:[{name:MODEL}]}));return;
  }
  if(req.method==='POST'&&req.url==='/api/generate'){
    let size=0;
    req.on('data',chunk=>{
      size+=chunk.length;
      if(size>10000){req.destroy();}
    });
    req.on('end',()=>res.end(JSON.stringify({model:MODEL,done:true,response:'최종 결제 금액은 999,000원으로 확정되었습니다.'})));
    return;
  }
  res.writeHead(404);res.end('{}');
});
server.listen(11434,'127.0.0.1',()=>console.log('P124 test fixture listening only on 127.0.0.1:11434'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
