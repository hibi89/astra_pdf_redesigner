// STEP7 client-only lexical risk signals. Neither source text nor tokens are
// serialized into a report; matches are NOT a fidelity/semantic/OCR certificate.
export interface TokenParity {
 sourceTokens:number;outputTokens:number;
 missingTokens:number;missingNumericTokens:number;addedTokens:number;
}
export function tokenizePdfText(chunks:readonly string[]):string[]{
 const tokens:string[]=[];
 for(const chunk of chunks){
  const matches=chunk.normalize('NFC').toLocaleLowerCase('und')
    .match(/[\p{L}\p{N}]+(?:[.,:_-][\p{L}\p{N}]+)*/gu)||[];
  tokens.push(...matches);
  if(tokens.length>300_000)throw Error('PDF 선택 텍스트 검수 제한을 초과했습니다.');
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
  if(/[0-9]/u.test(value))numeric+=count;
 }
 return{sourceTokens:source.length,outputTokens:output.length,
  missingTokens:missing,missingNumericTokens:numeric,addedTokens:added};
}
