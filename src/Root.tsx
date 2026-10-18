import { useState } from 'react';
import LegacyApp from './App';
import Workspace from './step2/Workspace';
export default function Root(){
  const [mode,setMode]=useState<'documents'|'retrospective'>('documents');
  return mode==='documents'?<Workspace onLegacy={()=>setMode('retrospective')}/>:<>
    <div className="mode-bar no-print"><button className="secondary-button" onClick={()=>setMode('documents')}>← 개인 문서 제작기로 돌아가기</button><span>STEP 1 회고록 편집 · 기존 localStorage 원본 유지</span></div>
    <LegacyApp/>
  </>;
}
