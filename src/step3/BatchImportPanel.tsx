import {useState} from 'react';
import type {PdfDraft} from './structure.ts';
import PdfImportPanel,{type ImportedPdfSource} from './ImportPanel.tsx';
import {validateProPdfBatch} from './batchQueue.ts';
import {runSkuGatedAction} from '../commercial/skuActionGate.ts';

interface Props {
  disabled:boolean;
  licenseReceipt:string;
  onImport:(draft:PdfDraft)=>Promise<string|false>;
  onSourceCommitted:(source:ImportedPdfSource)=>void;
}
/** PRO: each source is parsed in the existing review panel; never skip manual approval. */
export default function BatchImportPanel({disabled,licenseReceipt,onImport,onSourceCommitted}:Props){
  const [files,setFiles]=useState<File[]>([]);
  const [index,setIndex]=useState(0);
  const [waiting,setWaiting]=useState(false);
  const [generation,setGeneration]=useState(0);
  const [error,setError]=useState('');
  const active=files.length>0?files[index]:undefined;
  const complete=files.length>0&&waiting&&index===files.length-1;
  const selected=files.length>0;
  const begin=(selection:FileList|null)=>{
    if(disabled)return;
    try{
      const entries=Array.from(selection??[]);
      validateProPdfBatch(entries);
      void runSkuGatedAction([entries.length>1?'batch-pdf':'base-layout'],licenseReceipt,()=>{
        if(selected&&!window.confirm('기존 순차 검수 대기 목록을 새 목록으로 바꾸시겠습니까? 저장하지 않은 PDF 검수 내용은 사라집니다.'))return;
        setFiles(entries);setIndex(0);setWaiting(false);setError('');setGeneration(v=>v+1);
      }).catch(e=>setError(e instanceof Error?e.message:'사용권 확인 실패'));
    }catch(e){setError(e instanceof Error?e.message:'PDF 대기 목록을 생성할 수 없습니다.');}
  };
  const clear=()=>{
    if(!selected)return;
    if(!waiting&&!window.confirm('현재 저장하지 않은 PDF 검수와 대기 목록을 비우시겠습니까? 저장된 문서는 보존됩니다.'))return;
    setFiles([]);setIndex(0);setWaiting(false);setError('');setGeneration(v=>v+1);
  };
  const committed=(src:ImportedPdfSource)=>{
    onSourceCommitted(src);
    if(selected)setWaiting(true);
  };
  return <>
    <section className="panel no-print pro-batch-panel" aria-label="PRO 여러 PDF 순차 검수" data-pro-batch-panel>
      <div className="panel-heading"><h2>PRO · 여러 PDF 순차 검수</h2></div>
      <p className="help-text">한 번에 PDF 2~10개(총 100MiB 이하)를 현재 기기 메모리에만 선택할 수 있습니다. 파일마다 기존 원본 대조 → 수동 동의 → 새 문서 저장을 반복합니다. 자동 일괄 저장, 외부 PDF 전송, 저장 스키마 변경은 없습니다.</p>
      <label className="field">PDF 여러 개 선택
        <input type="file" multiple accept=".pdf,application/pdf" data-pro-batch-input
          disabled={disabled} onChange={event=>{begin(event.target.files);event.target.value='';}}/>
      </label>
      {error&&<p role="alert" className="warning" data-pro-batch-error>{error}</p>}
      {selected&&<>
        <p role="status" data-pro-batch-status data-pro-batch-index={index} data-pro-batch-count={files.length}>
          {complete?`완료: PDF ${files.length}개 모두 별도 검수·저장했습니다.`:
           waiting?`PDF ${index+1}/${files.length} 저장 완료. 다음 파일을 직접 열어 검수하세요.`:
           `PDF ${index+1}/${files.length} 검수 중 · 이미 저장 ${index}건`}
        </p>
        <p className="help-text" data-pro-batch-current>현재 파일: {files[index]?.name}</p>
        {waiting&&!complete&&<button type="button" className="secondary-button" data-pro-batch-next disabled={disabled}
          onClick={()=>{void runSkuGatedAction(['batch-pdf'],licenseReceipt,()=>{setIndex(v=>v+1);setWaiting(false);})
            .catch(e=>setError(e instanceof Error?e.message:'사용권 확인 실패'));}}>다음 PDF 원본 대조 시작</button>}
        <button type="button" className="text-button" data-pro-batch-clear onClick={clear}>목록 비우기 (저장한 문서 보존)</button>
      </>}
    </section>
    <PdfImportPanel key={selected?`pro-batch-${generation}-${index}`:`single-${generation}`}
      disabled={disabled} initialFile={active}
      onImport={draft=>runSkuGatedAction([selected?'batch-pdf':'base-layout'],licenseReceipt,()=>onImport(draft))}
      onSourceCommitted={committed}/>
  </>;
}
