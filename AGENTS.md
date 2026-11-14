> **[2026-11-14 21:55 KST · 최신 사용자 지시 · Astra 모델 역할·목표 갱신]** GPT-6 High는 사용자 최종설계도 A01~A12의 100점 배점을 변경하지 않고 **50→70 상세 실행 설계**를 GitHub에 공시하며, GPT-6 Instant가 P114~P126을 실제 구현/테스트/커밋하고 70점 이후 P127~P138로 100점까지 진행한다. High는 사용자가 완료 후 요청하면 독립 최종 검수한다. 이 지시는 아래 과거의 '개발 중단/사용자 개입 대기'에 비해 최신의 **개발 재개 및 역할 재분배 지시**이지만 상용 출시·실제 판매·키 활성화/보안/유료·원본 외부 전송 승인으로 확대되지 않는다. 반드시 [실행 계획](docs/commercial/ASTRA_P114_P126_50_TO_70_EXECUTION_PLAN_20261114.md) → [작업 원장](docs/commercial/ASTRA_P114_P126_TASK_REGISTER_20261114.json) → [70→100 인수인계](docs/commercial/ASTRA_INSTANT_70_TO_100_HANDOFF_20261114.md) 확인. **현재 실제 잠정 50/100점, 공식 UNASSESSED, RELEASE HOLD, P114~P126 모두 PENDING.** 계획·문서 커밋은 새 기능 검증 또는 완성률 증가가 아니다. Instant의 매 `ㄱ`에서 실행 전 HANDOFF.md·STATUS.md·AGENTS.md·REQUIREMENTS.md와 최신 실제 소스/CI를 확인하며, 원본 main/PR #10·V1/V2·고객 PDF/비밀을 보존한다.

> **[OWNER-FINAL-BLUEPRINT-100 | 2026-11-13 KST · 사용자 확정]** 최종완성률은 **사용자 최종설계도 전체 100%**를 기준으로만 계산한다. AI 총괄/담당자의 임의 축소·가중치 조정·MVP/합성 CI/내부 기술 85·95%를 최종완성률로 전용 금지. REQ별 구현 경로·정확 SHA 실행 검증·미구현·미검증·사용자 승인 가중치 추적표를 갖춰 산정하고, 미비하면 공식 `UNASSESSED(재산정 대기)`. 기존 내부 점수/마커·등록이력·판매 HOLD 보존. 크몽 상품 원장은 해총 `kmong-productization`에 증빙과 함께 최신화. [공통 정본](https://github.com/hibi89/hackathon-command-center-2026/blob/kmong-productization/docs/strategy/FINAL_BLUEPRINT_COMPLETION_STANDARD_20261113.md). 문서 갱신 자체는 제품 완료나 배포가 아님.

> **[2026-11-13 KST · Astra 전용 사용자 최신 명시 지시 · 기존 목표 잠금의 예외]** 사용자가 Astra PDF Redesigner의 중앙 `[작업중]` 표시를 삭제하고 `[사용자 개입 필요]`로 교체하라고 직접 승인했다. **95% 달성으로 해제된 것이 아니라, 개발 작업을 종료하고 사용자 개입이 필요한 상태로 인계한 것**이다. 기존 일반 `KMONG_WORK_TARGET_GATE_20261112`의 목표 전 작업중 표시 유지 조항보다 **Astra에 한해서만** 이 최신 지시가 우선한다. 현행 **85% 잠정 / 목표95% 미달 / BASIC·PRO·BUSINESS RELEASE HOLD**. 사용자의 새로운 재개 지시 전에는 중앙 Astra `[작업중]`을 자동 복구하거나 코드를 계속 개발하지 않는다. 다른 제품의 목표 잠금과 상태는 변경하지 않는다. 사용자의 개입: 실제 PDF 제공·육안 검수, 구매자 Windows 실제 사용 검증, 한국어 모델/폰트 라이선스와 판매 승인 등. PRO20/BUSINESS30 구현도 남아 있으며 사용자만 하면 자동 95%가 되는 것은 아니다.

> **[KMONG_WORK_TARGET_GATE_20261112 | 사용자 최신 확정 | 필수 작업 규칙]** 이 저장소에서 크몽 상품·육성 후보를 작업하는 모든 AI 담당자는 새 채팅·`ㄱ` 시작 시 이 문구를 읽고 적용한다.
> - 실제 개발/수정/테스트 착수 즉시 [해총 크몽 최종완성률·후보 상태표](https://github.com/hibi89/hackathon-command-center-2026/blob/kmong-productization/docs/audits/KMONG_16_CURRENT_20261111.md)의 **해당 상품명 옆에 `**[작업중]**`을 표시하고 GitHub 커밋**한다. 확정 단계 목표(예: 95%)와 검증 기준을 제품 STATUS/HANDOFF에 남긴다.
> - **목표 완성률 달성 전에는 [작업중]을 삭제하지 않는다.** 일시중단·종료·보류·다른 제품 전환·담당 채팅 변경도 삭제 사유가 아니다. 예전 '전환·중단 시 삭제' 지시는 폐기한다.
> - **검증된 목표치에 도달한 뒤에만** 기능 SHA·PASS/FAIL/SKIP·미검증을 기록하고 자기 표시를 제거·커밋한다. 목표 하향/변경으로 표식 제거 시 사용자 명시 승인 필요. 다른 담당자 표시·기존 수치·RELEASE HOLD 보존.
> - 표식은 목표 미달 상태를 의미하며 **실시간 실행 증명은 아니다**. 허브 최신 HEAD 확인 후 안전하게 반영, 실패 시 `KMONG_HUB_SYNC_PENDING` 기록. 자동 동기화 없음. 크몽 외 작업에는 표시 불필요.

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
