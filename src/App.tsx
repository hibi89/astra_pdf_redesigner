import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  defaultDesign, defaultDocument, exampleDocument, isBlankDocument, PALETTE, SECTION_FIELDS, THEMES,
  type DesignSettings, type PersistedState, type Retrospective,
} from './types';
import { clearState, initialState, saveState } from './storage';
import {hasDesktopPdfExport,savePdfFromEditor} from './desktopPdf.ts';

interface FormProps { value: Retrospective; onChange: (patch: Partial<Retrospective>) => void }
function InputForm({ value, onChange }: FormProps) {
  return (
    <section className="panel form-panel" aria-labelledby="editor-title">
      <div className="panel-heading"><h2 id="editor-title">회고록 작성</h2><span className="panel-caption">내용은 입력한 그대로 유지됩니다</span></div>
      <div className="form-grid">
        <label className="field field-wide">회고록 제목
          <input name="title" value={value.title} onChange={(event) => onChange({ title: event.target.value })} placeholder="회고록 제목" />
        </label>
        <label className="field">작성자 <span className="optional">선택</span>
          <input name="author" value={value.author} onChange={(event) => onChange({ author: event.target.value })} placeholder="미입력 시 생략" />
        </label>
        <label className="field">작성일
          <input name="date" type="date" value={value.date} onChange={(event) => onChange({ date: event.target.value })} />
        </label>
        {SECTION_FIELDS.map(([key, label]) => (
          <label className="field field-wide" key={key}>{label}
            <textarea name={key} rows={4} value={value[key]} onChange={(event) => onChange({ [key]: event.target.value })} placeholder={`${label}을(를) 입력하세요.`} />
          </label>
        ))}
      </div>
    </section>
  );
}

interface SettingsProps { value: DesignSettings; onChange: (patch: Partial<DesignSettings>) => void }
function DesignPanel({ value, onChange }: SettingsProps) {
  return (
    <section className="panel settings-panel" aria-labelledby="settings-title">
      <div className="panel-heading"><h2 id="settings-title">디자인 설정</h2><span className="panel-caption">원문을 바꾸지 않습니다</span></div>
      <div className="setting-block"><h3>테마</h3>
        <div className="theme-options">{THEMES.map((item) => (
          <label className={`theme-option ${value.theme === item.id ? 'selected' : ''}`} key={item.id}>
            <input type="radio" name="theme" checked={value.theme === item.id} onChange={() => onChange({ theme: item.id })} />
            <span><strong>{item.label}</strong><small>{item.description}</small></span>
          </label>
        ))}</div>
      </div>
      <div className="setting-block"><h3>포인트 색상</h3>
        <div className="swatches">{PALETTE.map((color) => (
          <label className={`swatch-wrap ${value.accent === color.value ? 'active' : ''}`} key={color.value} title={color.label}>
            <input type="radio" name="accent" aria-label={color.label} checked={value.accent === color.value} onChange={() => onChange({ accent: color.value })} />
            <span className="swatch" style={{ backgroundColor: color.value }} />
          </label>
        ))}</div>
      </div>
      <div className="setting-block"><h3>본문 크기</h3>
        <div className="segmented">{([
          ['small', '작게'], ['medium', '보통'], ['large', '크게'],
        ] as const).map(([id, label]) => (
          <label key={id} className={value.textSize === id ? 'on' : ''}>
            <input type="radio" name="textSize" checked={value.textSize === id} onChange={() => onChange({ textSize: id })} />{label}
          </label>
        ))}</div>
      </div>
      <div className="setting-block"><h3>폰트</h3>
        <div className="segmented">{([['sans', '고딕'], ['serif', '명조']] as const).map(([id, label]) => (
          <label key={id} className={value.font === id ? 'on' : ''}>
            <input type="radio" name="font" checked={value.font === id} onChange={() => onChange({ font: id })} />{label}
          </label>
        ))}</div>
        <p className="help-text">운영체제별 설치된 시스템 글꼴에 따라 모양이 달라질 수 있습니다.</p>
      </div>
    </section>
  );
}

interface DocumentProps { document: Retrospective; design: DesignSettings }
export function DocumentView({ document, design }: DocumentProps) {
  const style = { '--accent': design.accent } as CSSProperties;
  const sections = SECTION_FIELDS.filter(([key]) => document[key].trim().length > 0);
  return (
    <article className={`document paper-theme-${design.theme} paper-font-${design.font} paper-size-${design.textSize}`} style={style} aria-label="회고록 문서 미리보기">
      <div className="document-heading">
        {design.theme === 'diary' && <span className="document-eyebrow">LEARNING JOURNAL · DAILY REVIEW</span>}
        {design.theme === 'report' && <span className="document-eyebrow">LEARNING REPORT</span>}
        <h1>{document.title || ' '}</h1>
        {(document.author.trim() || document.date) && <div className="document-meta">
          {document.date && <time dateTime={document.date}>{document.date}</time>}
          {document.author.trim() && <span className="document-author">{document.author}</span>}
        </div>}
      </div>
      <div className="document-sections">
        {sections.length === 0 && <p className="empty-preview">왼쪽 입력란에 회고록 내용을 작성해 주세요.</p>}
        {sections.map(([key, label], index) => (
          <section className="document-section" key={key}>
            <h2>{design.theme === 'diary' && <span className="section-index">{String(index + 1).padStart(2, '0')}</span>}{label}</h2>
            <div className="section-body">{document[key]}</div>
          </section>
        ))}
      </div>
    </article>
  );
}

export default function App() {
  const [state, setState] = useState<PersistedState>(initialState);
  const [saveWarning, setSaveWarning] = useState(false);
  const [pdfError,setPdfError]=useState('');
  const [resetWarning, setResetWarning] = useState(false);
  const skipNextSave = useRef(false);

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    setSaveWarning(!saveState(state));
  }, [state]);

  const changeDocument = (patch: Partial<Retrospective>) => setState((prev) => ({
    ...prev, document: { ...prev.document, ...patch },
  }));
  const changeDesign = (patch: Partial<DesignSettings>) => setState((prev) => ({
    ...prev, design: { ...prev.design, ...patch },
  }));

  const loadExample = () => {
    if (!isBlankDocument(state.document) && !window.confirm('현재 회고록을 예시로 바꾸시겠습니까? 기존 내용이 덮어써집니다.')) return;
    setResetWarning(false);
    changeDocument(exampleDocument());
  };

  const reset = () => {
    if (!isBlankDocument(state.document) && !window.confirm('입력한 회고록과 디자인 설정을 모두 초기화하시겠습니까?')) return;
    const cleared = clearState();
    skipNextSave.current = cleared;
    setSaveWarning(false);
    setResetWarning(!cleared);
    setState({ schemaVersion: 1, document: defaultDocument(), design: defaultDesign() });
  };

  const printPdf=async()=>{
    setPdfError('');
    try{await savePdfFromEditor();}
    catch(error){setPdfError(error instanceof Error?error.message:'PDF를 저장하지 못했습니다.');}
  };
  return (
    <>
      <header className="app-header no-print"><div className="brand">
        <span className="brand-icon" aria-hidden="true">A</span>
        <div><h1>아스트라 PDF 리디자이너</h1><p>나만의 회고록을 단정한 문서로</p></div>
      </div><div className="print-actions"><button className="print-button" onClick={() => void printPdf()}>{hasDesktopPdfExport()?"PDF 파일 저장":"PDF 저장 / 인쇄"}</button>
        <span>{hasDesktopPdfExport()?'저장할 PDF 파일의 위치를 선택하세요.':'인쇄 창에서 ‘PDF로 저장’을 선택하세요.'}</span>
      </div></header>
      <main className="app-layout">
        <aside className="editor-column no-print">
          {pdfError && <p className="warning" role="alert">{pdfError}</p>}
          {saveWarning && <p className="warning" role="alert">로컬 저장에 실패했습니다. 편집은 가능하지만 새로고침 시 내용이 사라질 수 있습니다.</p>}
          {resetWarning && <p className="warning" role="alert">저장 데이터 삭제에 실패했습니다. 브라우저의 사이트 데이터를 확인해 주세요.</p>}
          <div className="toolbar"><button className="secondary-button" onClick={loadExample}>예시 불러오기</button><button className="text-button" onClick={reset}>초기화</button></div>
          <InputForm value={state.document} onChange={changeDocument} />
          <DesignPanel value={state.design} onChange={changeDesign} />
          <p className="privacy-note">내용은 이 브라우저에 자동 저장되며 서버로 전송되지 않습니다. 브라우저 데이터를 삭제하면 저장 내용도 사라질 수 있습니다.</p>
        </aside>
        <div className="preview-column"><div className="preview-heading no-print"><div><h2>문서 미리보기</h2><p>A4 폭 기준 · 실제 페이지 구분은 인쇄 창에서 확인</p></div><span className="size-tag">A4</span></div>
          <div className="paper-surface"><DocumentView document={state.document} design={state.design} /></div>
          <p className="print-tip no-print">인쇄 창에서 용지 A4, 머리글·바닥글 해제를 확인하세요. 배경 그래픽 설정은 브라우저에서 조정합니다.</p>
        </div>
      </main>
    </>
  );
}
