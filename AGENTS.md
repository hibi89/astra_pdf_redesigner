# 프로젝트 작업 규칙
- 확정 요구사항은 `REQUIREMENTS.md`, 설계 원본은 `docs/ASTRA_ORIGINAL_ROADMAP.txt`와 `docs/BLUEPRINT.md`에서 확인한다.
- **현재 진행 단계는 STEP 3 (기존 PDF 가져오기)**이며, STEP 1·2 기능과 기존 localStorage/IndexedDB 원본 비파괴 보존을 전제로 진행한다. 현재 STEP 3은 선택 가능한 PDF 텍스트·좌표 기반 단일 열 MVP이며 **스캔 PDF OCR은 범위 밖**이다. main 병합은 별도 검증·승인 없이 하지 않는다. 내용 데이터와 디자인 설정을 분리한다.
- 문서 원문을 자동 변경하지 않으며 외부로 전송·콘솔 기록하지 않는다.
- 사용자 저장 데이터 및 기존 정상 기능을 보존한다. 변경 시 회귀 테스트를 수행한다.
- 작업 종료 시 테스트 실제 결과를 `STATUS.md`, 인수인계를 `HANDOFF.md`에 기록한다.
