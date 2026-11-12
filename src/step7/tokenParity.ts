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
