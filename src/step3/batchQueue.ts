// Deterministic local file queue validation, before PDF bytes are parsed.
export const PRO_BATCH_MAX_FILES=10;
export const PRO_BATCH_TOTAL_BYTES=100*1024*1024;
export const PRO_BATCH_SINGLE_BYTES=30*1024*1024;
export type ProPdfFileMeta={readonly name:string;readonly size:number;readonly type:string};
export function validateProPdfBatch(files:readonly ProPdfFileMeta[]):void{
  if(!Array.isArray(files)||files.length<2||files.length>PRO_BATCH_MAX_FILES)
    throw new Error('PRO 순차 처리에는 PDF 2~10개가 필요합니다.');
  let total=0;
  const seen=new Set<string>();
  for(const file of files){
    if(!file||typeof file.name!=='string'||file.name.length>255||
      !/\.pdf$/i.test(file.name)||/[\/\\\u0000-\u001f\u007f-\u009f]/u.test(file.name)||
      (file.type!==''&&file.type!=='application/pdf')||
      !Number.isSafeInteger(file.size)||file.size<5||file.size>PRO_BATCH_SINGLE_BYTES)
      throw new Error('각 파일은 30MiB 이하의 정상적인 PDF여야 합니다.');
    const fingerprint=file.name+'|'+file.size;
    if(seen.has(fingerprint))throw new Error('동일 파일명·크기의 중복 항목이 있습니다.');
    seen.add(fingerprint);total+=file.size;
    if(total>PRO_BATCH_TOTAL_BYTES)throw new Error('전체 PDF 합계 100MiB를 초과했습니다.');
  }
}
