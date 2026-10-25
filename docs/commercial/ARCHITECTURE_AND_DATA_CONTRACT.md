# ASTRA 상용화 아키텍처 및 데이터 보존 계약

상태: DESIGN ONLY / 구현 전 검증 필요 | 2026-10-25

## 1. 재사용할 것 / 새로 만드는 것
- 유지: React 19 + TypeScript/Vite, STEP1 회고록 폼·localStorage v1, STEP2 `Workspace` / `model.ts` / `idb.ts` / `images.ts` / `projectFile.ts` (IndexedDB v2, 블록 편집, 프로젝트 백업).
- STEP3 후보(아직 Draft): `src/step3/pdf.ts` pdfjs-dist 6.4.299, `structure.ts`, `imageRecovery.ts`, `vectorRisk.ts`, `graphicsRisk.ts`, `ImportPanel.tsx`, `convert.ts`. 원본 페이지·좌표·이미지 PNG 근사 복원과 위험 경고. 실문서 대조 후 재사용/개선.
- Desktop 후보(아직 Draft): `desktop/main.cjs` Electron 44.9, 안전한 `astra://app` 프로토콜, Node bridge 최소화, native save dialog 및 `printToPDF`, `electron-builder.yml` NSIS x64. PR4는 현재 STEP3 미포함.
- 신규 독립 모듈(제안): `src/domain/source/`, `src/domain/fidelity/`, `src/design/`, `src/humanize/`, `src/licensing/`, `src/features/batch/` (최종 경로는 WBS A에서 코드 검증 후 확정).
- 임의로 PDF.js/IPC/storage를 전면 교체하지 않는다. 새 엔진을 만든다면 기존 테스트 통과+독립 성능·품질 증거 필수.

## 2. 핵심 데이터 단면 (개념적, 실제 코드 타입 아님)
```ts
type SourceDocument = {
  sourceId: string;
  originalFilename: string;
  originalSha256: string;       // 바이트 해시, 수정 불가
  originalBytesRef?: string;   // 앱 로컬 영속 사본; 저장 용량 승인과 백업 정책 필요
  importedAt: string;
  pages: SourcePage[];
  extractionWarnings: ExtractionWarning[];
};
type SourceBlock = {
  blockId: string;
  sourceId: string;
  pageNumber: number;
  bbox?: [number, number, number, number];
  kind: "heading"|"paragraph"|"image"|"caption"|"table"|"unknown";
  originalText: string;        // 불변, 이미지/표의 경우 별도 원본 참조
  semanticConfidence?: number; // 참고 지표. 합격 보증값 아님
};
type RewriteProposal = {
  proposalId: string;
  sourceBlockId: string;
  originalTextHash: string;
  suggestionText: string;
  engine: "deterministic-rules"|"local-llm";
  validation: "pass"|"warn"|"blocked";
  decision: "pending"|"accept"|"reject";
  reasons: string[];
};
type RenderSpec = { themeId: string; tokens: Record<string, string>; layoutId: string };
```
- 데이터 **세 층 분리**: `immutable original` / `user-approved content edits` / `render style`. 테마 변경으로 텍스트 변경 불가, 윤문 채택으로 원본 변경 불가.
- STEP1 v1·STEP2 v2 영구 보존; 신규 확장은 마이그레이션 가능한 **추가 테이블·키/새 파일**로 분리한다. 기존 v1/v2 데이터를 무단 스키마 업그레이드·삭제하지 않는다.
- 원본 미보관 옵션은 비교 화면의 재열기 기능을 제한하므로, 고객에게 명시. PDF 원본 영속 저장 시 로컬 암호화 제공 전에는 암호화 저장이라고 광고하지 않는다.
- 가져오기 중 취소/충돌/정전: 확정 전 DB 변이 0, 확정은 IndexedDB atomic, 오류 시 재시작/이전 상태 복구. Undo/Redo와 백업 파일에 버전 태그 포함.
- 원본 PDF 저장 위치·프로젝트 캐시·AI 모델 폴더를 구별하고 '프로젝트 삭제'와 '모델 제거' 선택을 분리한다.

## 3. 데이터 처리 파이프라인
```text
PDF File -> PDF.js parse + source hash
         -> classify blocks / recover supported images / flag vectors, tables, scans
         -> fidelity preflight (MISSING, REVIEW, SUPPORTED)
         -> explicit import confirmation -> separate editable project
         -> optional rewrite proposals (never overwrite source)
         -> chosen theme + layout engine
         -> side-by-side compare + export preflight
         -> Electron printToPDF -> independent output verification -> user .pdf
```
- 원본 PDF는 실제 PDF 페이지 렌더링, 편집 결과는 우리 own renderer. **시각·픽셀 동일한 PDF 변환이 아닌 새 조판**임을 UI에 명시.
- 지원하지 않는 이미지 클리핑/마스크·벡터·복잡한 표/멀티컬럼/수식은 **가까운 글자가 보인다는 이유로 성공 처리 금지**. 감지/경고·재조정/원본 이미지 페이지 보존 선택 또는 import 중단.
- 문서에서 추출한 이미지가 PNG로 디코딩되어도 원본 투명도·마스크·합성이 보존됐다는 의미가 아니다.
- 출력 검사는 추출 블록 대비 문장·날짜·숫자·고유명사·단위·이미지 건수 누락 검사, 중복 검사, 페이지 오버플로/폰트 실출력 시각 검사. 검수 불가 항목은 인간 검수로 안내.

## 4. 로컬 AI 설계: 코드로 수행 가능한 것과 LLM이 필요한 것
참조: `epoko77-ai/im-not-ai` (https://github.com/epoko77-ai/im-not-ai), 2026-10-25 확인, MIT.
- **재사용 후보:** taxonomy 10대 카테고리/85 sub-pattern(저장소 문서 기준), 정규식화 가능한 탐지, Python deterministic shim `prepare_monolith_input.py`, `verify_gates.py`, `verify_change_rate.py`, `strip_injected_commas.py` 및 golden 검사 아이디어. Python 전체 의존성을 바로 고객 EXE에 탑재하기보다는 타입 안전한 JS/TS 포트 + 고정 fixture golden parity test부터 시도.
- **중대한 구별:** upstream 전체 'humanize'는 Claude/Codex/Gemini 등에서 LLM 1~3+콜을 수행하는 오케스트레이터. **규칙만으로 upstream의 자연스러운 전체 윤문과 동등한 기능이 되지 않는다.**
- 모델: 상용 배포 가능 가중치·토크나이저·런타임 라이선스 확인 후 1.5B~4B급 4-bit 오픈 가중치 후보를 한국어 벤치마크. 특정 Qwen 버전·RAM 8GB는 검증 전 약속/고정 금지.
- 실행: 오프라인 CPU 추론 우선, GPU 가능하면 선택적 가속. llama.cpp류 런타임 후보 + GGUF/동등 포맷, **선택적 모델 패키지**로 앱 본체 무거워지지 않게. 모델 패키지는 버전·크기·SHA256·서명·제3자 라이선스·지원 OS/CPU 명시.
- 'AI 윤문'은 3개 가격 모두 활성 가능. 모델 패키지 미설치/PC 부적합 시 **규칙 검사만 가능**하다는 현실을 설치 전 고지. 초기 설치에 필요한 모델 다운로드 또는 배포 매체 제공을 무시하고 '완전 무설치 오프라인'으로 광고하지 않는다.
- 원문 바깥 네트워크 요청은 불허; 모델 파일 내려받기가 필요하면 명시적 사용자 동의/해시 검증된 허용 목적지만 별도 허용 또는 웹사이트에서 별도 파일 안내. PDF나 윤문 텍스트, 텔레메트리 전송은 기본 OFF.
- 프로세스 경계: Electron sandbox renderer -> 최소 IPC request/cancel/progress -> local inference child process (권한·CPU/RAM 제한, 타임아웃, kill, 에러 로그에 고객 원문 금지). renderer에서 임의 shell/python 실행 금지.

## 5. 로컬 윤문 검증 게이트
1. 숫자·통화·날짜·주소·사람/기관/제품 이름·법률 조문/직접 인용 등 보존. 변경 시 BLOCK.
2. 원문의 부정·의무·가정·추측(모달리티) 유지; 의미 비교를 정규식만으로 완전 증명할 수 없으므로 WARN/사람 승인.
3. 단일 문장/선택 블록만 대상으로. 문장 정렬·프로포절 해시; 미승인 자동 적용 0.
4. diff 변화율 30% 경고/50% 이상 제안 거절(참조 upstream 게이트; 실제 적절한 임계는 테스트로 조정).
5. 새 AI 문구 자체가 또 번역투·환각·새 수치를 추가한 경우 roll back; 모델 timeout 또는 RAM 부족 시 원문 유지.
6. 모든 편집은 되돌리기 및 원본 다시 보기 가능.

## 6. 보안 / 패키징
- PR4의 `nodeIntegration:false`, `contextIsolation:true`, `sandbox:true`, `astra://app`, 외부 네트워크 차단·최소 preload bridge 유지.
- Electron renderer는 untrusted PDF metadata/text도 출력 시 HTML injection 금지, 이미지 디코드 제한/메모리 경계, ZIP/project import path traversal 제한, 보안 업데이트/취약 라이브러리 패치.
- NSIS 서명·SmartScreen, 배포 해시, 모델 설치/삭제·라이선스 조건·오프라인 업데이트 안내. Windows Defender 오탐 / 서명 경고는 정상 판매 전 고객 검사.
- 장치/사용권 확인을 구현하더라도 고객 원문을 인증서버로 보내지 않는다. 오프라인 라이선스는 위변조 방지와 복제 방지의 한계를 고지한다.
