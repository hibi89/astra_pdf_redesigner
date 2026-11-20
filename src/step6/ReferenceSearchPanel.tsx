import { useState } from 'react';
import { REFERENCE_SEARCH_MAX_LENGTH, referenceSearchUrl } from './referenceDiscovery.ts';

/** Opt-in, manually triggered external navigation. No PDF bytes, titles, or saved data leave Astra. */
export default function ReferenceSearchPanel() {
  const [keywords, setKeywords] = useState('');
  const [consent, setConsent] = useState(false);
  let googleUrl: string | null = null;
  let bingUrl: string | null = null;
  let error = '';
  if (keywords.trim()) {
    try {
      googleUrl = referenceSearchUrl('google', keywords);
      bingUrl = referenceSearchUrl('bing', keywords);
    } catch (reason) {
      error = reason instanceof Error ? reason.message : '검색 키워드가 올바르지 않습니다.';
    }
  }
  const enabled = consent && googleUrl && bingUrl;
  return <section className="panel" aria-label="STEP6 온라인 디자인 참고 검색" data-step6-reference-search>
    <h3>STEP6 · 온라인 디자인 참고 검색</h3>
    <p className="help-text">무료 외부 이미지 검색 페이지를 새 탭으로 엽니다. 사용자가 직접 입력한 키워드 외에는 아무것도 검색 사이트로 보내지 않습니다. 원본 PDF, 문서 내용, 파일명, 저장된 데이터는 전송하지 않습니다.</p>
    <label className="field">직접 입력하는 검색 키워드
      <input type="text" autoComplete="off" maxLength={REFERENCE_SEARCH_MAX_LENGTH} value={keywords} placeholder="예: 보고서 A4 레이아웃 디자인" data-step6-query
        onChange={event => { setKeywords(event.target.value); setConsent(false); }} />
    </label>
    <label className="field"><span><input type="checkbox" checked={consent} data-step6-consent onChange={event => setConsent(event.target.checked)} /> 검색 버튼을 누르면 입력한 키워드가 외부 검색 사이트로 전달되는 데 동의합니다.</span></label>
    {error && <p role="alert" className="warning">{error}</p>}
    <div className="toolbar project-toolbar">
      {enabled ? <>
        <a href={googleUrl!} target="_blank" rel="noopener noreferrer" className="secondary-button" data-step6-google>Google 이미지 검색 열기</a>
        <a href={bingUrl!} target="_blank" rel="noopener noreferrer" className="secondary-button" data-step6-bing>Bing 이미지 검색 열기</a>
      </> : <p role="status" className="help-text">검색어 입력과 외부 검색 동의 후 검색 버튼이 나타납니다.</p>}
    </div>
    <p className="help-text">검색 결과는 자동 수집하거나 저장하지 않습니다. 사용권을 확인한 PNG/JPEG/WebP/PDF를 직접 내려받아 위의 ‘이미지 또는 PDF 선택’으로 불러오면 STEP5의 로컬 디자인 분석을 사용할 수 있습니다. 타인의 저작물을 허락 없이 재배포하지 마세요.</p>
  </section>;
}
