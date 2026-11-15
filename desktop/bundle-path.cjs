'use strict';
const path=require('node:path');

function resolveBundleAsset(root,requestUrl){
  let url;
  try{url=new URL(requestUrl);}catch{return null;}
  if(url.protocol!=='astra:'||url.hostname!=='app'||url.username||url.password||url.port||url.search)return null;
  let pathname;
  try{pathname=decodeURIComponent(url.pathname);}catch{return null;}
  if(!pathname.startsWith('/')||pathname.includes('\\')||pathname.includes('\0'))return null;
  const requested=pathname==='/'?'/index.html':pathname;
  if(requested.split('/').some(segment=>segment==='..'||segment==='.'||segment.includes(':')))return null;
  const resolvedRoot=path.resolve(root);
  const target=path.resolve(resolvedRoot,'.'+requested);
  const relative=path.relative(resolvedRoot,target);
  if(!relative||relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative))return null;
  return target;
}
module.exports={resolveBundleAsset};
