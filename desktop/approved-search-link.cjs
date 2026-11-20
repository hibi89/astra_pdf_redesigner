'use strict';
// Allow only opt-in React STEP6 URL shapes; never pass renderer-controlled protocols
// or an unverified URL to shell.openExternal. Main process still asks the owner.
const MAX_QUERY_CODEPOINTS=80;
function approvedSearchTarget(raw){
 if(typeof raw!=='string'||raw.length>800)return null;
 const hosts=[
  {prefix:'https://www.google.com/search?tbm=isch&q='},
  {prefix:'https://www.bing.com/images/search?q='},
 ];
 for(const host of hosts){
  if(!raw.startsWith(host.prefix))continue;
  const tail=raw.slice(host.prefix.length);
  if(!tail||/[&#]/u.test(tail))return null;
  let text;
  try{text=decodeURIComponent(tail);}catch{return null;}
  if(text.trim()!==text||![...text].length||[...text].length>MAX_QUERY_CODEPOINTS||
     /[\u0000-\u001f\u007f-\u009f]/u.test(text))return null;
  if(encodeURIComponent(text)!==tail)return null; // enforce our exact canonical encoding
  return raw;
 }
 return null;
}
module.exports={approvedSearchTarget};
