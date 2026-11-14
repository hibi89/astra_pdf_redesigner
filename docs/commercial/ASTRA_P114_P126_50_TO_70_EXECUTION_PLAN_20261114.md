# Astra PDF Redesigner — P114~P126 실행 설계 및 50→70점 검증 공시

> **[2026-11-14 최신 사용자 위임으로 실행자 변경]** 50→70(P114~P126) 구현·테스트·GitHub 커밋 담당은 **Codex 6 Luna Max**. 오직 **GitHub 기존 feature 브랜치 + GitHub-hosted Actions**만 사용한다. 이전 Instant 담당 표기는 이 범위에서 대체한다. 상세 실행 환경·실모델/실OCR blocking·한도 규정은 [Codex Github-only 런북](ASTRA_CODEX_LUNA_MAX_GITHUB_ONLY_P114_P126_20261114.md) 및 [작업 원장](ASTRA_P114_P126_TASK_REGISTER_20261114.json)을 우선한다. **설계 기준 50/100; 현재 P114/P115/P116 VERIFIED, G55 PASS, 잠정 55/100, 다음 P117; 공식 UNASSESSED, RELEASE HOLD. 이 문서 수정은 기능 개발이나 CI 통과가 아니다.** 70점 이후 P127+ 담당자는 이번 위임에서 지정하지 않았다.


> 설계 승인 문맥: 2026-11-14 21:55 KST, 사용자 지시: GPT-6 High가 최종설계 기반 작업을 분해·공시하고, Codex 6 Luna Max가 구현과 GitHub 검증·인수인계를 직접 담당. High는 사용자 요청 시 최종 별도 검수 담당. 이 문서는 **계획 공시**이며 기능 구현·테스트 또는 70점 달성을 의미하지 않는다.

**작업 브랜치:** feature/astra-p71-pdf-source-parity-20261112
**저장소:** hibi89/astra_pdf_redesigner
**설계 기준 코드 SHA:** 26aff40d6de524c2430f8a6b325d906cea67f7e1
**설계 이전 문서 HEAD:** 7ed25d4f04ba10bad18e96c6986bb9a5e97a0b08
**현재 총괄 잠정 검증 점수:** 55/100 (P114/P115/P116 VERIFIED; G55 PASS), **공식 사용자/구매자 최종 수용률:** UNASSESSED, **RELEASE HOLD**, 크몽 미등록.

## 1. 변경 금지·우선순위

1. 사용자 원본 12영역 배점과 7단계 로드맵을 변경하지 않는다. 원본 docs/ASTRA_ORIGINAL_ROADMAP.txt, docs/BLUEPRINT.md, 기존 REQUIREMENTS.md를 수정하지 않는다. 원본 내용·디자인·기능을 보존한다.
2. main 및 Draft PR #10 무단 변경, force push, 새 Vercel 프로젝트/배포, 인증·권한 변경, 유료결제·외부 고객 PDF/문장 전송, 판매자 키 생성·배포, 크몽 등록을 금한다.
3. STEP1 localStorage V1, STEP2 IndexedDB V2, BASIC8/PRO20/BUSINESS30 시안, 원본 PDF·PNG/문서·복원·기존 라이선스 기능이 회귀 시 원인 수리 전 점수 부여 불가.
4. 모든 작업은 코드 확인 → 최소 수정 → 합성 및 실실행 테스트 → GitHub fast-forward 커밋 → **해당 기능 SHA** Linux Node/Chrome/Edge·Windows Electron/NSIS·정본 정책 3개 CI 확인 → 점수표·STATUS/HANDOFF 최신화 순서로 끝낸다.
5. 작업별 +점수는 **검증 후 인정하는 계획된 상한**이지 자동 누적치가 아니다. 막히면 0점 또는 일부 증거만 기록하고 다음 독립 작업을 진행한다. 2회 무진전 실패 후 Stop & Pivot; CI 큐 대기 동안 독립 작업은 가능하나 미검증 점수 인정 금지.
6. 실제 테스트 환경/라이선스가 막힌 작업은 PENDING_BLOCKED로 남기고 무작정 라이선스 완화, 임의 무료모델 대체, 릴리스 차단 해제를 해서는 안 된다.

## 2. 확정 12영역 배점과 70점 목표 (설계 가중치 변경 없음)

| 영역 | 최종설계 최대 | P113 기준 잠정 점수 | 70점 목표 상한 | 증가 | 70 이후 잔여 |
|---|---:|---:|---:|---:|---:|
| A01 | 4 | 3 | 3 | +0 | 1 |
| A02 | 6 | 5 | 5 | +0 | 1 |
| A03 | 14 | 8 | 12 | +4 | 2 |
| A04 | 15 | 12 | 14 | +2 | 1 |
| A05 | 5 | 3 | 4 | +1 | 1 |
| A06 | 5 | 4 | 4 | +0 | 1 |
| A07 | 12 | 5 | 8 | +3 | 4 |
| A08 | 14 | 2 | 9 | +7 | 5 |
| A09 | 11 | 5 | 7 | +2 | 4 |
| A10 | 5 | 3 | 4 | +1 | 1 |
| A11 | 7 | 0 | 0 | +0 | 7 |
| A12 | 2 | 0 | 0 | +0 | 2 |
| **합계** | **100** | **50** | **70** | **+20** | **30** |

**해석:** A11 실제 허가 PDF 5~10개 수동 검수(7점), A12 법적·구매자 최종 승인(2점)은 이번 70점 목표에서 **0점 유지**한다. 고객 품질/상용 판매는 CI로 대체하지 않는다. 이 70점은 총괄 잠정 기술·증거 계획이며 공식 수용률이 아니다.

## 3. 설계안 비교와 선택

| 대상 | 대안 A | 대안 B | 채택·판단 이유 |
|---|---|---|---|
| 로컬 한국어 AI | 기존 사용자 소유 Ollama Qwen3 4B 모델을 opt-in으로 실행·실측, 재배포 없음 | GGUF+llama.cpp 자체 번들 | **A 우선**: 다운로드/설치/권리 검증 부담 적고 API 요금 0. B는 상용 라이선스·공급처·크기·CPU 충분히 검증한 후만 전환. 실제 모델 없는 mock 결과는 실측 점수 0. |
| OCR | 공급자 출처/해시/라이선스 확인 → 격리된 Windows 시험에서 Tesseract 실 OCR 측정 | 시험용 바이너리를 곧바로 고객 NSIS에 동봉 | **A 채택**: 원본 데이터 유출·재배포 위험을 줄인다. OCR_MANIFEST=null 유지. |
| BUSINESS 다중 출력 | 기존 세션 브랜드 계획 + 문서별 미리보기·저장 | V2 스키마 변경·무인 일괄 덮어쓰기 | **A 채택**: 데이터 보존·호환성 유리, 비용 0. |
| PDF 정확성 | 자동 탐지 + 사람 검수/지원 범위 분류 | 모든 표·스캔·도형 완전 복원 주장 | **A 채택**: 콘텐츠 무손실 허위 주장 방지. |

## 4. P114~P126 점수·순서 원장

| 작업 | 영역 | 증분 상한 | 누적 목표(모두 PASS 시) | 선행 작업 | 기본 상태 |
|---|---|---:|---:|---|---|
| P114 다단·표·텍스트 순서 위험 검출 보강 | A03 | +2 | 52/100 | 없음 | VERIFIED |
| P115 원본→추출→새 PDF 콘텐츠 대조·복구 경로 실증 | A03 | +2 | 54/100 | P114 | VERIFIED |
| P116 BASIC 8 / PRO 20 / BUSINESS 30 디자인 차별성·A4 출력 검수 | A04 | +1 | 55/100 | P115 | VERIFIED |
| P117 BUSINESS 다중 문서 브랜드 반복 출력 및 SKU 우회 회귀 | A04 | +1 | 56/100 | P116 | PENDING |
| P118 로컬 레퍼런스 분석→비파괴 적용·재현성 강화 | A05 | +1 | 57/100 | P116 | PENDING |
| P119 Windows Tesseract 공급처·해시·DLL·LICENSE 감사 재현 | A07 | +1 | 58/100 | 없음 | PENDING |
| P120 실 Tesseract 한국어 인식 난도별 측정·오인식 공개 | A07 | +1 | 59/100 | P119 | PENDING |
| P121 Electron OCR IPC 실실행 및 실패 복구 | A07 | +1 | 60/100 | P119, P120 | PENDING |
| P122 Ollama 명시 동의·출처 고정·오래된 응답·의미 변경 방어 | A08 | +2 | 62/100 | 없음 | PENDING |
| P123 실 Qwen3 한국어 CPU 추론 및 데이터 무결성 시험 | A08 | +3 | 65/100 | P122 | PENDING |
| P124 3SKU 공통 윤문 실제 GUI 회귀·문단 승인/되돌림 | A08 | +2 | 67/100 | P123, P117 | PENDING |
| P125 Electron 메인 프로세스 상용 PDF IPC·오프라인 영수증 직접 호출 게이트 | A09 | +2 | 69/100 | P117, P122 | PENDING |
| P126 Windows 설치형 실제 상태 복구·실패주입·업그레이드 회귀 | A10 | +1 | 70/100 | P117, P121, P125 | PENDING |

### 작업별 상세 설계

#### P114 — 다단·표·텍스트 순서 위험 검출 보강 (A03 +2점, 누적 상한 52/100)

- **선행:** 없음. **담당:** Codex 6 Luna Max. 현재 상태: VERIFIED, +2점 (기능 SHA `9c3c506ecae49b68f207e6022c6b136da515b7e5`).
- **수정 후보 경로:** src/step3/structure.ts; src/step3/pdf.ts; src/step3/ImportPanel.tsx; tests/step3-*.test.ts. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 현재 재구성 로직을 보존하며 PDF.js 글자별 위치·bbox·벡터 위험 신호를 사용해 읽기 순서/표 의심/좌우열 충돌을 명시적으로 검수 대기 처리. 불확실한 블록은 자동 재정렬·저장하지 않는다.
- **수용 테스트/증거:** 직접 생성한 합성 PDF 최소 12종(단일열/2단/표격자/회전/혼합이미지/숫자·부정문/텍스트 뒤섞임 포함). 필수 원문 토큰 누락·열순서 오류를 무경고 정상으로 처리한 0건, 선택형 원문 대비 화면과 위험 경고를 실제 Chrome·Edge에서 확인.
- **STOP/점수 금지:** 자료 형식별 판정이 불완전하면 위험·미지원 상태로 남기고 점수 0. 경고 추가만 하고 실제 수동 대조 경로가 끊기면 불합격.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P115 — 원본→추출→새 PDF 콘텐츠 대조·복구 경로 실증 (A03 +2점, 누적 상한 54/100)

- **선행:** P114 VERIFIED. **담당:** Codex 6 Luna Max. 현재 상태: VERIFIED, +2점 (기능 SHA `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`).
- **수정 후보 경로:** src/step3/sourceReview.ts; src/step7/OfflinePdfReview.tsx; src/step2/Workspace.tsx; tests/step3-browser.mjs; tests/step7-pdf-review-browser.mjs. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 원본 글자·수치·기호·부정문·링크의 추출/수정/출력 간 차이를 계층별로 구분하고, 수동 복구·승인·되돌림을 원본 위치와 연결. 원본 해시는 불변, 사용자 승인 전 V2 영구 저장 불가.
- **수용 테스트/증거:** 난이도 있는 합성 PDF 최소 15건의 실제 소스/출력 A4 대조. 금액·날짜·부정 변경 0건 무승인 출력; 누락·중복 탐지가 실패한 사례는 미지원/수동대조 처리; 취소·오류 후 V1/V2 및 원본 SHA 유지.
- **STOP/점수 금지:** 표 셀 정확 재구성이나 이미지 원본 픽셀 보존을 약속하지 말 것. 인간 검수 없는 완전보존 주장은 실격.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P116 — BASIC 8 / PRO 20 / BUSINESS 30 디자인 차별성·A4 출력 검수 (A04 +1점, 누적 상한 55/100)

- **선행:** P115. **담당:** Codex 6 Luna Max. 현재 상태: VERIFIED, +1점 (기능 SHA `b03583f12c5eb212dd0207fb539593ec7c2b8df3`).
- **실제 변경 경로:** `tests/step4-style-preset-browser.mjs`. 제품 소스는 변경하지 않았다. 기존 30개 후보의 구조와 실제 PDF 출력을 전수 검사하는 회귀를 보강했다.
- **실제 검증:** BASIC 8개와 PRO 12개·BUSINESS 10개를 Chrome·Edge에서 각각 실제 PDF로 생성. 용지/제목/섹션/본문 CSS 조판 값과 PDF 글자 상자 좌표를 결합한 30개 구조 시그니처가 모두 달랐다.
- **수용 결과:** Chrome/Edge 각 30/30 A4 PDF. 긴 synthetic ASCII 본문은 시작·끝/40개 고유 표식과 전체 문자 순서 유지, PNG 임베드, V2 모든 store/바이트 보존; 페이지 경계·브라우저 줄 겹침·PDF 같은 기준선 텍스트 상자 겹침 0. exact SHA Actions는 Linux #43618379958, Windows #43618379926, 정책 #43618380099 모두 SUCCESS.
- **STOP/점수 금지:** 색상만 바꾼 시안을 새로운 디자인으로 세지 않는다. 실제 구매자 시각 품질 최종 승인은 여전히 A04 마지막 점수에 남긴다.
- **종료 산출물:** [P116 검증서](../evidence/astra/P116/VERIFICATION.md), [G55 별도 검증서](../evidence/astra/G55/VERIFICATION.md), 정확 SHA·3 Actions·제한사항·점수 변화를 기록했다. PDF 텍스트의 CJK 매핑과 구매자 시각 승인은 미검증으로 남긴다.

#### P117 — BUSINESS 다중 문서 브랜드 반복 출력 및 SKU 우회 회귀 (A04 +1점, 누적 상한 56/100)

- **선행:** P116. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** src/step4/brandBatchPlan.ts; src/step4/BusinessBrandLibrary.tsx; src/step2/Workspace.tsx; src/commercial/skuActionGate.ts; tests/brand-batch-plan.test.ts. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 기존 2~20개 세션 브랜드 계획을 문서별 미리보기·저장·전환·계획 취소까지 연결. 각 문서마다 텍스트 브랜드·로고 미지원 고지를 정확히 표시하고 PDF 저장 직전에 BUSINESS/brand-kit 재확인.
- **수용 테스트/증거:** 2/5/20개 합성 V2 문서 전환·개별 PDF 저장, 비대상 문서 오염 0, 계획 취소 후 원래 스타일 복원, 무효/중복 ID 및 라이선스 위조 거부, NSIS 업그레이드 기존 데이터 보존.
- **STOP/점수 금지:** 고객용 실제 issuer pin 없이 판매용 사용권 활성화하지 않는다. 일괄 자동 저장/원본 PDF 덮어쓰기·V2 무단 변경 금지.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P118 — 로컬 레퍼런스 분석→비파괴 적용·재현성 강화 (A05 +1점, 누적 상한 57/100)

- **선행:** P116. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** src/step5/referenceAnalysis.ts; src/step2/Workspace.tsx; tests/step5-reference-browser.mjs; tests/step5-*.test.ts. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 로컬 PNG/JPEG/WebP/PDF의 색상·여백·텍스트 크기 추정과 미리보기/적용/취소·Undo·프리셋 재열기 흐름을 동일 기준으로 검증. 표/폰트·권리는 추정 불가라고 고지.
- **수용 테스트/증거:** 스캔/벡터/여백 과다/다중 페이지/한글 최소 8종 합성 레퍼런스, 2개 브라우저에서 예상 범위 및 전후 저장 복원, 프로젝트 바이트와 원본 파일 무변경, 비정상 PDF fail-closed.
- **STOP/점수 금지:** 실제 글꼴·저작권 판정이나 임의 URL 스크래핑으로 대체하지 않는다.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P119 — Windows Tesseract 공급처·해시·DLL·LICENSE 감사 재현 (A07 +1점, 누적 상한 58/100)

- **선행:** 없음. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** desktop/ocr-supply-chain-preflight.cjs; desktop/ocr-pe-import-audit.cjs; tests/ocr-supply-chain-preflight.test.cjs; tests/ocr-windows-authenticode-evidence.test.ps1. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 별도 다운로드/동봉 없이 공식 공급처 후보의 버전·해시·Authenticode·PE import/delay-load DLL 폐쇄성·tessdata kor/eng·재배포권 증거를 정리한다. 데이터/고객 PDF 없이 증거·검증기만 유지.
- **수용 테스트/증거:** Windows 테스트에서 정상·변조·누락·DLL 경로 오염·서명 없음·라이선스 고지 없음 케이스의 거부 동작, SBOM/NOTICE 후보별 근거 파일, 출처 날짜·버전·파일 해시 기록.
- **STOP/점수 금지:** 공급처/재배포권이 미확인되면 P119 점수 미인정, OCR_MANIFEST=null·RELEASE HOLD 유지. 임의 바이너리와 개인키 GitHub 반입 금지.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P120 — 실 Tesseract 한국어 인식 난도별 측정·오인식 공개 (A07 +1점, 누적 상한 59/100)

- **선행:** P119. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** tools/verify-real-korean-ocr.py; src/step7/LocalOcrPanel.tsx; tests/step7-local-ocr-browser.mjs. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 한글·숫자·부정문·표·두 단·회전·저해상·잡음 스캔을 공용/자체 합성 PDF 이미지로 재생성. OCR의 원문 대조 UI와 누락·오인식 경고, PSM 3/6 선택·취소 기능을 검수.
- **수용 테스트/증거:** 사전에 고정한 최소 12개 합성 OCR 원본을 실제 Tesseract kor+eng으로 실행하고 페이지별 CER/중요 수치 일치·검출 실패를 CSV/JSON에 기록. 오류를 자동승인/무경고 성공 처리한 0건; 실제 OCR 성공 1건 이상과 오류 실패사례 1건 이상 재현.
- **STOP/점수 금지:** 기존 3개 중 2개 정확 일치를 품질 100%로 주장하지 말 것. 실제 공급자 실행 없이 mock 결과만으로 점수 부여 금지.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P121 — Electron OCR IPC 실실행 및 실패 복구 (A07 +1점, 누적 상한 60/100)

- **선행:** P119, P120. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** desktop/local-ocr-controller.cjs; desktop/main.cjs; desktop/preload.cjs; src/step7/LocalOcrPanel.tsx; tests/local-ocr-controller.test.cjs; tests/step7-local-ocr-browser.mjs. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 승인된 테스트 자산을 CI 임시 디렉터리로만 사용해 실제 native OCR subprocess 호출/취소·timeout·temp 삭제·문서 V2 미수정·원본 PNG 대조까지 연결. 릴리스 manifest와 별도 시험 주입 분리.
- **수용 테스트/증거:** Windows Electron 격리 프로필에서 PNG→kor+eng OCR 미승인 초안 반환과 실제 취소·시간제한·깨진 입력 거부·임시 파일 삭제를 확인. 외부 네트워크/자동 반영/고객 원본 전송 0, 기존 NSIS PASS.
- **STOP/점수 금지:** 자산의 라이선스·서명/해시가 검증되지 않으면 실제 테스트 대신 HOLD, 점수 0. 시험 manifest를 production 상수로 이식 금지.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P122 — Ollama 명시 동의·출처 고정·오래된 응답·의미 변경 방어 (A08 +2점, 누적 상한 62/100)

- **선행:** 없음. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** desktop/owner-ollama-controller.cjs; desktop/main.cjs; desktop/preload.cjs; desktop/local-model-controller.cjs; src/humanize/LocalModelReview.tsx; tests/owner-ollama-controller.test.cjs. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 고정 127.0.0.1/기존 Qwen3 model ID만 허용, user-selected URL/프록시·redirect·cloud fallback 금지. IPC 인자·주문·모델 출력 상한·오래된 문서/블록 응답·취소/동시 요청·숫자/날짜/부정/이름/표/URL 정합 검증 후 사용자 승인 단계 유지.
- **수용 테스트/증거:** 합성/공격 golden 최소 30문단(금액·부정·명시 거부·시간·동시 실행·문서 전환 포함), 동의 없을 때 추론 요청 0, auto-apply 0, 변경된 원문에 오래된 후보 적용 0, 예외 뒤 원문 보존 100%. 코드와 Electron 브리지 회귀 모두 PASS.
- **STOP/점수 금지:** 이 작업은 mock·정적 E2E 보강만으로 인정 가능하나 실 모델 구동 P123/P124 점수와 중복 계산 금지. 민감 문장 stdout/CI 로그 출력 금지.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P123 — 실 Qwen3 한국어 CPU 추론 및 데이터 무결성 시험 (A08 +3점, 누적 상한 65/100)

- **선행:** P122. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** desktop/owner-ollama-controller.cjs; tools/ (신규 실모델 측정 스크립트); tests/ (신규 실제 모델 golden); docs/commercial/ (실측 보고). 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 사용자가 소유한 기존 로컬 Qwen3 4B 또는 라이선스·해시가 검증된 별도 무료 CI 환경에서 실제 모델을 실행. 온디바이스 속도/메모리/중단/OOM·한글 품질을 계측. 모델은 저장소/설치파일에 동봉하지 않고, 다운로드가 필요하면 출처·권리·크기·한도를 사전 확인한다.
- **수용 테스트/증거:** 실 모델(native/loopback HTTP mock 아님) + 사전 고정 30개 이상 합성 한국어 문단을 평가. 보호 숫자·날짜·금액·금지/부정/인용문이 변경된 후보의 자동/무검토 적용 0, 건별 성공/거부/취소/지연 및 CPU/RAM 실측, 원본·V1/V2 무변경. 최소 5건의 유효 실모델 제안이 검토 UI까지 전달되는 증거.
- **STOP/점수 금지:** 실 4B 추론 환경이 없거나 라이선스·모델 SHA가 불명확하면 P123=0점. 테스트용 작은 모델/모의 API의 성공을 4B 제품 실제 구동 성공으로 둔갑 금지. 모델/고객 문단 업로드·유료 러너 무단 사용 금지.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P124 — 3SKU 공통 윤문 실제 GUI 회귀·문단 승인/되돌림 (A08 +2점, 누적 상한 67/100)

- **선행:** P123, P117. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** src/humanize/LocalModelReview.tsx; src/step2/Workspace.tsx; src/commercial/skuAccess.ts; tests/step2-*.mjs; tests/ (신규 AI gui E2E). 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** BASIC/PRO/BUSINESS 동일 로컬 AI 경로를 보장하고, 다중 블록 간 선택-수정-거절-Undo 흐름과 스타일 변경·PDF 출력 시 원문 미승인 변형을 방어. UI는 모델이 없으면 규칙 검수만 제공.
- **수용 테스트/증거:** 실 모델을 실행한 설치형 Windows Electron 또는 동등한 검증된 CPU 환경에서 3SKU × (정상/모델없음/취소/위조·오류) 시나리오. 최소 10건 실제 제안의 전후 비교·승인/거부/되돌림, 미승인 텍스트 변경 0, PDF 출력 문자 동일성 확인, 모델 미실행/오류 중에도 STEP1/2 정상.
- **STOP/점수 금지:** 프론트엔드 mock 브라우저 테스트만 성공하면 미인정. 실제 Qwen3 CPU가 없는 경우 P124 미검증으로 남긴다.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P125 — Electron 메인 프로세스 상용 PDF IPC·오프라인 영수증 직접 호출 게이트 (A09 +2점, 누적 상한 69/100)

- **선행:** P117, P122. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** desktop/pdf-export-ipc-guard.cjs; desktop/main.cjs; src/commercial/skuActionGate.ts; src/commercial/skuAccess.ts; tests/pdf-export-ipc-guard.test.cjs; tests/sku-action-gate.test.ts. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 현재 고객용 플래그 false/issuer JWK null 상태 유지. 고객 경계에서 renderer 직접 호출·구독 없이 발급되지 않은 서명·만료·좌석·SKU를 main에서 거부하는 독립 테스트 가능한 정책 모듈 작성. 시험용 ephemeral JWK와 정식 판매자 키를 분리, 실제 고객 enable은 불허.
- **수용 테스트/증거:** signed synthetic BASIC/PRO/BUSINESS 권한표, 만료·발급자 mismatch·위조·직접 IPC·프레임 재사용·이중 호출의 side effect 0 차단, 개발용 demo 기능 회귀, 무결한 signed fixture의 명시된 시험 경로만 PASS.
- **STOP/점수 금지:** React 버튼 잠금만으로 2점을 인정하지 않는다. 릴리스 키 null, customer build flag=false, 판매자 비밀키 생성·커밋 금지. renderer를 신뢰한 단순 license flag는 불합격.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

#### P126 — Windows 설치형 실제 상태 복구·실패주입·업그레이드 회귀 (A10 +1점, 누적 상한 70/100)

- **선행:** P117, P121, P125. **담당:** Codex 6 Luna Max. 현재 상태: PENDING.
- **수정 후보 경로:** tests/windows-installer-lifecycle.ps1; tests/windows-installer-version-upgrade.ps1; tests/step2-cold-migration.mjs; .github/workflows/windows-desktop.yml. 정확 파일 경로는 최신 브랜치를 다시 검사해 결정.
- **구현 지시:** 기존 같은 코드의 버전번호만 다른 업그레이드 검사를 넘어, 수정된 앱 코드를 포함한 실제 설치·제거·재설치·손상 저장·용량 부족·복구 흐름을 합성 문서/이미지로 검증. 새 구매자 PC 성능은 추정하지 않는다.
- **수용 테스트/증거:** Windows GitHub runner에서 실 EXE 기동·다중 이미지 V2·Step1 V1 복구·업그레이드 후 바이트/해시 일치, 실패 시 원본 보존·새 상태 손실 0, 설치/제거 흔적 및 로그 무민감정보. Linux/Windows/정본 3개 워크플로 정확 SHA SUCCESS.
- **STOP/점수 금지:** 물리 Win10/11, SmartScreen/정식 서명/판매용 설치기는 A10 마지막 1점과 출시 게이트로 남긴다. 테스트 러너의 Ready를 고객 PC 통과로 간주 금지.
- **종료 산출물:** 원본/출력·테스트 재현 명령과 PASS/FAIL/SKIP, 기능 SHA와 CI URL, 위험·미검증·점수 변화, 변경 요약을 STATUS.md와 HANDOFF.md에 기록. 코드 증거 없는 문서만의 증가 0.

## 5. 55 / 60 / 65 / 70점 단계 게이트

- **G55 — PASS:** P114~P116의 실 PDF 읽기순서/원본대조와 30종 디자인 A4 회귀 완료. [별도 게이트 검증서](../evidence/astra/G55/VERIFICATION.md).
- **G60**: P117~P121 포함 70점 중 60점 목표. OCR은 정식 배포하지 않지만 실제 공급처·Windows/Electron 인식, 오인식 기록과 데이터 무변경을 검증해야 점수 부여.
- **G65**: P122·P123 포함 총 65/100. Qwen3 mock 안전성과 **실제 모델 CPU 추론**이 각각 성립해야 한다. 실제 모델 측정이 막혔으면 65점은 미달.
- **G70**: P124~P126 포함 총 70/100. 3SKU 윤문 E2E, main IPC 직접 호출/SKU 거부, Windows 설치·복원 증거 확인; 마지막 정확 기능 SHA의 Linux/Windows/정본 CI 전체 SUCCESS; 공식 UNASSESSED와 RELEASE HOLD 유지.

## 6. 검증 표준과 점수 업데이트 알고리즘

1. 코드 변경 전에 최신 브랜치 HEAD 확인. 영향 파일과 정본 문서·기존 테스트 읽기. 변경 전 SHA가 복구 기준이며 대용량/고객 파일은 GitHub에 금지.
2. 해당 작업용 합성 golden fixture/회귀를 실제 npm test 스크립트 및 Windows desktop:test에서 필요에 맞게 호출하고, 새 테스트 누락 여부도 테스트한다. Node PASS만으로 Chrome/Edge/Electron 실제 동작 PASS 주장 금지.
3. 공통: npm test, npm run build, npm run desktop:test, npm run ocr:release-gate. 해당 작업에서는 브라우저 smoke(Chrome·Edge 실제 PDF·V2), Windows Electron smoke/NSIS lifecycle/version upgrade를 더한다. 단독 오프라인 모델·OCR 테스트는 사용한 실제 자산 버전·SHA·법적 재배포 여부를 분리 기록.
4. 변경된 정확 기능 SHA에 대해 Linux 2 jobs, Windows 1 job, final blueprint 1 job, 총 3 workflows 전체 SUCCESS가 필요. FAIL/SKIP/미실행은 명시하고 원인을 확인. CI SUCCESS=구매자 수용/실제 출시는 아님.
5. 점수 계산: SCORE_NEW = 기존 인정 50 + 각 작업의 실제 통과·증빙한 부분점수. 영역별 인정 ≤ 사용자 확정 배점, 작업별 인정 ≤ 위 상한. 같은 기능·같은 테스트를 두 작업에서 중복 인정 금지. 증거 파일/SHA/실행 로그가 없으면 점수 0.
6. STATUS.md, HANDOFF.md, docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md를 업데이트. 중앙 kmong-productization 원장은 해당 제품 행만 동기화하되 최신 HEAD 확인·타상품 상태 보존. 등록완료는 실제 등록 증거 전까지 금지.
7. CI 실패 시 코드/환경/라이선스/데이터 문제를 구분. 같은 실패 방법 무의미 반복 ≤ 1, 무진전 2회면 실패 근거·대안 1~3개·선택사항 보고. 도구로 가능한 독립 작업은 진행하되 목표 점수를 가짜로 채우지 않는다.

## 7. Codex GitHub-only 실행 프로토콜 — ㄱ / ㄱㄱ

- 새 대화에 이 계획 링크 또는 저장소/브랜치를 전달하면 HANDOFF.md → STATUS.md → AGENTS.md → REQUIREMENTS.md → 이 문서 → 최신 소스 → CI 순서로 읽는다. 계획은 이미 승인된 작업 순서를 분해한 것이며, 사용자에게 매번 기존 선행 질문을 반복하지 않는다.
- ㄱ 입력 1회마다 미완료 중 가장 앞의 실행 가능한 P작업에서 실구현·검증·커밋까지 시도한다. 한 번에 여러 독립 작업이 검증 가능하면 함께 수행해도 되나 기능 SHA와 점수 근거는 구분.
- 작업 후 반드시 (작업 ID, 시작/종료 HEAD, 실제 변경 경로, 테스트/CI PASS·FAIL·SKIP, 이번 증가, 누적 잠정 점수, 공식 UNASSESSED, RELEASE HOLD, 다음 작업)을 보고한다. 70점/100점은 광고하지 말고 '잠정 증거 기반'을 명시.
- 이 설계 담당(High)은 구현 호출마다 자동 재검수되는 백그라운드 도구가 아니다. Instant 개발 완료 후 사용자가 High에 검수 요청하면 최신 GitHub 원본·SHA·증거를 독립적으로 재검수한다.

## 8. 승인 없이 절대 넘지 말아야 할 경계

- Codex 6 Luna Max는 위 범위의 무료·기존 GitHub 내 개발·합성 테스트·문서/원장 최신화까지 맡는다. 계정/권한, 유료결제, 실 사용자가 보유한 PDF와 고객 자료 외부 전송, 모델/폰트/런타임 법적 재배포, 판매자 비밀키·프로덕션 public pin 활성화, 정식 상용 배포·크몽 등록은 별도 승인 전 금지.
- REAL OCR/AI가 공급자·모델 부재로 막히면 해당 점수는 0. 다른 작업을 진행하고 70점 목표 미달을 솔직히 기록. 실제 PC 또는 고객 PDF의 사용 승인이 필요한 작업은 마지막에 모아 목록으로 넘긴다.
- 어떤 경우에도 ASTRA_CUSTOMER_BUILD_ENABLED=false, PRODUCTION_ISSUER_JWK=null, seller thumbprint=null, OCR_MANIFEST=null을 승인 없이 바꾸지 않는다. Windows unsigned 테스트 바이너리는 판매용 서명 설치기가 아니다.

## 9. 70점 이후 계속 진행

70~100 상세 잔여 30점과 사용자가 개입해야 할 최종 승인 장벽은 docs/commercial/ASTRA_INSTANT_70_TO_100_HANDOFF_20261114.md에 따로 기록한다. 모든 항목의 사용자가 확정한 배점과 원본 설계는 동일하다.

**최종 확인:** 이 계획 문서는 원래 50→70 실행 기준이다. P114/P115/P116 VERIFIED, G55 PASS; P117~P126 PENDING. 현재 검증 기능 SHA `b03583f12c5eb212dd0207fb539593ec7c2b8df3`, 잠정 55/100, 다음 P117. 공식 UNASSESSED, RELEASE HOLD.
