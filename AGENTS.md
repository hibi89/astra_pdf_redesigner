# 프로젝트 작업 규칙
- 확정 요구사항은 `REQUIREMENTS.md`, 설계 원본은 `docs/ASTRA_ORIGINAL_ROADMAP.txt`와 `docs/BLUEPRINT.md`에서 확인한다.
- **현재 승인 범위(2026-10-27 최신): STEP3 PDF 가져오기 진행 승인에 이어 STEP4 디자인 비교·적용·취소 개발도 사용자가 승인했다.** 기존 8개 디자인·STEP1/2·사용자 데이터를 보존하며 최초 아스트라 로드맵을 따른다. OCR은 별도 승인 전까지 범위 밖이다. 기존 V2 `DesignSettings`로 가능한 비파괴 작업은 진행하고, 사용자 프리셋 저장/재사용을 위한 저장 스키마·migration은 별도 승인 전 변경하지 않는다.
- 문서 원문을 자동 변경하지 않으며 외부로 전송·콘솔 기록하지 않는다.
- 사용자 저장 데이터 및 기존 정상 기능을 보존한다. 변경 시 회귀 테스트를 수행한다.
- 작업 종료 시 테스트 실제 결과를 `STATUS.md`, 인수인계를 `HANDOFF.md`에 기록한다.

## 과거 단계 상태 스냅샷 (2026-10-19; 2026-10-27 STEP4 승인으로 superseded)
- 위의 “현재 승인 단계 STEP 2 / STEP 3 범위 밖”은 초기 main 안정화 규칙이다. 이후 사용자의 순차 `ㄱ` 승인에 따른 **독립** STEP3 PDF 가져오기 [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3)와 STEP1/2 Windows 설치형 [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4)가 존재한다. 당시 두 PR은 **main 미병합**이었으며 그 시점의 사용자 승인 범위는 STEP4 전까지였다. 이후 2026-10-27 사용자가 STEP4 디자인 비교·적용·취소 개발을 별도로 승인했다.
- 최신 검증 사실/남은 수동 인수 조건은 `STATUS.md`와 `HANDOFF.md`의 마지막 시점 기록을 따른다. 이전 시점의 “미착수” 표현으로 최근 feature 진행을 덮어쓰지 않는다. main의 사용자 기존 데이터 보존·원본 변경/외부 전송 금지 원칙은 유지한다.


## STEP3 PDF 가져오기 승인 이력 — 2026-10-27 (최신 범위는 아래 STEP4 승인 보충 참조)
- 실제 저장소 이력에서 사용자는 단계별 `ㄱ` 승인으로 독립 STEP3 PDF 가져오기 [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3)를 진행했고, STEP1/2 설치형은 별도 Draft PR #4로 분리했다. 둘 다 `main`에는 병합하지 않았다. 과거 STEP2-only 문구는 초기 main 안정화 체크포인트를 설명한다.
- 최신 사용자 지시로 기존 STEP3 PDF 가져오기 개발 범위를 계속 진행하는 것이 승인되었다. 현재 `integration/astra-commercial-core`의 구현·회귀를 기준으로 부족한 기능만 보강하며, 검증된 PDF.js 추출·원본 대조·이미지 경고/복원·승인 후 신규 문서 저장·취소/오래된 결과 방어를 처음부터 재작성하지 않는다.
- **OCR/스캔 인식은 별도 승인 전까지 제외**한다. STEP3 원 설계의 나머지 경계(브라우저 로컬, 단일 열 중심, 복잡한 표/다단·원본 레이아웃 동일성 보장 제외 및 불확실성 경고)는 유지한다.
- STEP1/2 기존 기능·사용자 데이터 및 `main`/PR #3/#4 보존. 비용, 외부 모델/런타임 다운로드, 외부 PDF 전송, 주요 설계 변경, branch merge 및 배포는 각각 별도 승인 없이는 금지한다. 원본 요구/설계 문서는 수정하지 않는다.

## STEP4 사용자 승인 및 구현 경계 — 2026-10-27 19:18 KST

- 사용자는 최초 설계 대비 개발 순서로 STEP4 디자인 조합 엔진을 명시 승인했다. 기존 8개 디자인 보존, 같은 문서 비교, 선택 적용 및 취소/복원, 실제 PDF 출력 확인이 해당 작업 범위다.
- Chrome·Edge·Windows exact-SHA에서 검증된 범위는 `273db07ae851e8d2420da39688b5fa84641ce65d`와 최신 STATUS/HANDOFF/gap matrix의 근거를 따른다. 현재 비교/취소 기능은 저장 schema 없이 기존 V2 `DesignSettings`와 메모리 미리보기를 이용한다.
- 사용자 스타일 저장/재사용을 위한 영구 저장소·export/import schema 변경은 별도 승인을 받는다. OCR, 외부 API/model download, 비용, 중요한 설계 변경, branch merge 및 deployment도 각각 별도 승인 전 실행하지 않는다.
- 문서 원문/사용자 파일은 외부 전송하지 않는다. main, PR #3/#4, 사용자 데이터 및 기존 배포 설정을 보존한다.
