# ASTRA Commercial — 최신 핸드오프 (2026-10-25)

## 최신 사용자 전략 교체
- 사용자: '너무 긴 작업시간 → 먼저 작동 MVP → 처음 그린 목업과 실제를 비교해 차근차근 보강 → 심화 보안/안정성은 끝에 → 3일컷 목표'. 
- **절대 빠른 루프:** PDF 업로드→원문 검수→디자인2종→PDF 저장을 가장 먼저 구현. 검증되는 부분부터 실제 화면캡처 대비 [MOCKUP_PARITY.md](MOCKUP_PARITY.md) 갱신. 무작정 8/20/30디자인, 배치, 라이선스부터 만들지 않는다.
- **예외:** 고객 원본 보존/로컬 파일 미전송/자동 수정 방지/기본 저장·실행 테스트는 지금부터 유지. 심화 공격 테스트·제품 서명/지원 FAQ 등은 내부 MVP 뒤로 넘겨도 유료판매 전에 완료한다.

## 최신 READY
- **M01 P0 READY**, 상세 [EXECUTION_PLAN.md](EXECUTION_PLAN.md). 대상 `integration/astra-commercial-core`. PR3 `faec84e3...`와 PR4 `057ccef...`의 실제 코드에서 최소 PDF import+export를 연결한다. 어느 기존 source branch/main도 변경하지 않는다.
- 1차 산출: 선택 가능한 단순 국문 PDF 1~5p→PDF.js import→원본 대조·수정→2개 테마 중 선택→새 A4 PDF 출력, 실제 smoke 결과 및 커밋.
- 이어서 M02 3영역 상용 UI와 목업 5항목 실제 비교; M03 로컬 윤문(작동 안 하면 미완료 표시); M04 Windows NSIS; M05 남은 결함/실사용 한계 보고.
- 3일 목표는 **2026-10-28 KST**. 달성 가정이 아니라 우선순위 목표, 모델/Windows QA가 막히면 솔직하게 미달 보고.
- `main`, 기존 Draft PR #3/#4 미병합. 기존 PR 두 개 서로 직접 merge 금지. A01 감사 [INTEGRATION_A01_AUDIT.md](INTEGRATION_A01_AUDIT.md) 참조.
- 테스트 이번 회차: **NOT RUN**. 설계 문서만 변경; 개발/CI 통과했다고 주장 불가.

## 다음 채팅 복구
`[아스트라 깃헙 확인하고 작업이어가셈]` 혹은 `ㄱ` → `COMMERCE_START_HERE.md` → 본 핸드오프 → M01 1개 실행 → 커밋/검증/남은 부분 업데이트.
