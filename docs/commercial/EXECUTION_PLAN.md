# ASTRA — 72시간 MVP 우선 실행계획 (CURRENT SSOT)

> **Progress 2026-10-25 23:41 KST:** M01 and M02 targeted internal MVP slices verified; **M03-A deterministic proofreading proposal UI complete** (not an AI model); M03-B actual offline LLM still unimplemented/untested. Test SHA `768fc0183e8aa2f6f09d1a87458b8cb9347b6e73`; next M03-B feasibility and actual model-only upon cost/data/asset consent. The D1/D2 rows below are initial schedule, not current.

> **Current checkpoint (2026-10-25 23:25 KST):** M01 + M02 MVP slices **DONE and verified** at tested code `0671fde98b0fc91fc6b4bb6eb43fca6e5411621f`; next **M03 READY**. The original timeline table below is a baseline/history. See latest STATUS/HANDOFF/Mockup parity for current evidence. M03 rewrite and local LLM have NOT been verified or shipped.

**사용자 최종 지시 2026-10-25 KST:** 먼저 돌아가는 앱을 만들고 이전 목업 화면과 비교하면서 부족한 부분을 채운다. 고급 QA/보안·SKU 부가기능은 MVP 이후로 이월. **시작 10/25 → 목표 10/28 (72시간 도전 목표, 완료 보장 아님).**

## MVP의 진짜 완료 정의
- 지원되는 단순 **텍스트 중심 PDF** 하나 선택 → PDF.js 추출 → 원본 미리보기·텍스트 대조 → 문단 편집 → 최소 **2가지 확실히 구별되는 디자인** 선택 → 별도 새 A4 PDF 저장.
- Windows용 Electron + NSIS 설치형 실행 파일이 가능하면 3일 차에 패키징하고 실제 **Windows Actions 설치/실행/출력** 증거 확보. 고객 PC 직접 조작은 별도.
- 선택형 윤문: 기본 OFF, 규칙 검사·안전한 제안은 UI에 연결. **가능하면 작은 로컬 LLM 1종을 선택 문단에 100% 오프라인 연결**, 원문/제안 diff·수동 승인·되돌리기. **로컬 LLM이 실측 미통과면 'AI 윤문 완료'로 표시하지 않고 공개 판매 금지**. CPU 성능과 패키징을 72h 내 해결 못 할 위험은 명시.
- 컨셉 목업과 실제 앱 캡처의 **시각 차이표/우선수정 5건**을 작성하고 다음 반복 주기로 넘긴다. 이미지 흉내만 낸 데모는 MVP 아님.
- 고객 PDF 무단 전송 0 / 원본 PDF 바이트 불변 / 내보내기는 새 파일 / 기존 STEP1·2 데이터 삭제 금지 / 실패·미지원 입력 경고. **이 최소 안전/정확성은 미룰 수 없다.**
- 초기 MVP는 **내부 테스트/영상 가능 프로토타입**이지 크몽 유료 판매 승인이나 BASIC/PRO/BUSINESS의 완성품이 아니다.

## 최소 지원 범위
- 첫 시연: 정상적으로 텍스트 선택 가능한 A4 한국어 PDF **1~5쪽 우선**. 기존 PR3의 30MiB/50페이지 기술 제한은 유지하되 **검증된 판매 지원 범위라고 주장하지 않음**.
- 복잡 표, 스캔/OCR, 다단, 마스크·회전/수식/벡터 완전 재현, 이미지 완전복원, 일괄처리, 8/20/30 템플릿, 브랜드 키트, 라이선스 결제연동은 **MVP 제외**. 기존 PR3에 존재하는 이미지·위험 경고 코드는 망가뜨리지 않고 최대한 재사용.
- 3만/6만/9만원, 3개 전부 윤문 동일 제공은 **최종 판매 계획으로 유지**. MVP에서는 단일 통합 앱으로 핵심 여정 증명 후 SKU 분기 적용.

## Day별 절단점 (일정은 목표, 백그라운드 자동 진행 아님)
| 목표 시점 | 작업 ID / 우선 | 산출물 / 통과 증거 | 실패 시 우회 |
|---|---|---|---|
| **D1 10/25~26** | M01 P0 **READY** — 기존 PR3 PDF 가져오기 + PR4 Electron 저장코드 신속 통합 | `integration/astra-commercial-core`에 기존 코드 결합; npm test/build, 브라우저에서 선택형 PDF→A4 PDF 처음부터 끝 성공 | package/Workspace 충돌은 단순 UI로 좁히고 Electron 통합은 D3으로 |
| **D2 10/26~27** | M02 P0 WAIT(M01) — 화면 목업 기준 재조판·비교 | 왼쪽 문서/원본, 중앙 실제 A4, 오른쪽 스타일, 원본 대조, 디자인 2종 + 첫 실제 캡처·목업 5항목 차이표 | 애니메이션·브랜드 효과/수십 디자인은 중단, 사용동선 우선 |
| **D2 병행** | M03 P1 READY AFTER M01 — 선택형 안전 윤문 UI, 작은 모델 CPU 시연 | 룰 탐지+정밀 로컬모델 **최소 1문단** 정상 제안, diff/승인/롤백, 외부 API 0, 모델 라이선스 메모 | 모델 성능 미달 시 AI 버튼 미완료 표시, 추후 작업 이관/판매 보류 |
| **D3 10/27~28** | M04 P0 WAIT(M01,M02) — Windows 설치형 연결/스모크 | Windows x64 NSIS test installer, 설치→열기→PDF import→export→재실행; CI 로그/EXE SHA | Windows CI 지연 시 로컬 웹 기능 MVP로 범위를 축소하고 설치형 NOT RUN |
| **D3 종료** | M05 P0 WAIT(M02,M04) — 목업 대조·결함 정리·다음 순서 | 실제 앱 스크린샷 + 실제 PDF, 작동/미작동 표, 최고 우선 UX 갭 5건, 이어할 작업 READY | 핵심 E2E 실패시 3일 컷 '미달'이라고 보고, 전시 전 수정 |

## 개발 루프 (기존 장문 계획의 우선 순위를 교체)
```
PR3 기존 PDF import → 최소 A4 PDF 출력 → 4단계 화면 → 목업-실제 캡처 비교 → 로컬 윤문(옵션) → Windows NSIS → MVP 판정
                          ↖ 문제가 보이면 그 부분만 다시 고치기 ↗
```
- 매번 **실제 실행 가능 기능이 먼저**. 1작업=1 통과할 사용자 흐름. 목업과 실제 화면이 다르면 UI 바로 보정; 비주얼보다 PDF 기능 우선.
- QA를 전부 없애지는 않는다. M01 import/file-integrity + M04 Windows smoke는 절대 유지; 확장형 보안감사, 표/OCR 폭넓은 실문서, 라이선스·SmartScreen/코드서명, 저사양 대규모 벤치, 30종 디자인, 3 SKU 배포 QA는 **MVP 이후 / 유료판매 이전**.
- **적극 절단 기준:** 2번 시도해서 해결 안 되는 작업/이유 불분명한 옵션은 BLOCKED로 표시하고 최소 동선을 완성. 원본 PR3/PR4 브랜치와 main을 무단 변경하지 않는다.
- 실질 작업량 가정: **대략 16~30시간 집중 작업을 3일 안에 배치하는 도전적 스코프**, Windows/AI 모형 통합이 막히면 초과 가능. 177~370h는 [초기 과대 범위 전체 백로그](EXPANDED_BACKLOG_20261025.md)로 이관.

## MVP 후 Iteration
- V1 출시 준비: 실제 문서 5~10개 검증, 8가지 템플릿, 로컬 모델 한글 품질·CPU 기준 확정, 패키징/보안·3자 라이선스·설치 서명 문제, 정확한 BASIC 광고.
- PRO: 20템플릿·배치·프리셋; BUSINESS: 30템플릿·브랜드 키트·라이선스/고객지원. 세 상품 모두 같은 윤문 품질.
- **판매 NO-GO** 유지: 로컬 AI가 광고대로 작동하지 않거나 원문 누락·새 PDF 잘림·데이터 손상 있으면 크몽 판매 불가.

## Current
- **M01 READY.** 이전 `A02` 실제 PR3/PR4 통합을 M01에 흡수했다. 구 A~H 확장 작업목록은 구현 후 백로그로 이동.
- 총괄 상태/회고 `STATUS.md`, `HANDOFF.md`를 **실제 증거 기반**으로 갱신.
