// STEP7 client-only lexical risk signals. Neither source text nor tokens are
// serialized into a report; matches are NOT a fidelity/semantic/OCR certificate.
export interface TokenParity {
 sourceTokens:number;outputTokens:number;
 missingTokens:number;missingNumericTokens:number;addedTokens:number;
}
export function tokenizePdfText(chunks:readonly string[]):string[]{
 const tokens:string[]=[];
 for(const chunk of chunks){
  // Preserve +, hyphen-minus and Unicode minus when directly before a number.
  // Losing a sign must never be mistaken for a faithful financial value.
  const matches=chunk.normalize('NFC').toLocaleLowerCase('und')
    .match(/(?:[+\-\u2212](?=\p{N}))?[\p{L}\p{N}]+(?:[.,:_-][\p{L}\p{N}]+)*/gu)||[];
  // Check before appending: a large spread itself can overflow the JS call stack.
  if(tokens.length+matches.length>300_000)throw Error('PDF 선택 텍스트 검수 제한을 초과했습니다.');
  for(const value of matches)
   tokens.push(value.startsWith('\u2212')?'-'+value.slice(1):value);
 }
 return tokens;
}
export function comparePdfTokenLists(source:readonly string[],output:readonly string[]):TokenParity{
 if(source.length>300_000||output.length>300_000)throw Error('PDF 선택 텍스트 검수 제한을 초과했습니다.');
 const counts=new Map<string,number>();
 for(const value of source)counts.set(value,(counts.get(value)||0)+1);
 let added=0;
 for(const value of output){
  const n=counts.get(value)||0;
  if(n)counts.set(value,n-1);
  else added++;
 }
 let missing=0,numeric=0;
 for(const [value,count] of counts){
  missing+=count;
  if(/\p{N}/u.test(value))numeric+=count;
 }
 return{sourceTokens:source.length,outputTokens:output.length,
  missingTokens:missing,missingNumericTokens:numeric,addedTokens:added};
}

// Positional risks are counts only. No sensitive PDF content is exported.
export function countPdfPerPageTokenDifferences(
 sourcePages:readonly (readonly string[])[],outputPages:readonly (readonly string[])[],
):number|null{
 if(sourcePages.length>50||outputPages.length>50)throw Error('PDF 페이지 검수 제한을 초과했습니다.');
 if(sourcePages.length!==outputPages.length)return null;
 return sourcePages.reduce((count,source,index)=>{
  const diff=comparePdfTokenLists(source,outputPages[index]);
  return count+Number(diff.missingTokens>0||diff.addedTokens>0);
 },0);
}


// Detect reshuffled extracted text only when the page has the same token multiset.
// Reading order is advisory, not an assertion of content or visual fidelity.
export function countPdfPerPageOrderRisks(
 sourcePages:readonly (readonly string[])[],outputPages:readonly (readonly string[])[],
):number|null{
 if(sourcePages.length>50||outputPages.length>50)throw Error('PDF 페이지 검수 제한을 초과했습니다.');
 if(sourcePages.length!==outputPages.length)return null;
 return sourcePages.reduce((count,source,index)=>{
  const output=outputPages[index];
  if(source.length!==output.length)return count;
  if(source.length>300_000)throw Error('PDF 선택 텍스트 검수 제한을 초과했습니다.');
  if(source.every((token,i)=>token===output[i]))return count;
  const diff=comparePdfTokenLists(source,output);
  return count+Number(diff.missingTokens===0&&diff.addedTokens===0);
 },0);
}


// When a redesigned document reflows to a different page count, compare the
// entire selected-text sequence. Equality of token bags alone hides reordering.
// Advisory only: PDF.js extraction order may differ for legitimate reflow.
export function hasPdfDocumentTextOrderRisk(
 source:readonly string[],output:readonly string[],
):boolean{
 if(source.length>300_000||output.length>300_000)
  throw Error('PDF 선택 텍스트 검수 제한을 초과했습니다.');
 if(source.length!==output.length||source.length===0)return false;
 if(source.every((token,i)=>token===output[i]))return false;
 const diff=comparePdfTokenLists(source,output);
 return diff.missingTokens===0&&diff.addedTokens===0;
}


export interface ValueParity {sourceValues:number;outputValues:number;missingValues:number;addedValues:number}
export function comparePdfValueLists(source:readonly string[],output:readonly string[]):ValueParity{
 const limit=1_500_000;if(source.length>limit||output.length>limit)throw Error('PDF 비교 신호 제한을 초과했습니다.');
 const counts=new Map<string,number>();for(const value of source)counts.set(value,(counts.get(value)||0)+1);
 let addedValues=0;for(const value of output){const count=counts.get(value)||0;if(count)counts.set(value,count-1);else addedValues++;}
 let missingValues=0;for(const count of counts.values())missingValues+=count;
 return{sourceValues:source.length,outputValues:output.length,missingValues,addedValues};
}
export function tokenizePdfSymbols(chunks:readonly string[]):string[]{
 const symbols=chunks.join('\n').normalize('NFC').match(/[\p{P}\p{S}]/gu)||[];
 if(symbols.length>1_500_000)throw Error('PDF 기호 검수 제한을 초과했습니다.');
 return symbols;
}
export function tokenizePdfNegationTokens(chunks:readonly string[]):string[]{
 const english=new Set(['not','no','never','without','none','neither','nor','cannot','non']);
 return tokenizePdfText(chunks).filter(token=>{
  if(english.has(token))return true;
  if(token==='안'||/^(?:안되|안된|안하|안함|안됨)/u.test(token))return true;
  return ['않','없','못','아니','불가','금지','미승인','미포함','미수령','미동의','미허가'].some(marker=>token.includes(marker));
 });
}
export function normalizePdfLinkTarget(raw:string):string{
 let value=raw.normalize('NFC').trim().replace(/[),.;!?]+$/u,'');
 if(!value)return'';
 if(/^www\./iu.test(value))value='https://'+value;
 if(/^mailto:/iu.test(value))return'mailto:'+value.slice(7);
 try{const parsed=new URL(value);if(parsed.protocol==='http:'||parsed.protocol==='https:')
  return parsed.protocol.toLowerCase()+'//'+parsed.host.toLowerCase()+parsed.pathname+parsed.search+parsed.hash;
 }catch{/* Named PDF destinations are compared as local opaque values. */}
 return value;
}
export function tokenizePdfLinks(chunks:readonly string[]):string[]{
 const pattern=/(?:https?:\/\/|www\.)[^\s<>"']+|mailto:[^\s<>"']+/giu,links:string[]=[];
 for(const chunk of chunks)for(const match of chunk.normalize('NFC').match(pattern)||[]){
  const normalized=normalizePdfLinkTarget(match);if(normalized)links.push(normalized);
  if(links.length>300_000)throw Error('PDF 링크 검수 제한을 초과했습니다.');
 }
 return links;
}
