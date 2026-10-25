# ASTRA PDF Redesigner — 새 채팅 자동 복원 / 작업 시작점

> **CURRENT M02 state — 2026-10-25 23:13 KST:** On `integration/astra-commercial-core` tested implementation `383d2a63e1b91a32389ce75eeb7c9ceb4622d3ba`, [Linux Chrome/Edge #40200891875](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200891875) + [Windows NSIS #40200891742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200891742) **both SUCCESS**. M02 actual 3-pane studio and **two distinct actual A4 PDFs**, screenshot artifact with Korean Noto CJK, achieved. **M02 remains IN_PROGRESS** because the source-PDF Blob URL is revoked on successful import: the next `ㄱ` or one-line restart MUST first implement *in-session original PDF vs new A4 comparison after commit*, with document-ID guard and cleanup; do NOT persist original bytes into IDB without approval. Then verify/close M02 → M03 local opt-in AI. The older M01 READY instructions below are historical, not current. `main`/PR3/PR4 remain untouched; no sale approval.


> **최신 확정 M01 완료 / M02 READY — 2026-10-25 22:55 KST:** 통합 브랜치 코드 `4b5be85a8e7e0fb26d4be3bca58f423477e49c48`의 [Linux Chrome/Edge #40199604164](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604164) 및 [Windows NSIS #40199604265](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604265) **최종 SUCCESS**. Windows 설치 앱에서 합성 2p PDF→PDF.js 원본 대조·승인→IDB 신규 문서→테마 변경→재로드→Electron native 저장→A4 1p 출력·원문 표식 6개·이미지 1회 검증. **현재 다음 작업은 M02 실제 3영역 스튜디오·조판이 실제로 다른 2가지 디자인 및 목업 실물 비교**. 문서 하단의 오래된 M01 'READY'와 in_progress 기록은 과거 이력이다. 실제 고객문서/로컬AI/상용화는 여전히 미검증이다.


**트리거 (이 한 줄 그대로):** `[astra_pdf_redesigner 깃헙 레포지토리 보고 작업이어가셈]`

> 이 저장소의 **기본 브랜치 main은 기존 STEP1·2 원본 보호용**이다. 새 작업은 반드시 최신 원격 `integration/astra-commercial-core`로 이어간다. **새 채팅에서 사용자에게 인수인계 프롬프트·승인·추가 설명을 요구하지 말고, GitHub 최신 문서를 읽고 첫 READY 작업을 바로 실행**한다. 별도 자동 백그라운드 작업이 켜져 있다는 뜻은 아니다.

## 0. 역할과 복원 범위
- 너는 **Astra PDF Redesigner 크몽 상용화 총괄 겸 개발 담당**이다. 제품/코드/테스트/상품화 일정 판단, 실제 개발, 검수, 원격 GitHub 인수인계를 수행한다.
- 저장소 **`hibi89/astra_pdf_redesigner`**, 새 저장소 생성 금지. 2026-10-25 KST 최신 제품 결정: **2026-10-28 KST까지 3일 내부 MVP 목표(보장 아님)** → 진짜 작동 앱을 목업과 대조하고 보강 → 심화 보안·실PC 상용 검수 → 크몽 상품화.
- **가격 3만원 BASIC / 6만원 PRO / 9만원 BUSINESS**, **세 상품 모두 동일한 오프라인 로컬 AI 윤문**. 윤문 기본 OFF, 원문/제안 Diff·승인/되돌림 필수. `epoko77-ai/im-not-ai`의 MIT 규칙과 로컬 경량 LLM 후보를 구별한다. **아직 AI가 실제 작동한다는 검증 없음**. 외부 유료 API 사용 금지 목표.
- 핵심 가치: PDF 업로드 → 텍스트/이미지/표 지원성 경고 → **원문 불변/누락 대조** → 2종 이상 실제 다른 디자인으로 재조판 → 새로운 A4 PDF 출력 → 로컬 선택 윤문 후 수동 승인. 원본 페이지/픽셀 동일성·모든 PDF 지원은 보증하지 않는다.
- 3일 MVP는 **내부 시연 가능한 최소 기능**이다. 8/20/30개 디자인, SKU·라이선스/배치/브랜드 및 정식 상용 출시는 MVP 후속. 고객 원문 데이터·기존 STEP1 localStorage v1/STEP2 IndexedDB v2와 원본 로드맵 2PNG 보존, 고객 문서 GitHub/CI 반출 금지.

## 1. **새 세션에서 실제 읽을 순서** — main의 구 STEP1 상태로 오인하지 말 것
1. 우선 GitHub 최신 `main`, `lead/astra-commercial-20261025`, `integration/astra-commercial-core`, PR #3/#4/#8/#9 상태·HEAD/CI 조회. 작업 기준은 **최신** 값.
2. `lead/astra-commercial-20261025:COMMERCE_START_HERE.md`
3. `lead/astra-commercial-20261025:docs/commercial/EXECUTION_PLAN.md` — **현재 M01~M05 72시간**; 과거 177~370h WBS는 `EXPANDED_BACKLOG_20261025.md`에 보관.
4. `integration/astra-commercial-core:docs/commercial/STATUS.md` 및 `docs/commercial/HANDOFF.md` — **실제 코드 수행/테스트와 다음 READY의 1차 진실**.
5. `lead/astra-commercial-20261025:docs/commercial/MOCKUP_PARITY.md` — 이미지 컨셉과 **실제 캡처** 비교해 고치기. 실물 없이 '목업 구현 완료' 금지.
6. 해당 작업과 관련된 `docs/commercial/INTEGRATION_A01_AUDIT.md`, `M01_CODE_INTEGRATION_20261025.md`, `PRODUCT_SPEC_V1.md`, `ARCHITECTURE_AND_DATA_CONTRACT.md`, `QA_RELEASE_GATES.md`, `BRANCH_AND_DISPATCH.md`, `PRICING_LICENSING_SUPPORT.md`.
7. 변경 대상 소스·테스트 코드와 마지막 CI 결과 **직접 검사**, 이전 채팅에서 말했다는 이유로 PASS 처리 금지.

## 2. 2026-10-25 작업 중단 지점 (부정확해질 수 있는 스냅샷, 재조회 필수)
- `main` 안정 HEAD `2d1b29595f78653d5d53464e7dad747d61c35fc2` (이 START 문서 같은 **문서-only** 변경은 예외).
- PDF import 기존 Draft PR #3 `feature/step3-pdf-import-20261019` SHA `faec84e388da0f7a6d71f71c1b8d14e18d9f3098` → **원본 보호**.
- Windows Electron Draft PR #4 `feature/windows-electron-package-20261019` SHA `057ccef81b97dd741c46002c28292bfdf544362f` → **원본 보호**.
- 상품화 기획 Draft PR #8 `lead/astra-commercial-20261025`.
- **첫 실제 코드 통합 Draft PR #9** `integration/astra-commercial-core` 코드 SHA **`978fe4fc469935e7d04c42151de931fb45c66107`**; 이 뒤 문서 커밋들이 있을 수 있으므로 최신 SHA 재조회.
- #9는 기존 PR3 PDF.js importer/STEP2 원본 비교 코드 + PR4 Electron native PDF save/NSIS를 **독립 브랜치 코드 수준으로 접합**한 것. `Workspace`에 `savePdfFromEditor` / 브라우저 print fallback, 양쪽 package/CI 이식.
- 테스트: [Linux Chrome/Edge #40198529770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40198529770), [Windows #40198529742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40198529742). **최초 확인 당시 두 workflow는 in_progress; Edge 개별 job은 success였으나 전체 워크플로의 PASS 판정은 보류**. 새 채팅에서 반드시 workflow HEAD=해당 코드 SHA, job 결론/로그 재확인.
- 코드 통합 후 **Windows 설치판에서 기존 PDF 업로드→새 문서→native save PDF 통합 E2E는 아직 검증되지 않았다**. 이는 다음 핵심 미완료다. 데스크톱 이전 STEP2-only 테스트로 이 항목을 합격 처리하지 않는다.

## 3. 정확히 수행할 다음 작업 — **M01 (IN_PROGRESS)**
1. 최신 PR9의 통합 소스·`package.json`, `src/step2/Workspace.tsx`, `src/step3/*`, `desktop/*`, `tests/*`, GitHub Actions 결과 확인.
2. M01 Linux 테스트/빌드/Chrome·Edge 및 Windows Actions **실제 최종 성공·실패를 검토**. 실패면 그 원인만 수정 후 독립 브랜치 커밋·재테스트. CI 결과가 정상이어도 **STEP3 Windows end-to-end는 별도 추가**.
3. 수정을 최소화해 '선택 가능한 국문 텍스트 PDF 1~5p → PDF.js 가져오기/대조 → 선택한 테마→ Electron Windows native PDF 저장→재오픈 텍스트 확인' 검증. 에러와 미지원 파일 경고. 브라우저 판도 동일 경로 확인.
4. 실제 테스트 PASS일 때만 M01 DONE 기록. 이후 M02 (목업 대비 정돈된 3영역 UI·디자인 2종 실제 PDF) → M03 (선택 윤문·작은 로컬 LLM 시연) → M04 (Windows 설치 실사용) → M05 (갭/회귀/범위 기록). 의존성에 맞춰 선행 가능.
5. **완료때마다** 작업 ID/기준 SHA/수정파일/실제 테스트 명령·PASS·FAIL·NOT RUN/새 커밋 SHA/남은 blocker/다음 READY 하나를 **integration 코드 브랜치 `docs/commercial/{STATUS,HANDOFF}.md`에 업데이트**. 총괄 `lead`에도 최신 READY/상태를 동기화. PR #9 설명 업데이트는 필요 시.
6. **커밋 후 원격 HEAD 재조회**. 다음 채팅도 같은 이 START 파일만 읽고 복원 가능하도록 유지.

## 4. 작업 수칙 / 사용자 핸드오프 경험
- 이 문장만 입력되면 **질문·허락 재요청·채팅방 인수인계 설명 없이 작업**. 사용자에게 필요한 승인/외부 입력이 생기면 BLOCKED로 기록하고 다음 준비 작업으로 이동.
- 사용자가 `ㄱ`이라고 하면 마지막 READY 작업 하나를 실행. 무의미한 상태 설명만 출력하지 말고 실제 변경·테스트·커밋이 있으면 그 증거를 보고.
- main 안정본/PR3/PR4 원본과 사용자 데이터는 비파괴. 심화 QA는 MVP 뒤지만 **무단 유출·원본 덮어쓰기·핵심 PDF smoke·윤문 승인 검증은 절대 생략하지 말 것**.
- 멋진 컨셉 이미지를 실물로 속이지 않는다. 판매 가능성/안전성/CPU 로컬 모델 품질/8GB 호환/크몽 상품 완성은 실측 전 **NOT VERIFIED**.
- 이 문서는 '작업 자동 재개 준비'이지 어떤 모델이 이미 백그라운드에서 작업 중이거나 3일 완성이 보장된다는 뜻이 아니다.

## 문서 빠른 진입
- [총괄 시작점](https://github.com/hibi89/astra_pdf_redesigner/blob/lead/astra-commercial-20261025/COMMERCE_START_HERE.md)
- [현재 72시간 작업표](https://github.com/hibi89/astra_pdf_redesigner/blob/lead/astra-commercial-20261025/docs/commercial/EXECUTION_PLAN.md)
- [실제 통합 PR #9](https://github.com/hibi89/astra_pdf_redesigner/pull/9)
- [통합 브랜치 핸드오프](https://github.com/hibi89/astra_pdf_redesigner/blob/integration/astra-commercial-core/docs/commercial/HANDOFF.md)
