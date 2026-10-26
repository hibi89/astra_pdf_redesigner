> **M09-C UI PIVOT — 2026-10-27 KST:** Actual Edge showed cancel button absent while parsing (`draft=null`, footer guarded by `draft&&`). Fixed by independently rendering cancel during `busy&&parsing` at code SHA `2ba0b4e57f7d521ba9482a6d626411f10961f9b9`. [Chrome+Edge #40376435854](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40376435854) / [Windows #40376435967](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40376435967) **PENDING**, no M09-C success claim. [Report](docs/commercial/M09_C_PARSE_CANCEL_RECOVERY_20261027.md), Draft PR9, sale NO-GO.

> **M09-C ACTIVE — 2026-10-27 KST:** parse-phase cancel now available without canceling DB writes; exact code `c780e007b92028fb380e3b721ed060e9ce3cd1e0`. [Chrome+Edge #40374128104](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40374128104) and [Windows #40374128200](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40374128200) verification **PENDING**. [M09-C report](docs/commercial/M09_C_PARSE_CANCEL_RECOVERY_20261027.md). Main/PR3/PR4 protected; Draft PR9, commercial NO-GO.

> **LATEST VERIFIED M09-B — 2026-10-27 KST:** App/test SHA `1abe28f6b7751ec6d0483d0b55095e006608ff93`. Real [Chrome+Edge #40371859883](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859883) SUCCESS 2/2, both `PASS M09-B CHROME/EDGE STALE UNMOUNT`; Chrome Node 61/61/build PASS. [Windows #40371859794](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859794) SUCCESS installed/8 A4/STEP3 native PDF/STEP2 upgrade (not direct M09-B Windows UI). Previously reproduced orphan URL count 1 on baseline Edge, now 0 with previous V2 retained and valid V1 migration. **M09-A/B scoped DONE**, next release gates real Korean licensed offline LLM and real customer PC/PDF, PRO20/BUSINESS30, signing; **commercial NO-GO**, PR9 Draft, main/PR3/PR4 protected. See `docs/commercial/M09_B_STALE_IMPORT_RACE_20261027.md` and latest commercial STATUS/HANDOFF.

> **M09-B LATEST CORRECTED TEST (2026-10-27 KST):** exact `1abe28f6b7751ec6d0483d0b55095e006608ff93`, [Chrome+Edge #40371859883](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859883) and [Windows #40371859794](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859794) verification **PENDING**. First fix `fd5bbe` passed zero stale URLs, but [#40370194342](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40370194342) failed due test false-assumption on legitimate STEP1→V2 migration. Windows app #40370193990 SUCCESS. Main/PR3/4 preserved, Draft PR9. Sale NO-GO. See `docs/commercial/M09_B_STALE_IMPORT_RACE_20261027.md`.

> **M09-B ACTIVE — 2026-10-27 KST:** Post-unmount PDF parse URL leak reproduced in actual Edge on baseline `179a11b7` ([#40369980500](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40369980500), expected `1 !== 0`), generation guard source `fd5bbe077b84dd6422e20673e9a70efd9b0e076f` committed. [Chrome+Edge #40370194342](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40370194342) and [Windows NSIS #40370193990](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40370193990) **NOT YET VERIFIED**. Read [M09-B report](docs/commercial/M09_B_STALE_IMPORT_RACE_20261027.md) and STATUS/HANDOFF. M09-A DONE, PR9 Draft, main/PR3/PR4 preserved, sale **NO-GO**.

> **LATEST VERIFIED M09-A — 2026-10-27 KST:** Exact tested app SHA `575373799324c79cac6134edc28f72a00303d88e`. [Chrome+Edge #40363162008](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40363162008) SUCCESS 2/2, Node 61/61/build PASS, both actual browser logs prove text/role/**real block reorder** revoke approval, invalid replacement discards stale source and V2 survives reload. [Windows NSIS #40363162195](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40363162195) SUCCESS installed regressions and 8/8 A4 prints (not direct Windows M09-A UI). **M09-A DONE; M09-B async race analysis READY (unimplemented)**. Draft PR9, main/PR3/PR4 protected; true licensed local model/customer acceptance and full SKUs unverified, commercial **NO-GO**. See [M09-A report](docs/commercial/M09_A_IMPORT_CONSENT_GUARD_20261027.md) and [commercial HANDOFF](docs/commercial/HANDOFF.md).

# ASTRA PDF Redesigner — 크몽 상품화 총괄 시작점 (2026-10-25)

> **LATEST M07-A VERIFIED · 2026-10-26 KST:** Tested app `da1fb6a25a660172a477ff3d376f85e0d7b16b98`; Linux [Chrome+Edge #40211494842](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40211494842) SUCCESS, **61/61 unit PASS**, 6 distinct A4 outputs (report/minimal/diary/compact/editorial/ledger) with three source markers, PNG and pairwise independent print coordinates. Windows [NSIS #40211494855](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40211494855) SUCCESS installed output/upgrade (not per-theme Windows). **BASIC design proof 6/8, NEXT ONE READY M07-B** final two distinctive print layouts. **Real offline Korean LLM absent / model acquisition approval required; 3-SKU sale NO-GO.** Read `docs/commercial/M07_A_BASIC_LAYOUTS_20261026.md`. Old M06-B NEXT text below is historical, PR9 Draft, main/PR3/PR4 protected.


> **LATEST M06-B VERIFIED (2026-10-26 KST):** Real app code SHA `b20484c3c7302af2ce214878422031ce041e6e44`: [Linux Chrome+Edge #40209887602](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40209887602) SUCCESS 2/2, 60/60 unit and real CDP key focus/file drop/900+1100+1600px PDF regressions; [Windows NSIS #40209887559](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40209887559) SUCCESS install/output/upgrade (Windows native M06-B click/drop NOT directly tested). **M01–M06-B internal synthetic core DONE; NEXT ONE READY M07-A: design and prove additional BASIC distinct print layouts toward 8, each real A4 and original marker parity.** Real offline LLM `RELEASE_MANIFEST=null` not downloaded/tested, buyer PDF/PC and SKU30/60/90k still **COMMERCIAL NO-GO**; M03-B1 model acquisition needs explicit user approval. Latest `docs/commercial/M06_B_STUDIO_UX_20261026.md` and STATUS/HANDOFF prevail over old NEXT lines; main/PR3/PR4 unchanged; PR9 stays Draft.

> **LATEST M06-A VERIFIED · 2026-10-26 KST:** App SHA `e351fab774eb8e3de9caab8aae4039fc6185fcd9`. Linux Chrome+Edge [Actions #40207916153](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40207916153) **SUCCESS**, 60/60 unit; Windows NSIS [#40207916086](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40207916086) **SUCCESS** installed PDF/upgrade regressions. M06-A actual local PDF.js source page 2 canvas + bbox and user manual 0/7→1/7 check verified Chrome+Edge; direct Windows canvas click NOT RUN. Check is ephemeral/manual, export soft warning, no source bytes persisted. **NEXT READY M06-B** interactive 4-step flow, responsive/keyboard QA, drag PDF import. **M03-B1 true GGUF LLM** requires separately approved model download/CPU/license test; still absent. Commercial 3 SKU **NO-GO**. Read `docs/commercial/M06_A_SOURCE_REVIEW_20261026.md`. Existing M05/M04 NEXT below is historical; keep main/PR3/PR4 protected and PR9 Draft.

> **LATEST M05 VERIFIED — 2026-10-26 KST:** Actual 1600×1000 Chrome screenshot from [#40205522431](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40205522431) reviewed; app SHA `31b499182ade86717a82ff4e8960401a96ab4c0f` Linux Chrome/Edge SUCCESS (58/58 unit), Windows NSIS [#40205522595](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40205522595) SUCCESS. **Restricted internal PDF→2 designs→new A4 demo GO; commercial sale NO-GO**. M01/M02/M03-A/M03-B0/M04/M05 scoped work complete; real local LLM, page/block click verification, true 8/20/30 SKU features, buyer PDF/Windows tests remain unverified. **NEXT ONE READY M06-A:** click source origin page/coordinate from editable block, navigation/highlight and explicit completeness-review state with synthetic browser tests. Actual model acquisition M03-B1 remains approval-gated. Report `docs/commercial/M05_MVP_REVIEW_20261026.md`; main/PR3/PR4 unchanged, Draft PR9. **Older M01/M03/M04 NEXT lines below are historical.**

> **LATEST M04 VERIFIED (2026-10-25 KST):** Tested source `31b499182ade86717a82ff4e8960401a96ab4c0f`. Linux Chrome/Edge Actions #40205522431 **SUCCESS** (58/58 unit); Windows NSIS #40205522595 **SUCCESS** with second-pass real installed PDF A4/text-bound/marker/raster audit. **M01/M02/M03-A DONE; M03-B0 IPC ready but real LLM absent; M04 internal synthetic acceptance DONE** (NOT customer PC). NEXT READY **M05** actual UI screenshot/mockup parity + blocker audit + internal MVP decision. Keep main/PR3/PR4 untouched, PR9 Draft, sale NO-GO; see `docs/commercial/M04_PDF_INTEGRITY_AUDIT_20261025.md`. Prior M03-B READY instructions below are historical.

> **LATEST 2026-10-25:** Tested source `a94f0b291dbda209ecaccab350111a09f2836764`: Linux #40204570884 SUCCESS (55/55 unit, Chrome/Edge), Windows #40204570893 SUCCESS. M03-B0 model-free secure IPC scaffolding prepared; **real GGUF/LLM/CPU tests NOT DONE; RELEASE_MANIFEST=null**. See `docs/commercial/M03_B0_HANDOFF_20261025.md`. NEXT READY M04 independent synthetic PDF checks; M03-B1 model download/licensing/CPU evaluation requires owner approval. Product NOT ready for sale. Older M01/M03-B READY statements below are historical.

> **LATEST VERIFIED 2026-10-25 23:41 KST: M01 DONE / M02 DONE / M03-A DONE; NEXT M03-B.** Tested implementation `768fc0183e8aa2f6f09d1a87458b8cb9347b6e73`: Linux Chrome+Edge [#40203100279](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40203100279) SUCCESS (51/51 unit PASS, built, real rule-UI click/reject/accept/undo), Windows NSIS [#40203100297](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40203100297) SUCCESS (existing installed PDF import/export & upgrade). New rule-based proposal is **not** a real local LLM; do not advertise AI 윤문 as implemented. **NEXT READY** inspect `docs/commercial/M03_OFFLINE_ENGINE_DECISION.md`, choose a licensed GGUF+llama.cpp offline IPC design, obtain approval for large model download/runtime addition, prove actual local inference CPU/Korean quality/sensitive-value preservation, else mark BLOCKED and proceed to M04 independent customer document acceptance. Main/PR3/PR4 untouched; PR9 draft. Older 'M01 READY' below is stale history.

> **LATEST VERIFIED (2026-10-25 23:25 KST) — M02 DONE → M03 READY.** Integration implementation `0671fde98b0fc91fc6b4bb6eb43fca6e5411621f`: [Linux Chrome/Edge #40201817319](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40201817319) and [Windows NSIS #40201817273](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40201817273) both **SUCCESS**, including actual left source PDF vs center A4 retained after approval, SHA-256 preserved, document switch revokes source Blob, two distinct A4 themes, native Windows STEP3 import/export and IDB/upgrade regression. **NEXT ONE READY: M03 local safe opt-in rewriting (rule detection+diff/approval/undo, actual offline LLM/model-license/CPU evidence or NOT VERIFIED)**. Main/PR3/PR4 unchanged, no sale/production. Older M02 IN_PROGRESS/M01 READY statements below are historical.

> **CURRENT M02 state — 2026-10-25 23:13 KST:** On `integration/astra-commercial-core` tested implementation `383d2a63e1b91a32389ce75eeb7c9ceb4622d3ba`, [Linux Chrome/Edge #40200891875](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200891875) + [Windows NSIS #40200891742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200891742) **both SUCCESS**. M02 actual 3-pane studio and **two distinct actual A4 PDFs**, screenshot artifact with Korean Noto CJK, achieved. **M02 remains IN_PROGRESS** because the source-PDF Blob URL is revoked on successful import: the next `ㄱ` or one-line restart MUST first implement *in-session original PDF vs new A4 comparison after commit*, with document-ID guard and cleanup; do NOT persist original bytes into IDB without approval. Then verify/close M02 → M03 local opt-in AI. The older M01 READY instructions below are historical, not current. `main`/PR3/PR4 remain untouched; no sale approval.


> **최신 확정 M01 완료 / M02 READY — 2026-10-25 22:55 KST:** 통합 브랜치 코드 `4b5be85a8e7e0fb26d4be3bca58f423477e49c48`의 [Linux Chrome/Edge #40199604164](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604164) 및 [Windows NSIS #40199604265](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604265) **최종 SUCCESS**. Windows 설치 앱에서 합성 2p PDF→PDF.js 원본 대조·승인→IDB 신규 문서→테마 변경→재로드→Electron native 저장→A4 1p 출력·원문 표식 6개·이미지 1회 검증. **현재 다음 작업은 M02 실제 3영역 스튜디오·조판이 실제로 다른 2가지 디자인 및 목업 실물 비교**. 문서 하단의 오래된 M01 'READY'와 in_progress 기록은 과거 이력이다. 실제 고객문서/로컬AI/상용화는 여전히 미검증이다.


> **한 문장 재개 요청 (사용자 최종 2026-10-25):** `[astra_pdf_redesigner 깃헙 레포지토리 보고 작업이어가셈]` 입력 즉시 `WORKER_START_HERE.md`를 먼저 읽고 GitHub/CI 최신 원격을 확인해 다음 READY 실제 개발 작업을 수행한다. **새 채팅에서 추가 인수인계 질문·승인 요청 금지(차단 사항은 BLOCKED 후 다른 READY)**. 진입점은 [WORKER_START_HERE.md](WORKER_START_HERE.md).


> **이 파일이 상품화 트랙의 SSOT 진입점이다.** 새 채팅에서 `[아스트라 깃헙 확인하고 작업이어가셈]` 또는 `ㄱ`을 받으면 아래를 최신 원격 브랜치 기준으로 읽는다. 이 문서의 존재만으로 백그라운드 작업이 실행되는 것은 아니다.

## 사용자 확정 결정
- 기준 저장소: `hibi89/astra_pdf_redesigner` 유지; **새 저장소·전면 재작성 불필요**.
- 플랫폼: 고객용 **Windows x64 설치형 / 로컬 우선 / 추가 API 구독료 없는 제품**.
- 핵심: **기존 PDF 불러오기 → 원문 구조화·보존·누락 검수 → 선택적 윤문 → 새 스타일 재조판 → 검수·PDF 저장**.
- **윤문 기본 제공: BASIC 30,000원 / PRO 60,000원 / BUSINESS 90,000원 전체**. 모델/윤문 품질을 등급별로 인위적으로 낮추지 않는다.
- 원문 유지는 디폴트. 윤문은 opt-in이며 수치·이름·인용·당위/추측의 의미를 침범하면 승인 불가. 원본과 수정안은 구분 저장.
- 기존 STEP1 localStorage / STEP2 IndexedDB / 원본 로드맵 및 두 PNG 보존. `main`의 기존 앱과 Draft PR #3/#4는 무단 병합·수정하지 않는다.
- 2026-10-25 사용자가 브랜치 설계·전체 작업계획과 GitHub 문서화, 총괄 역할을 위임했다. 상품화 설계 문서는 새 브랜치에서 작성하며, 실제 출시는 품질·라이선스·고객 수용 게이트를 요구한다.

## **최신 지시 우선: 72시간 MVP (2026-10-25)**
- 177~370h 전체 완성 계획은 **활성 일정에서 해제**. 먼저 최소 PDF→새 PDF 실제 동작, 다음 실제 화면 vs 목업 비교, 이후 설치형·윤문, 심화 QA는 뒤에.
- 목표 2026-10-28 KST까지 **내부 MVP 도전**. 3만/6만/9만원 세 등급 정식 출시·8/20/30 템플릿 완성은 72시간 MVP와 별개.
- 작업 순서/검증: [72시간 실행표](docs/commercial/EXECUTION_PLAN.md), [목업 실제비교표](docs/commercial/MOCKUP_PARITY.md).
- 기본 파일 보호/외부전송 금지·초기 smoke는 즉시 유지. 심화 보안·설치 서명·정식 라이선스/고객 QA는 **MVP 이후지만 유료 판매 이전**.

## 읽는 순서
1. `docs/commercial/STATUS.md` — **상품화 기준 현재 상태** (구 STEP 로드맵 진행률과 혼동 금지)
2. `docs/commercial/EXECUTION_PLAN.md` — 전량 WBS / 작업 의존성·견적·AC
3. `docs/commercial/MOCKUP_PARITY.md` — 최초 목표와 실제 앱의 차이
4. `docs/commercial/PRODUCT_SPEC_V1.md` — 고객 여정·SKU·기능 범위
5. `docs/commercial/ARCHITECTURE_AND_DATA_CONTRACT.md` — 코드 재사용·PDF·윤문·데이터 무결성
6. `docs/commercial/QA_RELEASE_GATES.md` — 테스트·판매 중단 조건
7. `docs/commercial/BRANCH_AND_DISPATCH.md` — 브랜치·단일 태스크·기록 규칙
8. `docs/commercial/PRICING_LICENSING_SUPPORT.md` — 판매·설치·고객지원·저작권
9. `docs/commercial/HANDOFF.md` — 최신 실작업 증거·다음 작업
10. 과거 기준: `REQUIREMENTS.md`, `docs/BLUEPRINT.md`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`, `AGENTS.md`, 구 `STATUS.md`/`HANDOFF.md`.

## 기준 사실 / 외부 제약
- `main` 2026-10-25 조회 HEAD `2d1b29595f78653d5d53464e7dad747d61c35fc2`: STEP1/2 제품 기초.
- [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) `feature/step3-pdf-import-20261019` `faec84e388da0f7a6d71f71c1b8d14e18d9f3098`: 브라우저 로컬 PDF.js 추출·이미지 PNG 복원 부분·원본 대조, **실문서 합격 미확인**.
- [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4) `feature/windows-electron-package-20261019` `057ccef81b97dd741c46002c28292bfdf544362f`: Electron·NSIS 설치·STEP2 PDF 저장 검증, **STEP3 미포함·고객 PC/서명 미수용**.
- `im-not-ai` 출처: https://github.com/epoko77-ai/im-not-ai, MIT (고지 조건). 규칙/메트릭/검증은 코드로 실행 가능하지만 **전체 윤문 스킬은 LLM 호출 전제**. 자체 경량 로컬 LLM·정확한 라이선스·성능 테스트 전에는 완성 주장 금지.
- 컨셉 이미지와 UI 예시는 **미구현 시안**이다. 7단계 완성, 8/20/30 템플릿 수, 8GB에서 로컬 모델 원활 가동, 고객 PC 설치 성공 등은 아직 검증 사실이 아니다.

## 지금의 다음 작업
**M01 READY**: `integration/astra-commercial-core`에 PR3 PDF import와 PR4 Windows export를 가능한 최소한으로 연결, 단순 PDF→새 A4 PDF부터 실제 테스트한다. A02는 M01로 편입. 기존 PR3/PR4와 `main` 보호.

## 종료/재개 규칙
각 작업은 `TASK_ID` / 브랜치 / 시작 SHA / 바뀐 파일 / 테스트 실제 명령·PASS·FAIL·NOT RUN / 위험 / 새 SHA / 다음 1개 READY 를 `docs/commercial/STATUS.md`·`HANDOFF.md`에 append 또는 최신화하고 커밋한다. 완료를 추측하지 않는다. 사용자의 `ㄱ`은 **READY 작업 하나를 실제 실행**한다는 뜻이며, 손댈 수 없는 외부 입력이 필요한 경우 BLOCKED로 남기고 준비된 다음 작업으로 진행한다.
