# ASTRA Commercial STATUS — 72h MVP (CURRENT)

- **기준:** 2026-10-25 KST. **3일 MVP 우선 목표 2026-10-28 KST (도전 목표 / 정식 판매 아님)**.
- **M01:** **DONE (installed STEP3 E2E synthetic fixture verified)**. 초기 통합 소스 커밋 `978fe4fc469935e7d04c42151de931fb45c66107` on `integration/astra-commercial-core`; [Draft PR #9](https://github.com/hibi89/astra_pdf_redesigner/pull/9).
- **M01 지금 완료:** PR3의 PDF.js importer + STEP2 모델·테스트, PR4의 Electron save dialog/NSIS/테스트 코드를 독립 브랜치에 결합하고 `Workspace` import/print bridge 접합. **이 단계는 SOURCE INTEGRATED, NOT VERIFIED**.
- **Linux Actions:** [#40198529770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40198529770), `in_progress` 최초 확인. **PASS/FAIL 아직 검수 전**.
- **Windows Actions:** [#40198529742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40198529742), `in_progress` 최초 확인. **PASS/FAIL 아직 검수 전**.
- **M01 마감 전 남은 필수:** CI 완료 결과·코드 SHA 확인, 실패 수정, 설치형 STEP3 import→native export 실제 E2E 추가, 원본/STEP1·2 데이터 보존.
- **M02 IN_PROGRESS:** 원본/출력 3영역 화면 및 디자인 2종 실물→목업 비교 [MOCKUP_PARITY.md](MOCKUP_PARITY.md).
- **M03 WAIT:** 동일 기능의 선택형 offline 윤문/로컬 소형모델 1문단 시연. 미검증이면 완료 주장/판매 금지.
- **M04 WAIT:** Windows NSIS 고객 경로 설치·PDF import/export·재시작, SHA.
- **M05 WAIT:** 실제 스크린샷/PDF 기반 차이표와 핵심 결함 보고.
- **보존:** `main` HEAD `2d1b29595f78653d5d53464e7dad747d61c35fc2`, PR3 `faec84e388da0f7a6d71f71c1b8d14e18d9f3098`, PR4 `057ccef81b97dd741c46002c28292bfdf544362f` 원본 불변; 사용자 데이터·문서 CI 업로드 금지.
- **최종 사업:** BASIC ₩30,000 / PRO ₩60,000 / BUSINESS ₩90,000; 전 SKU 동일 로컬 윤문은 **최종 제품 계약**이며 MVP SKU 구현 아님.
- **A01:** 기존 3자 비교 감사 완료. [감사문서](INTEGRATION_A01_AUDIT.md). 구 177~370h [확장 백로그](EXPANDED_BACKLOG_20261025.md)로 이관.
- **NEXT READY:** M01 CI 완료 확인 → 실패 수정 또는 새로운 Windows STEP3 E2E.


## [RESUME HANDOFF] 2026-10-25 최신 단문 재개 트리거
- `[astra_pdf_redesigner 깃헙 레포지토리 보고 작업이어가셈]` → `WORKER_START_HERE.md`를 읽고 질문 없이 즉시 M01 다음 실제 작업.
- 점검 중 CI source SHA `978fe4fc469935e7d04c42151de931fb45c66107`: Chrome/Edge workflow #40198529770, Windows #40198529742 최초 in_progress, Edge 개별 job SUCCESS. **최종 상태 재조회 필수**.
- M01 **IN_PROGRESS**, 현재 Windows STEP3 import→native PDF export 실통합 E2E **NOT RUN/NOT VERIFIED**.
- 다음 작업 READY = CI 완료/실패 검사 및 Windows STEP3 통합 E2E 추가. 테스트 결과 기록 뒤 M02.

## 2026-10-25 KST — M01 installed STEP3 E2E test added (evidence-based checkpoint)
- Legacy integration SHA `978fe4fc469935e7d04c42151de931fb45c66107`: [Linux Chrome/Edge #40198529770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40198529770) **SUCCESS** (both jobs); [Windows #40198529742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40198529742) **SUCCESS**. These runs do **not** cover STEP3 installed import/export.
- New code SHA `4b5be85a8e7e0fb26d4be3bca58f423477e49c48` on `integration/astra-commercial-core`: added `desktop/step3-project-acceptance.cjs` and wired test-only CI acceptance path in `desktop/main.cjs`, `tests/windows-installer-lifecycle.ps1`, `tests/verify-desktop-pdf.mjs`, and static regression in `tests/desktop-shell.test.cjs`.
- Test scenario: create a synthetic PDF in installed Electron → PDF.js upload and source review → explicit confirmation → independent IndexedDB document → change layout → reload → native Electron PDF save → verify new A4 PDF text and source marker order. Runs in disposable GitHub-hosted Windows runner only, source/customer files never committed.
- **Verification pending:** new [Windows #40199604265](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604265) and [Linux #40199604164](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604164) were `in_progress` when this checkpoint was written. No claim of new Windows STEP3 E2E PASS yet.
- **M01 remains IN_PROGRESS; NEXT READY:** inspect both run conclusions/jobs and the STEP3 installed log. If test fails, isolate root cause and fix only that test/product boundary; if green, mark M01 verified and start M02 true 2-layout A4 preview and 3-pane UI. No main/PR3/PR4 merge, no production release.

## [LATEST / FINAL CI] 2026-10-25 22:55 KST — M01 DONE, M02 READY
- **M01 DONE (verified synthetic installed-Windows vertical slice):** implementation commit `4b5be85a8e7e0fb26d4be3bca58f423477e49c48`. [Linux Chrome + Edge #40199604164](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604164) = **SUCCESS**, both jobs; [Windows NSIS #40199604265](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604265) = **SUCCESS**, all Windows steps including new installed STEP3 E2E.
- **Actual Windows E2E job log (2026-10-25 22:55 KST):** `PASS ASTRA INSTALLED STEP3 E2E` (new synthetic local PDF → PDF.js extraction and manual approval → new IDB document → changed theme → reload → native IPC PDF export); `PASS ASTRA INSTALLED STEP3 PDF CONTENT` (A4 **1 output page**, 6 markers and their order verified, **1 raster draw**). [Job log](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40199604265/job/121187756373).
- **Verified scope limit:** two-page synthetic source to reflowed one-page A4 output, not customer document sampling; complex tables, OCR, pixel-exact source, real Windows customer PC, 2 distinct designed output styles, local LLM and three SKU enforcement remain NOT VERIFIED / NOT IMPLEMENTED.
- **NEXT READY M02:** actual three-pane PDF review/preview/style UI, at least 2 demonstrably different real A4 layout prints, browser and Windows smoke, capture actual UI then fill the 5 highest mockup parity gaps. M03 local optional AI then M04 real installer/customer path then M05 final internal MVP verdict. **No commercial sale approval.**

## [LATEST / 2026-10-25 23:13 KST] M02 FIRST ITERATION VERIFIED, M02 PARITY GAP STILL OPEN
- **M01 DONE** from prior synthetic installed STEP3 E2E. **M02 IN_PROGRESS (implemented layout+2 prints, source-after-commit comparison gap)**. Keep M03 optional AI next in queue but not claim it has begun.
- **New tested app commit** `383d2a63e1b91a32389ce75eeb7c9ceb4622d3ba` on `integration/astra-commercial-core`. Updated `src/step2/Workspace.tsx`, `src/styles.css`, `tests/step3-browser.mjs`, `.github/workflows/ci.yml`. Prior commits `0bf61af6` initial layout and `c24c3d0a` test regex fix.
- **CI final:** [Linux Chrome/Edge #40200891875](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200891875) = **SUCCESS** (2 jobs), [Windows NSIS #40200891742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200891742) = **SUCCESS** (full installed STEP3+upgrade smoke).
- **Actual evidence:** 1600px Chromium 3-column geometry PASS, `Page.printToPDF` report vs minimal preserved 3 marker texts and distinct PDF header coordinates. First verified run had bbox title Y `246.861318pt` vs `276.111317pt` (29.25pt difference). Korean screenshot initially showed tofu on Linux; latest CI installed Noto CJK and produced **legible actual screenshot**. [Screenshot workflow artifact](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200891875) name `astra-m02-studio-chrome-synthetic`. Source is synthetic, never customer PDF.
- **Why not M02 DONE:** original PDF iframe exists during import review but current `ImportPanel.tsx` calls `forget()` on successful commit and releases the Blob URL; persistent before/after original vs redesigned A4 comparison not yet implemented. Original blueprint graphic is not in GitHub, so exact pixel mockup parity NOT VERIFIED.
- **NEXT READY:** M02 original-after-import **in-session** comparison with per-active-document identity guard; never persist original PDF into IndexedDB without approval, revoke source Blob URLs on close/switch; test that output remains independent and source unchanged. Then close M02 and start M03 opt-in offline rewriting.
- **Main/PR3/PR4** unchanged; no Vercel, production or customer Windows desktop accepted; 3SKU feature gating and AI remain NOT IMPLEMENTED / no-sale.
