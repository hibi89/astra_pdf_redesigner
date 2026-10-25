# ASTRA 상용화 STATUS (SSOT)

- **작성:** 2026-10-25 KST
- **상태:** DESIGN/PLANNING. **판매·상용화 완료 아님**.
- **기준 저장소:** `hibi89/astra_pdf_redesigner`
- **main 조회 HEAD:** `2d1b29595f78653d5d53464e7dad747d61c35fc2`.
- **총괄 브랜치:** `lead/astra-commercial-20261025` (본 기록·기획서).
- **사용자 확정:** 30/60/90천원, 3SKU 모두 윤문, 오프라인 기본/경량 로컬 AI, 기존 레포 재사용, 총괄 브랜치/전체 작업표 위임.
- **A01** **DONE (원격 코드/파일/의존성 감사)**: [INTEGRATION_A01_AUDIT.md](INTEGRATION_A01_AUDIT.md) 작성. 기능 병합 및 신규 테스트 **NOT RUN**.
- **A02** **READY**: `integration/astra-commercial-core`에서 충돌 해결·컴파일·Windows CI까지 실제 실행.
- **D01** READY: im-not-ai MIT 규칙 재사용 범위 및 벤치마크 fixtures 설계.
- **이번 회차 완료:** 기존 저장소·PR 상태 실조회 + 상품화 설계/WBS/QA·운영 기획 문서 신규 작성 + PR3/PR4 교집합 원격 코드 감사(A01). 실행 코드 개발 **0**, 실제 신규 테스트 **NOT RUN**, 상품화 통합 기능 **NOT VERIFIED**.
- **계획 WBS:** A01~H03, 약 177~370인시의 초기 가정. A01 문서 감사만 DONE, **상용화 코드 task DONE 0**. 코드/판매 완료율 산출 보류. 구 7단계의 비공식 38%와 혼용 금지.
- **기존 기초 자산:** STEP1/2 main, STEP3 Draft PR3 PDF.js+이미지 부분 복원·위험 분석 CI 검증, Windows Draft PR4 Electron+NSIS STEP2 수용 자동검증. 고객 실제 파일/Windows GUI/모델/3SKU 상용화는 미검증.
- **안전:** 원본 로드맵/이미지·STEP1 v1·STEP2 v2 불변. `main`/PR3/PR4 변경·병합 없음.
- **새 브랜치:** `integration/astra-commercial-core` (총괄 첫 커밋 분기), `feature/astra-pdf-fidelity-20261025` (기존 PR3 HEAD에서 파생), 원본 브랜치 불변.
- **다음:** A02를 우선 실행. `COMMERCE_START_HERE.md`와 `docs/commercial/HANDOFF.md`를 읽고 현재 상태에서 진행.
