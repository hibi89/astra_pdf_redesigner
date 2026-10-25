# ASTRA Commercial — 72h MVP 최신 핸드오프 (2026-10-25)

## 현재 상태
- 목표: **2026-10-28 KST** 내부 MVP (실제 PDF 입력 → 새 디자인 2개 → 출력; Windows 테스트 설치형 목표), 이후 실제 목업 비교 및 디벨롭. 3만원/6만원/9만원 3SKU 모두 윤문 최종 요구 유지. 8/20/30종 및 완전 QA는 MVP 뒤.
- 보호: **main/PR3/PR4 원본 변경 금지**, STEP1 localStorage v1/STEP2 IDB v2 데이터 비파괴, 고객 PDF 공개 CI 반출 금지.
- 실제 수행: `integration/astra-commercial-core` source commit **`978fe4fc469935e7d04c42151de931fb45c66107`**, [Draft PR #9](https://github.com/hibi89/astra_pdf_redesigner/pull/9). PR3의 PDF import/구조화/이미지/경고 + PR4의 native PDF export/installer 연결, `Workspace.tsx`에서 `savePdfFromEditor()`를 호출. npm Electron scripts+PDF.js dependency 통합.
- 검증: GitHub 자동 실행은 시작됨. [Linux run #40198529770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40198529770) / [Windows run #40198529742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40198529742) 최초 조회 상태 **in_progress**; **최종 PASS 아님**. CI/패키지 결과 확인 필수.
- 다음: **M01** 동일 커밋 런 결과 확인 → 실패 수정, 브라우저 STEP3 E2E 확인. 추가로 **Windows 설치판 STEP3 PDF 가져오기→새 문서→Native save→A4 추출 E2E** 추가/실행. 기존 PR4의 STEP2-only Windows smoke로는 불충분.
- M02: 3영역 UI 실물 구현, 2개 디자인과 이전 목업 [차이표](MOCKUP_PARITY.md); M03 윤문 rule+local LLM 실측; M04 NSIS; M05 실물 기반 갭5.
- 이전 상세 WBS(177~370h)는 [보관 백로그](EXPANDED_BACKLOG_20261025.md), 최신 작업표는 [72h 계획](EXECUTION_PLAN.md).

## 재개 단문
`[아스트라 깃헙 확인하고 작업이어가셈]` / `ㄱ` → `COMMERCE_START_HERE.md`와 본 HANDOFF, `integration/astra-commercial-core` 최신 코드, 현재 CI를 확인하고 M01 다음 작업 하나 실제 수행. 결과를 실제 SHA/테스트 기준으로 본 문서와 STATUS에 기록.
