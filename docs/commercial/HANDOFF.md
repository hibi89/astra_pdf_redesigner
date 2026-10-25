# ASTRA Commercial — 최신 인수인계

## 2026-10-25 총괄 상품화 설계 회차
1. **목표:** `hibi89/astra_pdf_redesigner` 기존 STEP1/2·Draft PR3 PDF 가져오기·Draft PR4 Windows 설치형을 보존·재사용하여 **내용 보존 우선 + 선택적 오프라인 한국어 윤문 + 3/6/9만원 Windows 설치형** 제작.
2. **검토한 HEAD:** main `2d1b29595f78653d5d53464e7dad747d61c35fc2`; PR3 `faec84e388da0f7a6d71f71c1b8d14e18d9f3098`; PR4 `057ccef81b97dd741c46002c28292bfdf544362f`. 두 PR은 open/draft/unmerged (2026-10-25 확인).
3. **실행:** 총괄 `lead/astra-commercial-20261025` 브랜치를 기존 main HEAD에서 분리. 신규 기획 문서 작성. 기존 앱 기능 코드는 이번 회차 **수정하지 않음**. 신규 npm/브라우저/Windows 실행 **NOT RUN**.
4. **아키텍처 결론:** 엔진 전면 교체가 아닌 기존 STEP2 모델/저장·STEP3 PDF.js·PR4 Electron 보존, **immutable source / accepted edits / style 분리**. 윤문은 강제하지 않고 로컬 model+im-not-ai deterministic 검증. 모델·속도·지원범위는 테스트 전 보장 금지.
5. **계약·가격:** BASIC 30,000 / PRO 60,000 / BUSINESS 90,000. 모두 동일 모델/윤문 품질·원문 비교·안전 검수; 차이는 8/20/30 실조판 템플릿 목표, batch, brand kit. 디지털 상품 라이선스/SmartScreen/모델 배포·크몽 정책은 구현·재확인 필요.
6. **원본/보안:** `main`, Draft PR3/4, 원본 로드맵/두 PNG, STEP1 v1·STEP2 v2 사용자 데이터 불변. 고객 문서를 public CI로 올리지 않는다. im-not-ai MIT 원문 고지 필요. 전자서명/상업 모델 라이선스 검수 필요.
7. **다음 READY 1개:** **A01** — PR3/PR4/main 3자 변경 파일, 의존성·Root import/IPC·데이터 저장 충돌표 작성; 안전한 통합 후보(원본 유지) 결정. 파일 증거와 실제 검증 있으면 `STATUS.md` 갱신·커밋. `D01`은 A01 차단 시 수행.
8. **사용자 조작:** 지금은 필요 없음. 로컬 고객 PDF 검사·설치 경고·모델 CPU 벤치마크는 나중에 사용자 환경 시험 필요 가능. 미검증 항목은 시간/장치까지 추측하지 말고 BLOCKED 기록.
9. **인수 문구:** `[아스트라 깃헙 확인하고 작업이어가셈]` 혹은 `ㄱ` → `COMMERCE_START_HERE.md` 부터 읽고 최신 `STATUS`에서 READY 단일작업 실제 수행.
