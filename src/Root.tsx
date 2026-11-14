import { useState } from 'react';
import LegacyApp from './App';
import Workspace from './step2/Workspace';
import OfflinePdfReview from './step7/OfflinePdfReview';
import LocalOcrPanel from './step7/LocalOcrPanel';
export default function Root(){
  const [mode,setMode]=useState<'documents'|'retrospective'|'pdf-review'>('documents');
  return mode==='pdf-review'?<>
    <div className="mode-bar no-print"><button className="secondary-button" type="button" onClick={()=>setMode('documents')}>← 문서 편집기로 돌아가기</button><span>STEP7 · PDF 대조는 저장 데이터에 영향을 주지 않습니다</span></div>
    <OfflinePdfReview/>
    <LocalOcrPanel/>
  </>:mode==='documents'?<Workspace onLegacy={()=>setMode('retrospective')} onOwnerReview={()=>setMode('pdf-review')}/>:<>
    <div className="mode-bar no-print"><button className="secondary-button" onClick={()=>setMode('documents')}>← 개인 문서 제작기로 돌아가기</button><span>STEP 1 회고록 편집 · 기존 localStorage 원본 유지</span></div>
    <LegacyApp/>
  </>;
}
