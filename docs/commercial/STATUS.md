# ASTRA Commercial STATUS — 72h MVP (CURRENT)

- **기준:** 2026-10-25 KST / 사용자 지시로 MVP-first·실제 목업 비교·3일컷 목표로 순서 변경.
- **마감 도전 목표:** 2026-10-28 KST 72시간 안에 로컬 Windows 설치형까지 구동 가능한 단순 PDF 리디자인 **내부 MVP**. 배송·유료판매 인증/3SKU 상용 완성은 별도.
- **현재:** 기획 재편 완료, 새 MVP 코드 통합 **미착수**, 이번 회차 빌드·PDF E2E·Windows 새 테스트 **NOT RUN**. 달성률 산정 불가.
- **M01 READY (P0):** `integration/astra-commercial-core`에 PR3/PR4 기능 안전 통합 후 PDF import→A4 export 실제 검증.
- **M02 WAIT(M01):** 첫 실제 앱 UI와 목업 비교하여 세 영역 UI/두 테마 수정.
- **M03 WAIT(M01):** 선택형 규칙검수·최소 로컬 AI 추론 시연. 원문 diff/승인 필요.
- **M04 WAIT(M01,M02):** Windows NSIS 실제 설치·파일 처리·재시작 smoke.
- **M05 WAIT(M02,M04):** 실제 화면·PDF 기반 목업 delta / 잔여 검수·막힌 점 기록.
- **기존 완료:** A01 원격 PR 비교 감사 `INTEGRATION_A01_AUDIT.md`; STEP1/2 main, PR3(기존 PDF 가져오기 실험)·PR4(Windows 설치형 STEP2 실험) 모두 코드 자산. **신규 통합 미완료**.
- **기존 source SHAs:** main `2d1b29595f78653d5d53464e7dad747d61c35fc2`, PR3 `faec84e388da0f7a6d71f71c1b8d14e18d9f3098`, PR4 `057ccef81b97dd741c46002c28292bfdf544362f` (2026-10-25 조회).
- **보존:** main/PR3/PR4 원본·STEP1 v1/STEP2 v2 데이터·원본 PDF 불변. 신규 PDF 외부 전송 금지, 삭제·자동 덮어쓰기 금지.
- **차후:** `EXPANDED_BACKLOG_20261025.md` 177~370h 풀범위는 MVP 후 백로그, **3일 목표의 분모가 아님**.
- **가격 확정된 사업 목표:** BASIC 30,000원 / PRO 60,000원 / BUSINESS 90,000원 전부 동일 윤문. 72시간 MVP에 모든 SKU/8·20·30 디자인을 넣지 않는다.
