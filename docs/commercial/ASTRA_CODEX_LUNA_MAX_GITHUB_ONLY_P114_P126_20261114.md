# Astra PDF Redesigner — Codex 6 Luna Max GitHub-only 50→70 실행 지휘서

**2026-11-14 KST 최신 사용자 위임.** P114~P126은 **Codex 6 Luna Max**가 실행하고 GPT-6 High는 이번 설계 공시·완료 후 사용자 호출 시 독립 최종 검수를 맡는다. P127~P138의 실행자 지정은 이번 위임에 포함되지 않는다.

**저장소:** `hibi89/astra_pdf_redesigner` · **기존 작업 브랜치:** `feature/astra-p71-pdf-source-parity-20261112` · **기준 기능 SHA:** `26aff40d6de524c2430f8a6b325d906cea67f7e1`.
**기준 점수:** 위임 시 50/100. 현재 P114/P115/P116 VERIFIED, G55 PASS, 잠정 55/100, 다음 P117; 목표 70/100. 공식 사용자/구매자 수용률 `UNASSESSED`, 출시 `RELEASE HOLD`, 크몽 미등록. 이 런북은 실행 절차이며 점수 증거는 각 작업 검증서와 정확 SHA Actions다.

## P116 실행 결과 및 G55 별도 통과 기록

- **P116 VERIFIED:** 기능 SHA `b03583f12c5eb212dd0207fb539593ec7c2b8df3`; 변경 파일 `tests/step4-style-preset-browser.mjs` 한 개. A04 +1, 12→13/15; 총점 54→55/100.
- [Linux #43618379958](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379958) SUCCESS — 269/269 Node, build PASS, Chrome/Edge 각각 30개 실제 A4 PDF·구조 시그니처 30/30·원문 표식/PNG/V2/페이지·겹침 검사 PASS.
- [Windows #43618379926](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379926) SUCCESS — Node 268 PASS/1 OS SKIP/0 FAIL, desktop 73/73, 설치·업그레이드 PASS. [정본 정책 #43618380099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618380099) SUCCESS. 모든 run head SHA `b03583f12c5eb212dd0207fb539593ec7c2b8df3`.
- **G55 별도 PASS:** P114/P115/P116의 원문/읽기 순서 및 실제 30종 A4 회귀 조건 확인. [P116 검증서](../evidence/astra/P116/VERIFICATION.md), [G55 검증서](../evidence/astra/G55/VERIFICATION.md). 공식 수용 UNASSESSED / RELEASE HOLD / 다음 P117.
- 한계: 합성 ASCII PDF 추출과 제품 브라우저·CI 렌더링만 입증한다. 한국어/CJK 텍스트 계층·실구매자 품질·물리 Win10/11은 미검증.
## 1. 최종설계/권한
- 사용자 확정 12영역 A01~A12 100점 가중치, STEP1~7 로드맵, BASIC8/PRO20/BUSINESS30 고정. 배점 변경/임의 70% 선언 금지.
- 실행 경로는 **GitHub 저장소 + GitHub-hosted Actions**로 한정: 코드·이슈·커밋·테스트·증거 및 인수인계는 GitHub. 사용자 PC, 타 CI, 타 연결 앱, Vercel/Production, 유료 GPU/API, 외부 AI inference, 고객 문서의 외부 전송은 불가.
- GitHub Actions가 공인된 무료 공개 OSS 의존성을 내려받아야 한다면 버전·공식 배포처·SHA·재배포권을 검증하고 runner 임시파일로만 사용. **GitHub-only 조건으로 실모델/실 OCR 자산을 확보하지 못하면 관련 작업은 BLOCKED/0점**. 임의 공급처·유료 러너·기존 고객 데이터 우회 금지.
- `main`, Draft PR #10, 원본 요구/설계문서, STEP1 localStorage V1, STEP2 IndexedDB V2, 기존 레이아웃과 원본 PDF/PNG, `PRODUCTION_ISSUER_JWK=null`, seller thumbprint=null, `ASTRA_CUSTOMER_BUILD_ENABLED=false`, `OCR_MANIFEST=null`, 비밀키/권한/판매/크몽 원장 타상품 불변.

## 2. 필수 순서
`HANDOFF.md` → `STATUS.md` → `AGENTS.md` → `REQUIREMENTS.md` → `docs/ASTRA_ORIGINAL_ROADMAP.txt` → `docs/BLUEPRINT.md` → `docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md` → `docs/commercial/ASTRA_P114_P126_50_TO_70_EXECUTION_PLAN_20261114.md` → `docs/commercial/ASTRA_P114_P126_TASK_REGISTER_20261114.json` → **실제 코드·테스트·Actions**.

## 3. 13개 작업별 실행·완료 기준

| 작업 | 영역 | +점수 | 모두 통과 시 누적 | GitHub Actions 실행·증거 핵심 |
|---|---|---:|---:|---|
| P114 | A03 | +2 | 52/100 | GitHub Actions Ubuntu Node22/Chrome/Edge; 합성 PDF ≥12, 표·다단·회전/누락 false-pass 0 |
| P115 | A03 | +2 | 54/100 | Actions 브라우저 A4 PDF 및 SHA 대조; 합성 PDF ≥15, 숫자·날짜·부정문·이미지 무승인 손실 0 |
| P116 | A04 | +1 | 55/100 | Chrome/Edge A4 출력; BASIC 8+PRO 12+BUSINESS 10=30시안 조판 구별·잘림 0 |
| P117 | A04 | +1 | 56/100 | Node·Chrome/Edge·Windows Electron; 2/5/20개 V2 문서 브랜드 재사용·취소·개별 출력·권한 우회 |
| P118 | A05 | +1 | 57/100 | Chrome/Edge; 로컬 PNG/JPEG/PDF ≥8종 선택/적용/취소·Undo·복원, URL 자동 다운로드 금지 |
| P119 | A07 | +1 | 58/100 | Windows Actions; Tesseract 출처·SHA256·Authenticode/PE/DLL·kor/eng·LICENSE/NOTICE. 미확인 시 BLOCKED |
| P120 | A07 | +1 | 59/100 | GitHub Actions 실제 kor+eng Tesseract; 합성 스캔 ≥12종 CER/오인식/부정·금액/표 위험 측정(mock 불인정) |
| P121 | A07 | +1 | 60/100 | Windows Actions Electron IPC 실제 Tesseract subprocess; PNG→text·취소·timeout·임시파일 정리/원본 V2 불변 |
| P122 | A08 | +2 | 62/100 | Node+Electron 부정 테스트 ≥30건; 127.0.0.1 고정·동의·출력 바운드·레이스·숫자·부정문 방어 |
| P123 | A08 | +3 | 65/100 | Ubuntu Actions CPU-only 실제 qwen3:4b-instruct, 공식 SHA/권리/모델 버전 검증, 한국어 문단 ≥30·유효제안 ≥5, CPU/RAM/시간 측정. 모델 가중치 확보 불가시 BLOCKED |
| P124 | A08 | +2 | 67/100 | Windows-hosted Electron/동등 검증된 runner 실제 Qwen 4B 윤문 ≥10회, 3SKU 동일 모델, Diff/Undo/미승인 변경 0(mock 단독 불인정) |
| P125 | A09 | +2 | 69/100 | Node WebCrypto 합성 서명+Windows Electron IPC; 위조·만료·타등급·직접 IPC 차단. 정식 seller JWK/pin=null 보존 |
| P126 | A10 | +1 | 70/100 | Windows NSIS 설치→재시작→다른 코드 버전 업그레이드→V1/V2/PNG 보존/실패복원·Linux 회귀 |

### 작업별 상세 파일·수용 기준 (기존 설계 정확 보존)
#### P114 (A03 +2; 선행: 없음)
- **수정 경로:** src/step3/structure.ts; src/step3/pdf.ts; src/step3/ImportPanel.tsx; tests/step3-*.test.ts.
- **개발:** 현재 재구성 로직을 보존하며 PDF.js 글자별 위치·bbox·벡터 위험 신호를 사용해 읽기 순서/표 의심/좌우열 충돌을 명시적으로 검수 대기 처리. 불확실한 블록은 자동 재정렬·저장하지 않는다.
- **검증:** 직접 생성한 합성 PDF 최소 12종(단일열/2단/표격자/회전/혼합이미지/숫자·부정문/텍스트 뒤섞임 포함). 필수 원문 토큰 누락·열순서 오류를 무경고 정상으로 처리한 0건, 선택형 원문 대비 화면과 위험 경고를 실제 Chrome·Edge에서 확인.
- **차단:** 자료 형식별 판정이 불완전하면 위험·미지원 상태로 남기고 점수 0. 경고 추가만 하고 실제 수동 대조 경로가 끊기면 불합격.
- **GitHub 증거 산출물:** `docs/evidence/astra/P114/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **VERIFIED/+2점; 정확 기능 SHA `9c3c506ecae49b68f207e6022c6b136da515b7e5`**.

#### P115 (A03 +2; 선행: P114)
- **수정 경로:** src/step3/sourceReview.ts; src/step7/OfflinePdfReview.tsx; src/step2/Workspace.tsx; tests/step3-browser.mjs; tests/step7-pdf-review-browser.mjs.
- **개발:** 원본 글자·수치·기호·부정문·링크의 추출/수정/출력 간 차이를 계층별로 구분하고, 수동 복구·승인·되돌림을 원본 위치와 연결. 원본 해시는 불변, 사용자 승인 전 V2 영구 저장 불가.
- **검증:** 난이도 있는 합성 PDF 최소 15건의 실제 소스/출력 A4 대조. 금액·날짜·부정 변경 0건 무승인 출력; 누락·중복 탐지가 실패한 사례는 미지원/수동대조 처리; 취소·오류 후 V1/V2 및 원본 SHA 유지.
- **차단:** 표 셀 정확 재구성이나 이미지 원본 픽셀 보존을 약속하지 말 것. 인간 검수 없는 완전보존 주장은 실격.
- **GitHub 증거 산출물:** `docs/evidence/astra/P115/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **VERIFIED/+2점; 정확 기능 SHA `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`**.

#### P116 (A04 +1; 선행: P115)
- **수정 경로:** src/step4/skuLayoutCandidates.ts; src/step2/Workspace.tsx; tests/step4-*.mjs; tests/step4-*.test.ts.
- **개발:** 기존 기본 8개와 추가 PRO 12개, BUSINESS 10개의 조판 가족·제목·구분선·컬럼·여백을 독립 비교. 기존 기능/브랜드 스타일 변경 없이 클리핑·겹침·페이지 누락 검출과 비교 화면을 고도화.
- **검증:** 실제 Chrome·Edge 렌더링과 생성 PDF를 총 30시안 모두 점검. 서로 다른 레이아웃의 구조적 특징 목록과 PDF 페이지·최종 줄 누락 0, 원문 동일성·PNG 보존 결과를 첨부.
- **차단:** 색상만 바꾼 시안을 새로운 디자인으로 세지 않는다. 실제 구매자 시각 품질 최종 승인은 여전히 A04 마지막 점수에 남긴다.
- **GitHub 증거 산출물:** `docs/evidence/astra/P116/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **VERIFIED/+1점; 기능 SHA `b03583f12c5eb212dd0207fb539593ec7c2b8df3`, Linux #43618379958, Windows #43618379926, 정책 #43618380099.**

#### P117 (A04 +1; 선행: P116)
- **수정 경로:** src/step4/brandBatchPlan.ts; src/step4/BusinessBrandLibrary.tsx; src/step2/Workspace.tsx; src/commercial/skuActionGate.ts; tests/brand-batch-plan.test.ts.
- **개발:** 기존 2~20개 세션 브랜드 계획을 문서별 미리보기·저장·전환·계획 취소까지 연결. 각 문서마다 텍스트 브랜드·로고 미지원 고지를 정확히 표시하고 PDF 저장 직전에 BUSINESS/brand-kit 재확인.
- **검증:** 2/5/20개 합성 V2 문서 전환·개별 PDF 저장, 비대상 문서 오염 0, 계획 취소 후 원래 스타일 복원, 무효/중복 ID 및 라이선스 위조 거부, NSIS 업그레이드 기존 데이터 보존.
- **차단:** 고객용 실제 issuer pin 없이 판매용 사용권 활성화하지 않는다. 일괄 자동 저장/원본 PDF 덮어쓰기·V2 무단 변경 금지.
- **GitHub 증거 산출물:** `docs/evidence/astra/P117/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P118 (A05 +1; 선행: P116)
- **수정 경로:** src/step5/referenceAnalysis.ts; src/step2/Workspace.tsx; tests/step5-reference-browser.mjs; tests/step5-*.test.ts.
- **개발:** 로컬 PNG/JPEG/WebP/PDF의 색상·여백·텍스트 크기 추정과 미리보기/적용/취소·Undo·프리셋 재열기 흐름을 동일 기준으로 검증. 표/폰트·권리는 추정 불가라고 고지.
- **검증:** 스캔/벡터/여백 과다/다중 페이지/한글 최소 8종 합성 레퍼런스, 2개 브라우저에서 예상 범위 및 전후 저장 복원, 프로젝트 바이트와 원본 파일 무변경, 비정상 PDF fail-closed.
- **차단:** 실제 글꼴·저작권 판정이나 임의 URL 스크래핑으로 대체하지 않는다.
- **GitHub 증거 산출물:** `docs/evidence/astra/P118/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P119 (A07 +1; 선행: 없음)
- **수정 경로:** desktop/ocr-supply-chain-preflight.cjs; desktop/ocr-pe-import-audit.cjs; tests/ocr-supply-chain-preflight.test.cjs; tests/ocr-windows-authenticode-evidence.test.ps1.
- **개발:** 별도 다운로드/동봉 없이 공식 공급처 후보의 버전·해시·Authenticode·PE import/delay-load DLL 폐쇄성·tessdata kor/eng·재배포권 증거를 정리한다. 데이터/고객 PDF 없이 증거·검증기만 유지.
- **검증:** Windows 테스트에서 정상·변조·누락·DLL 경로 오염·서명 없음·라이선스 고지 없음 케이스의 거부 동작, SBOM/NOTICE 후보별 근거 파일, 출처 날짜·버전·파일 해시 기록.
- **차단:** 공급처/재배포권이 미확인되면 P119 점수 미인정, OCR_MANIFEST=null·RELEASE HOLD 유지. 임의 바이너리와 개인키 GitHub 반입 금지.
- **GitHub 증거 산출물:** `docs/evidence/astra/P119/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P120 (A07 +1; 선행: P119)
- **수정 경로:** tools/verify-real-korean-ocr.py; src/step7/LocalOcrPanel.tsx; tests/step7-local-ocr-browser.mjs.
- **개발:** 한글·숫자·부정문·표·두 단·회전·저해상·잡음 스캔을 공용/자체 합성 PDF 이미지로 재생성. OCR의 원문 대조 UI와 누락·오인식 경고, PSM 3/6 선택·취소 기능을 검수.
- **검증:** 사전에 고정한 최소 12개 합성 OCR 원본을 실제 Tesseract kor+eng으로 실행하고 페이지별 CER/중요 수치 일치·검출 실패를 CSV/JSON에 기록. 오류를 자동승인/무경고 성공 처리한 0건; 실제 OCR 성공 1건 이상과 오류 실패사례 1건 이상 재현.
- **차단:** 기존 3개 중 2개 정확 일치를 품질 100%로 주장하지 말 것. 실제 공급자 실행 없이 mock 결과만으로 점수 부여 금지.
- **GitHub 증거 산출물:** `docs/evidence/astra/P120/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P121 (A07 +1; 선행: P119, P120)
- **수정 경로:** desktop/local-ocr-controller.cjs; desktop/main.cjs; desktop/preload.cjs; src/step7/LocalOcrPanel.tsx; tests/local-ocr-controller.test.cjs; tests/step7-local-ocr-browser.mjs.
- **개발:** 승인된 테스트 자산을 CI 임시 디렉터리로만 사용해 실제 native OCR subprocess 호출/취소·timeout·temp 삭제·문서 V2 미수정·원본 PNG 대조까지 연결. 릴리스 manifest와 별도 시험 주입 분리.
- **검증:** Windows Electron 격리 프로필에서 PNG→kor+eng OCR 미승인 초안 반환과 실제 취소·시간제한·깨진 입력 거부·임시 파일 삭제를 확인. 외부 네트워크/자동 반영/고객 원본 전송 0, 기존 NSIS PASS.
- **차단:** 자산의 라이선스·서명/해시가 검증되지 않으면 실제 테스트 대신 HOLD, 점수 0. 시험 manifest를 production 상수로 이식 금지.
- **GitHub 증거 산출물:** `docs/evidence/astra/P121/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P122 (A08 +2; 선행: 없음)
- **수정 경로:** desktop/owner-ollama-controller.cjs; desktop/main.cjs; desktop/preload.cjs; desktop/local-model-controller.cjs; src/humanize/LocalModelReview.tsx; tests/owner-ollama-controller.test.cjs.
- **개발:** 고정 127.0.0.1/기존 Qwen3 model ID만 허용, user-selected URL/프록시·redirect·cloud fallback 금지. IPC 인자·주문·모델 출력 상한·오래된 문서/블록 응답·취소/동시 요청·숫자/날짜/부정/이름/표/URL 정합 검증 후 사용자 승인 단계 유지.
- **검증:** 합성/공격 golden 최소 30문단(금액·부정·명시 거부·시간·동시 실행·문서 전환 포함), 동의 없을 때 추론 요청 0, auto-apply 0, 변경된 원문에 오래된 후보 적용 0, 예외 뒤 원문 보존 100%. 코드와 Electron 브리지 회귀 모두 PASS.
- **차단:** 이 작업은 mock·정적 E2E 보강만으로 인정 가능하나 실 모델 구동 P123/P124 점수와 중복 계산 금지. 민감 문장 stdout/CI 로그 출력 금지.
- **GitHub 증거 산출물:** `docs/evidence/astra/P122/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P123 (A08 +3; 선행: P122)
- **수정 경로:** desktop/owner-ollama-controller.cjs; tools/ (신규 실모델 측정 스크립트); tests/ (신규 실제 모델 golden); docs/commercial/ (실측 보고).
- **개발:** 사용자가 소유한 기존 로컬 Qwen3 4B 또는 라이선스·해시가 검증된 별도 무료 CI 환경에서 실제 모델을 실행. 온디바이스 속도/메모리/중단/OOM·한글 품질을 계측. 모델은 저장소/설치파일에 동봉하지 않고, 다운로드가 필요하면 출처·권리·크기·한도를 사전 확인한다.
- **검증:** 실 모델(native/loopback HTTP mock 아님) + 사전 고정 30개 이상 합성 한국어 문단을 평가. 보호 숫자·날짜·금액·금지/부정/인용문이 변경된 후보의 자동/무검토 적용 0, 건별 성공/거부/취소/지연 및 CPU/RAM 실측, 원본·V1/V2 무변경. 최소 5건의 유효 실모델 제안이 검토 UI까지 전달되는 증거.
- **차단:** 실 4B 추론 환경이 없거나 라이선스·모델 SHA가 불명확하면 P123=0점. 테스트용 작은 모델/모의 API의 성공을 4B 제품 실제 구동 성공으로 둔갑 금지. 모델/고객 문단 업로드·유료 러너 무단 사용 금지.
- **GitHub 증거 산출물:** `docs/evidence/astra/P123/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P124 (A08 +2; 선행: P123, P117)
- **수정 경로:** src/humanize/LocalModelReview.tsx; src/step2/Workspace.tsx; src/commercial/skuAccess.ts; tests/step2-*.mjs; tests/ (신규 AI gui E2E).
- **개발:** BASIC/PRO/BUSINESS 동일 로컬 AI 경로를 보장하고, 다중 블록 간 선택-수정-거절-Undo 흐름과 스타일 변경·PDF 출력 시 원문 미승인 변형을 방어. UI는 모델이 없으면 규칙 검수만 제공.
- **검증:** 실 모델을 실행한 설치형 Windows Electron 또는 동등한 검증된 CPU 환경에서 3SKU × (정상/모델없음/취소/위조·오류) 시나리오. 최소 10건 실제 제안의 전후 비교·승인/거부/되돌림, 미승인 텍스트 변경 0, PDF 출력 문자 동일성 확인, 모델 미실행/오류 중에도 STEP1/2 정상.
- **차단:** 프론트엔드 mock 브라우저 테스트만 성공하면 미인정. 실제 Qwen3 CPU가 없는 경우 P124 미검증으로 남긴다.
- **GitHub 증거 산출물:** `docs/evidence/astra/P124/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P125 (A09 +2; 선행: P117, P122)
- **수정 경로:** desktop/pdf-export-ipc-guard.cjs; desktop/main.cjs; src/commercial/skuActionGate.ts; src/commercial/skuAccess.ts; tests/pdf-export-ipc-guard.test.cjs; tests/sku-action-gate.test.ts.
- **개발:** 현재 고객용 플래그 false/issuer JWK null 상태 유지. 고객 경계에서 renderer 직접 호출·구독 없이 발급되지 않은 서명·만료·좌석·SKU를 main에서 거부하는 독립 테스트 가능한 정책 모듈 작성. 시험용 ephemeral JWK와 정식 판매자 키를 분리, 실제 고객 enable은 불허.
- **검증:** signed synthetic BASIC/PRO/BUSINESS 권한표, 만료·발급자 mismatch·위조·직접 IPC·프레임 재사용·이중 호출의 side effect 0 차단, 개발용 demo 기능 회귀, 무결한 signed fixture의 명시된 시험 경로만 PASS.
- **차단:** React 버튼 잠금만으로 2점을 인정하지 않는다. 릴리스 키 null, customer build flag=false, 판매자 비밀키 생성·커밋 금지. renderer를 신뢰한 단순 license flag는 불합격.
- **GitHub 증거 산출물:** `docs/evidence/astra/P125/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

#### P126 (A10 +1; 선행: P117, P121, P125)
- **수정 경로:** tests/windows-installer-lifecycle.ps1; tests/windows-installer-version-upgrade.ps1; tests/step2-cold-migration.mjs; .github/workflows/windows-desktop.yml.
- **개발:** 기존 같은 코드의 버전번호만 다른 업그레이드 검사를 넘어, 수정된 앱 코드를 포함한 실제 설치·제거·재설치·손상 저장·용량 부족·복구 흐름을 합성 문서/이미지로 검증. 새 구매자 PC 성능은 추정하지 않는다.
- **검증:** Windows GitHub runner에서 실 EXE 기동·다중 이미지 V2·Step1 V1 복구·업그레이드 후 바이트/해시 일치, 실패 시 원본 보존·새 상태 손실 0, 설치/제거 흔적 및 로그 무민감정보. Linux/Windows/정본 3개 워크플로 정확 SHA SUCCESS.
- **차단:** 물리 Win10/11, SmartScreen/정식 서명/판매용 설치기는 A10 마지막 1점과 출시 게이트로 남긴다. 테스트 러너의 Ready를 고객 PC 통과로 간주 금지.
- **GitHub 증거 산출물:** `docs/evidence/astra/P126/VERIFICATION.md`에 재현 명령/runner OS·실행 유형(mock/real)/합성 fixture 해시·실제 PASS/FAIL/SKIP·정확 기능 SHA·3개 CI workflow 링크·지원/미지원 범위·가점 근거 기재. **현재 PENDING/0점**.

## 4. 실제 Github-only 작업 절차
1. GitHub 연결과 repo/feature HEAD, push 권한, Author·Committer가 연결 GitHub `hibi89` 신원으로 남는지 확인. 최신 파일을 조회한 뒤 변경·충돌 재조정.
2. 각 작업: 기존 함수·테스트 읽기 → 필요한 최소 코드/합성 fixture 수정 → 기존/신규 테스트를 npm 스크립트·workflows에 포함 → 해당 브랜치로 fast-forward 커밋. `main`, 기존 PR, Git 히스토리 강제수정/force push, 빈 커밋 금지.
3. 실행은 GitHub Actions만. `npm test`, `npm run build`, `npm run desktop:test`, `npm run ocr:release-gate`; `.github/workflows/ci.yml`의 Linux Chrome+Edge, `.github/workflows/windows-desktop.yml`의 Electron/NSIS, `final-blueprint-gate.yml`의 정책. 컴파일/Node 단독 성공은 전체 성공 아님.
4. **정확한 코드 SHA**에 대한 각 워크플로의 run URL·conclusion·PASS/FAIL/SKIP/OS·검증 증거를 기록한다. 취소된 이전 SHA의 CI를 새 SHA 증거로 전용 금지. 문서-only 커밋은 `paths-ignore`로 새 CI가 없을 수 있음.
5. 실제 제품 사용자가 제공한 PDF/개인정보·비밀·대용량 가중치/바이너리는 GitHub에 게시하지 않는다. 합성 자료, 검증 스크립트, 재현 결과, 체크섬·링크만 커밋. Actions artifact 유효기간을 영구 보관이라 하지 않는다.
6. 점수: `50 + Σ(VERIFIED 작업의 credit_earned)`; 각 작업 상한/최종설계 영역 최대·증거 필수. PENDING/IN_PROGRESS/BLOCKED=0. 새 코드 SHA 3/3 CI + 실제 기능·출력+필수 실모델/실OCR 수용을 모두 만족해야 VERIFIED.
7. 승인 없는 추가 과금·새 퍼블릭 전환·Actions 권한/Secrets·Production 환경·서명키 변경 금지. runner 사용량 제한/실모델 CPU 자원 부족이면 원인 보고·독립 작업 진행. 반복 실패 2회 무진전 시 Stop & Pivot.
8. 각 VERIFIED 후 `STATUS.md`, `HANDOFF.md`, 100점 점수표, task JSON 및 중앙 `hibi89/hackathon-command-center-2026@kmong-productization`의 Astra 행만 최신 SHA 기반으로 갱신. 다른 상품/등록 기록 변경 금지.

## 5. 중간 게이트
- **G55:** P114~P116, 실제 PDF·표/다단·30종 A4 출력·문서 무변조 검증(누적 +5).
- **G60:** P117~P121, BUSINESS 배치·레퍼런스 + *실 Tesseract Windows 검증*(누적 +5). 서명/재배포 근거 없으면 미인정.
- **G65:** P122~P123, 안전한 동의·윤문 + *실 Qwen3:4b-instruct CPU 추론*(누적 +5). mock/다른 모델 단독 미인정.
- **G70:** P124~P126, 3SKU 실 모델 GUI·직접 IPC·서명 테스트·Windows 실 설치/복구 및 정확 SHA 3 workflows SUCCESS(누적 +5).
- **실모델·OCR가 GitHub Actions 여건상 불가능하면 70점 달성을 주장하지 않고 막힌 과제·점수 차이를 보고. 70 이후 100점에 대한 실행자 지정·판매 승인은 별도.**

## 6. 매 회차 보고·High 최종 독립 감사
- 보고: `P번호 / 시작·최종 HEAD / 정확 코드 SHA / 수정 파일 / 테스트 명령·PASS·FAIL·SKIP / Linux·Windows·정본 CI 3개 URL / 점수 이전→현재 / 공식 UNASSESSED / RELEASE HOLD / 블로커 / 다음 작업`.
- 오류 보고: `시도 / 실패 근거 / 대안(비용·품질·제약) / 사용자 승인 필요사항`. 사용자에게 GitHub 도구로 가능한 PC 수동 작업 요구하지 말 것.
- High가 이후 호출되면 GitHub 원본 코드와 정확 SHA, CI 로그, 합성/실 데이터 구분, 모델/폰트/라이선스 및 데이터 보안·가짜 점수 중복을 **별도로 재검수**한다. Codex 자체 PASS가 곧 High PASS 아님.

**사용자 원본 데이터/고객 수용·물리 Windows/최종 판매·법적승인 미검증, 공식 UNASSESSED 및 RELEASE HOLD 유지.**
