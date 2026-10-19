'use strict';
// Standalone synthetic PDF content; used ONLY by the Windows CI acceptance
// mode and never persisted to the installed application's document database.
const {deflateSync}=require('node:zlib');
const MARKERS=Object.freeze({
  first:'ASTRA_PDF_PAGE_ONE_7401',
  second:'ASTRA_PDF_PAGE_TWO_7402',
  korean:'한글 문서 검증',
  final:'마지막 페이지 확인',
});
const WIDTH=64,HEIGHT=64;
const crcTable=Array.from({length:256},(_,n)=>{
  let c=n;
  for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;
  return c>>>0;
});
function crc(bytes){
  let value=0xffffffff;
  for(const byte of bytes)value=crcTable[(value^byte)&255]^(value>>>8);
  return (value^0xffffffff)>>>0;
}
function chunk(name,payload){
  const label=Buffer.from(name,'ascii');
  const length=Buffer.alloc(4);length.writeUInt32BE(payload.length);
  const checksum=Buffer.alloc(4);checksum.writeUInt32BE(crc(Buffer.concat([label,payload])));
  return Buffer.concat([length,label,payload,checksum]);
}
function makeSyntheticPng(){
  const pixels=Buffer.alloc(HEIGHT*(WIDTH*3+1));
  for(let y=0;y<HEIGHT;y++){
    const offset=y*(WIDTH*3+1);
    pixels[offset]=0;
    for(let x=0;x<WIDTH;x++){
      const pos=offset+1+x*3;
      pixels[pos]=x*4;
      pixels[pos+1]=y*4;
      pixels[pos+2]=(x+y)*2;
    }
  }
  const header=Buffer.alloc(13);
  header.writeUInt32BE(WIDTH,0);header.writeUInt32BE(HEIGHT,4);
  header[8]=8;header[9]=2; // RGB8, no alpha
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a','hex'),
    chunk('IHDR',header),
    chunk('IDAT',deflateSync(pixels)),
    chunk('IEND',Buffer.alloc(0)),
  ]);
}
function acceptanceDomSource(){
  // JSON string literals only, no user-provided HTML/content.
  const image='data:image/png;base64,'+makeSyntheticPng().toString('base64');
  const data={...MARKERS,image};
  return '('+function(){
    const data=__PDF_ACCEPTANCE_DATA__;
    const preview=document.querySelector('.paper-surface');
    if(!preview)throw Error('ASTRA STEP2 preview unavailable');
    const paper=document.createElement('article');
    paper.className='document project-paper paper-theme-report paper-font-sans paper-size-medium';
    paper.setAttribute('aria-label','PDF fixture document');
    paper.style.setProperty('--accent','#245a76');
    const heading=document.createElement('div');
    heading.className='document-heading';
    const h1=document.createElement('h1');
    h1.textContent=data.first;
    heading.appendChild(h1);
    const pages=document.createElement('div');
    pages.className='document-sections';
    const page1=document.createElement('section');
    page1.className='document-section';
    const korean=document.createElement('div');
    korean.className='section-body block-prose';
    korean.textContent=data.korean+' — 2026. 테스트 문서 / 숫자 12345.';
    const figure=document.createElement('figure');
    figure.className='document-figure figure-small align-left';
    const image=document.createElement('img');
    image.src=data.image;
    image.width=64;image.height=64;
    image.alt='합성 테스트 이미지';
    figure.appendChild(image);
    page1.append(korean,figure);
    const page2=document.createElement('section');
    page2.className='document-section';
    page2.style.breakBefore='page';
    page2.style.pageBreakBefore='always';
    const title=document.createElement('h2');
    title.textContent=data.second;
    const ending=document.createElement('div');
    ending.className='section-body block-prose';
    ending.textContent=data.final+' / 행정 문서 출력 67890.';
    page2.append(title,ending);
    pages.append(page1,page2);
    paper.append(heading,pages);
    preview.replaceChildren(paper);
    return Promise.all([document.fonts.ready,image.decode()]).then(()=>({
      text:paper.textContent,
      imageLoaded:image.complete&&image.naturalWidth===64,
    }));
  }.toString().replace('__PDF_ACCEPTANCE_DATA__',JSON.stringify(data))+')()';
}
module.exports={MARKERS,WIDTH,HEIGHT,makeSyntheticPng,acceptanceDomSource};
