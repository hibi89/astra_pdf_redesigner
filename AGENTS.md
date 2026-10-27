> **2026-10-28 해총 최종 공통 개발·검증 지시 / 소유자 최신 결정:** [전 프로젝트 개발 속도·검증 통합 정본](https://github.com/hibi89/hackathon-command-center-2026/blob/main/docs/DEV_ACCELERATION_AND_VERIFICATION_20261028.md). 현재 **KIC(+DL)·PayPal·UGREEN·LA만 활성 4개 작업 슬롯**, 이 브랜치는 **임시 대기(원본 보존, 폐기 아님)**. 다른 소유자 지시로 재개되지 않았다면 `ㄱ`만으로 자율적인 코드 수정/테스트 CI/배포를 시작하지 않는다. 재개 시 합의된 구현은 GPT-6 **Instant**, 최초 설계·난제·해총 최상위 검수는 높은 추론; 실제 기능 중심, GitHub 파일 단위 반복·다중 상태문서 복제·동일 SHA CI 폴링 줄임. 단일 안전 로컬 검증과 정확한 실행 SHA/PASS·FAIL·SKIP을 보고한다. 기존 제품 설계·권리·보안·사용자 승인·동결/복구·비공개 원본 보호 규칙은 보존한다. 본 공지는 개발 허가나 테스트 통과 주장 아님.

# 프로젝트 작업 규칙
- 확정 요구사항은 `REQUIREMENTS.md`, 설계 원본은 `docs/ASTRA_ORIGINAL_ROADMAP.txt`와 `docs/BLUEPRINT.md`에서 확인한다.
- **현재 승인 단계는 STEP 2**이며, STEP 1 기능과 저장 데이터의 비파괴적 보존을 전제로 기존 아스트라 로드맵 순서대로 개발한다. STEP 3 PDF 가져오기·OCR은 아직 범위 밖이다. 내용 데이터와 디자인 설정을 분리한다.
- 문서 원문을 자동 변경하지 않으며 외부로 전송·콘솔 기록하지 않는다.
- 사용자 저장 데이터 및 기존 정상 기능을 보존한다. 변경 시 회귀 테스트를 수행한다.
- 작업 종료 시 테스트 실제 결과를 `STATUS.md`, 인수인계를 `HANDOFF.md`에 기록한다.

## 최신 단계 상태 보충 (2026-10-19)
- 위의 “현재 승인 단계 STEP 2 / STEP 3 범위 밖”은 초기 main 안정화 규칙이다. 이후 사용자의 순차 `ㄱ` 승인에 따른 **독립** STEP3 PDF 가져오기 [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3)와 STEP1/2 Windows 설치형 [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4)가 존재한다. 두 PR은 현재 **main 미병합**이며 승인 없이 병합·STEP4 착수 금지.
- 최신 검증 사실/남은 수동 인수 조건은 `STATUS.md`와 `HANDOFF.md`의 마지막 시점 기록을 따른다. 이전 시점의 “미착수” 표현으로 최근 feature 진행을 덮어쓰지 않는다. main의 사용자 기존 데이터 보존·원본 변경/외부 전송 금지 원칙은 유지한다.
